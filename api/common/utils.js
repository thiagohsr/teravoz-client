const updateCallType = callType => {
  if (callType === "call.new") {
    return "call.standby";
  } else if (callType === "call.standby") {
    return "delegate";
  } else if (callType === "delegate") {
    return "call.ongoing";
  }
};

export { updateCallType };
