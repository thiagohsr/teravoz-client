import * as bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";

import router from "./routes";

const host = "0.0.0.0";
const port = 3001;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

/* eslint-disable */
const server = createServer(app);

server.listen(port, host, error => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`teravoz api ready on port ${server.address().port}`);
});
