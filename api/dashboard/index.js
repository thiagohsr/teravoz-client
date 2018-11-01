import axios from "axios";
import openSocket from "socket.io-client";
import { DATA_API, CLIENT_URL } from "settings";

const socket = openSocket(`${CLIENT_URL}/`);

const connect = cb => {
  socket.on("agentsUpdate", message => {
    cb(message);
    socket.emit("connect");
  });
};

const getAgents = () =>
  axios
    .get(`${DATA_API}/callcenter_agents`)
    .then(res => res.data)
    .catch(error => error);

export { connect, getAgents };
