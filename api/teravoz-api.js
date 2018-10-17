import axios from "axios";

const actions = callData => {
  const response = axios
    .post(`http://localhost:3002/webhook/`, callData)
    .then(res => res)
    .catch(error => error);

  return response;
};

export default actions;
