import express from "express";
import actions from "./api/actions";

const router = express.Router();

/** Route to dispatch calls for available agents on given queue */
router.post("/actions", async (request, response) => {
  const actionCall = await actions(request.body);

  response.send({ status: actionCall.status });
});

export default router;
