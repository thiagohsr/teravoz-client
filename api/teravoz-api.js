import axios from "axios";

const actions = callData => {
  const { call_id: callId } = callData;
  callData.their_number = "123123132";
  const response = axios
    .post(`http://localhost:3002/webhook/`, callData)
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });

  return response;
};

export default actions;
