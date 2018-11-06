import * as bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";

import fs from "fs";
import router from "./routes";

const host = "0.0.0.0";
const port = 3002;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

/* eslint-disable */
const server = createServer(app);

server.listen(port, host, error => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`client app ready on port ${server.address().port}`);
});
/* eslint-enable */

const io = require("socket.io")(server);

const agentUpdate = socket => {
  fs.watch("./jsonServer/db.json", (eventType, filename) => {
    if (filename && eventType === "change") {
      io.emit("agentsUpdate", {
        message: `agents updated`,
      });

      io.emit("connection", socket);
    }
  });
};

io.on("connection", socket => {
  agentUpdate(socket);
});
