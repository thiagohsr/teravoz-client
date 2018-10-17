import axios from "axios";

import {
  addCustomerContact,
  delegateCallApi,
  lookupCustomerContact,
} from "./client";

import actions from "./teravoz-api";

import { updateCallType } from "./common/utils";

import express from "express";

const router = express.Router();

/** Route to dispatch calls for available agents on given queue */
router.post("/actions", async (request, response) => {
  const actionCall = await actions(request.body);
  response.send({ status: actionCall.status });
});

/** Route receive Teravoz payloads, verify customer */
router.post("/webhook", async (request, response) => {
  const callData = request.body;
  const { their_number: incomingCallNumber } = callData;
  const customer = await lookupCustomerContact(incomingCallNumber);
  const isNewCustomer = customer.length ? false : true;

  if (callData.type === "call.standby") {
    // callData.type = updateCallType(callData.type);
    if (isNewCustomer) {
      const newCustomer = await addCustomerContact(callData);
    }
    const teravozCall = await delegateCallApi(callData, isNewCustomer);
  }

  response.send(callData);
});

router.get("/health-check", (request, response) => {
  response.send("server up and running");
});

export default router;
