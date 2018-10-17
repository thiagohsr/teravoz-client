import axios from "axios";
import { updateCallType } from "./common/utils";

/** Add new customer to customer_contact_list */
const addCustomerContact = async ({ their_number }) => {
  const incomingCallNumber = their_number;
  const newCustomer = await axios
    .post("http://localhost:3000/customer_contact_list", {
      customer_number: incomingCallNumber,
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
  return newCustomer.data;
};

/** Return the queueId for given queueNumber */
const getQueueId = async queueNumber => {
  const queueId = await axios
    .get(`http://localhost:3000/queues/${queueNumber}/`)
    .then(res => res.data)
    .catch(error => error);
  return queueId[0].id;
};

/** Return available agents for a given queueId */
const getAvailableAgentsFromQueue = async queue => {
  const queueId = await getQueueId(queue);
  const availableAgents = await axios
    .get(`http://localhost:3000/callcenter_agents/${queueId}/available-agents/`)
    .then(res => res.data)
    .catch(error => error);

  return availableAgents;
};

/** Update agent object for the first available agent with caller information */
const updateAgentWithCallData = async (callData, queue) => {
  const availableAgents = await getAvailableAgentsFromQueue(queue);
  const { call_id: callId, their_number: callerNumber, type: type } = callData;
  const agent = availableAgents[0];
  const agentPayload = {
    status: "unavailable",
    call_id: callId,
    type: type,
    caller_number: callerNumber,
  };
  const response = await axios
    .patch(`http://localhost:3000/callcenter_agents/${agent.id}/`, agentPayload)
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
  const {
    call_id: callId,
    their_number: incomingCallNumber,
    type: type,
  } = incomingCall;

  // Condition to decide queue based on customer type
  const queue = isNewCustomer ? 900 : 901;

  // Payload to teravoz-api
  const payload_delegate = {
    call_id: callId,
    type: updateCallType(type),
    destination: queue,
  };

  const response = await axios
    .post("http://localhost:3002/actions", payload_delegate)
    .then(res => {
      return res.data;
    })
    .catch(error => error);

  incomingCall.type = updateCallType(payload_delegate.type);
  const callRedirection = await updateAgentWithCallData(incomingCall, queue);
  return response;
};

/** Look for customer on contact list and return a list */
const lookupCustomerContact = async customerNumber => {
  return await axios
    .get("http://localhost:3000/customer_contact_list", {
      params: {
        customer_number: customerNumber,
      },
    })
    .then(res => res.data)
    .catch(error => error);
};

export {
  addCustomerContact,
  delegateCallApi,
  getQueueId,
  getAvailableAgentsFromQueue,
  updateAgentWithCallData,
  lookupCustomerContact,
};
