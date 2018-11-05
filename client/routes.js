import express from "express";

import {
  addCustomerContact,
  delegateCallApi,
  lookupCustomerContact,
} from "api/client";

const router = express.Router();

/** Route receive Teravoz payloads, verify customer */
router.post("/webhook", async (request, response) => {
  const callData = request.body;
  const { their_number: incomingCallNumber } = callData;
  const customer = await lookupCustomerContact(incomingCallNumber);
  const isNewCustomer = !customer.length;

  if (callData.type === "call.standby") {
    if (isNewCustomer) {
      await addCustomerContact(callData);
    }
    await delegateCallApi(callData, isNewCustomer);
  } else if (callData.type === "call.delegate") {
    // console.log("webhook once => ", response.req.body);
  }

  response.send(callData);
});

router.get("/", (request, response) => {
  response.send("server up and running");
});

export default router;
