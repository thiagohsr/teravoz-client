import express from "express";

import { redirectCallToCallCenterAgent } from "api/client";

const router = express.Router();

/** Route receive Teravoz payloads, verify customer */
router.post("/webhook", async (request, response) => {
  await redirectCallToCallCenterAgent(request.body);
  response.send(request.body);
});

router.get("/", (request, response) => {
  response.send("server up and running");
});

export default router;
