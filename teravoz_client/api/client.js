import axios from "axios";
import { DATA_API, TERAVOZ_URL, QUEUES } from "settings";

import { updateCallType } from "./common/utils";

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
  const availableAgents = await axios
    .get(`${DATA_API}/callcenter_agents/${queueId}/available-agents/`)
    .then(res => res.data)
    .catch(error => error);

  return availableAgents;
};

/** Update agent object for the first available agent with caller information */
const updateAgentWithCallData = async (callData, queue) => {
  const availableAgents = await getAvailableAgentsFromQueue(queue);
  const { call_id: callId, their_number: callerNumber, type } = callData;
  const agent = availableAgents[0];
  const agentPayload = {
    status: "unavailable",
    call_id: callId,
    type,
    caller_number: callerNumber,
  };
  const response = await axios
    .patch(`${DATA_API}/callcenter_agents/${agent.id}/`, agentPayload)
    .then(res => res)
    .catch(error => error);

  return response.data;
};

/**
 *  Call teravoz-api route, decide queue based on customer type, invoke
 *  updateAgentWithCallData method to refresh callcenter agent with incomingCall
 *  data and return request status
 */
const delegateCallApi = async (incomingCall, isNewCustomer) => {
  const { call_id: callId, type } = incomingCall;

  // Condition to decide queue based on customer type
  const queue = isNewCustomer ? QUEUES.NEW_CUSTOMER : QUEUES.CUSTOMER;

  // Payload to teravoz-api
  const payloadDelegate = {
    call_id: callId,
    type: updateCallType(type),
    destination: queue,
  };

  const response = await axios
    .post(`${TERAVOZ_URL}/actions`, payloadDelegate)
    .then(res => res.data)
    .catch(error => error);

  const updateIncomingCall = {
    ...incomingCall,
    type: updateCallType(payloadDelegate.type),
  };
  await updateAgentWithCallData(updateIncomingCall, queue);
  return response;
};

/** Look for customer on contact list and return a list
 *  with found customer
 */
const lookupCustomerContact = customerNumber =>
  axios
    .get(`${DATA_API}/customer_contact_list`, {
      params: {
        customer_number: customerNumber,
      },
    })
    .then(res => res.data)
    .catch(error => error);

export {
  addCustomerContact,
  delegateCallApi,
  getQueueId,
  getAvailableAgentsFromQueue,
  updateAgentWithCallData,
  lookupCustomerContact,
};