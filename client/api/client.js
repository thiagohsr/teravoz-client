import axios from "axios";
import { DATA_API, TERAVOZ_URL, QUEUES } from "settings";

import { updateCallType } from "api/common/utils";

import loki from "lokijs";

/* eslint-disable */
/** package that's create in memory list of incoming calls */
const db = new loki("incoming_calls.db");
const incomingCalls = db.addCollection("incoming_calls");
/* eslint-enable */

/** Add new customer to customer_contact_list */
/* eslint-disable */
const addCustomerContact = async ({ their_number }) => {
  const incomingCallNumber = their_number;
  /* eslint-enable */
  const newCustomer = await axios
    .post(`${DATA_API}/customer_contact_list`, {
      customer_number: incomingCallNumber,
    })
    .then(res => res)
    .catch(error => error);
  return newCustomer.data;
};

/** Return the queueId for given queueNumber */
const getQueueId = async queueNumber => {
  const queueId = await axios
    .get(`${DATA_API}/queues/${queueNumber}/`)
    .then(res => res.data)
    .catch(error => error);
  return queueId[0].id;
};

/** Return available agents for a given queueId */
const getAvailableAgentsFromQueue = async queue => {
  const queueId = await getQueueId(queue);
  try {
    const availableAgents = await axios
      .get(`${DATA_API}/callcenter_agents/${queueId}/available-agents/`)
      .then(res => res.data);

    return availableAgents[0];
  } catch (error) {
    return { message: `All agents unavailable. ${error}` };
  }
};

/** Return a Agent or create one for given Queue number */
const getOrCreateAgent = async queue => {
  const availableAgents = await getAvailableAgentsFromQueue(queue);
  const agentPayload = {
    queueId: await getQueueId(queue),
    agent_number: queue + Math.random().toFixed(4),
    status: "available",
  };
  const agent =
    availableAgents ||
    (await axios
      .post(`${DATA_API}/callcenter_agents/`, agentPayload)
      .then(res => res.data)
      .catch(error => ({ message: error.message })));
  return agent;
};

/** Update agent object for the first available agent with caller information */
const updateAgentWithCallData = async (callData, queue) => {
  const availableAgent = await getOrCreateAgent(queue);
  const updateCallData = {
    ...callData,
    type: updateCallType(callData.type),
  };

  const { call_id: callId, their_number: callerNumber, type } = updateCallData;
  const agentPayload = {
    status: "unavailable",
    call_id: callId,
    type,
    caller_number: callerNumber,
  };

  try {
    const response = await axios
      .patch(
        `${DATA_API}/callcenter_agents/${availableAgent.id}/`,
        agentPayload
      )
      .then(res => res);

    return response.data;
  } catch (error) {
    return { message: `All agents busy.${error.message}` };
  }
};

/** Return queue number for given customer type */
const getQueueByCustomerType = customerType => {
  const queue = customerType ? QUEUES.NEW_CUSTOMER : QUEUES.CUSTOMER;
  return Number(queue);
};

/**
 *  Call teravoz-api route, decide queue based on customer type, invoke
 *  updateAgentWithCallData method to refresh callcenter agent with incomingCall
 *  data and return request status
 */
const delegateCallApi = async (incomingCall, isNewCustomer) => {
  const { call_id: callId, type } = incomingCall;

  // Condition to decide queue based on customer type
  const queue = getQueueByCustomerType(isNewCustomer);

  // Payload to teravoz-api
  const payloadDelegate = {
    call_id: callId,
    type: updateCallType(type),
    destination: queue,
  };
  try {
    const response = await axios
      .post(`${TERAVOZ_URL}/actions`, payloadDelegate)
      .then(res => res.data);

    return response;
  } catch (error) {
    return { message: `Trouble on delegate call api. ${error.message}` };
  }
};

/** Look for customer on contact list and return a list
 *  with found customer
 */
const lookupCustomerContact = callPayload => {
  const { their_number: customerNumber } = callPayload;

  try {
    const response = axios
      .get(`${DATA_API}/customer_contact_list`, {
        params: {
          customer_number: customerNumber,
        },
      })
      .then(res => res.data);
    return response;
  } catch (error) {
    return { message: `Trouble when lookup for customer. ${error.message}` };
  }
};

/** Receive a request body and invokes methods that's depends what type of call.
 */
const redirectCallToCallCenterAgent = async callData => {
  /** save incoming call data in memory */
  incomingCalls.insert(callData);

  if (callData.type === "call.standby") {
    const customer = await lookupCustomerContact(callData);
    const isNewCustomer = !customer.length;

    if (isNewCustomer) {
      await addCustomerContact(callData);
    }
    return delegateCallApi(callData, isNewCustomer);
  }
  if (callData.type === "delegate") {
    /** retrieve incoming call data from memory */
    const call = incomingCalls.findOne({ call_id: callData.call_id });

    return updateAgentWithCallData(call, call.destination);
  }
  return { message: "Request data needs to have a type." };
};

export {
  addCustomerContact,
  delegateCallApi,
  getQueueByCustomerType,
  getQueueId,
  getAvailableAgentsFromQueue,
  getOrCreateAgent,
  lookupCustomerContact,
  redirectCallToCallCenterAgent,
  updateAgentWithCallData,
};
