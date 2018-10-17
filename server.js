import * as bodyParser from "body-parser";
import express from "express";
import router from "./api/routes";

const port = 3002;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

/* eslint-disable */
const server = app.listen(port, error => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`app ready on port ${server.address().port}`);
});
/* eslint-enable */
