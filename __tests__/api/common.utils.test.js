import { updateCallType } from "api/common/utils";

describe("Api common utils tests", () => {
  it("should return call.standby when receive call.new", () => {
    const expected_value = "call.standby";
    const send_value = updateCallType("call.new");

    expect(send_value).toBe(expected_value);
  });

  it("should return delegate when receive call.standby", () => {
    const expected_value = "delegate";
    const send_value = updateCallType("call.standby");

    expect(send_value).toBe(expected_value);
  });
});
