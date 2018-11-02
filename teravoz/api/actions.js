import axios from "axios";
import { CLIENT_URL } from "settings";

const actions = callData => {
  const response = axios
    .post(`${CLIENT_URL}/webhook/`, callData)
    .then(res => res)
    .catch(error => error);

  return response;
};

export default actions;
