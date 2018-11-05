const updateCallType = callType => {
  const events = {
    "call.new": "call.standby",
    "call.standby": "delegate",
    delegate: "call.ongoing",
  };
  return events[callType];
};

export { updateCallType };
