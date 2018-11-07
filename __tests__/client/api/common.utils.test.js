import { updateCallType } from "api/common/utils";

describe("Api common utils tests", () => {
  it("should return call.standby when receive call.new", () => {
    const expectedValue = "call.standby";
    const sendValue = updateCallType("call.new");

    expect(sendValue).toBe(expectedValue);
  });

  it("should return delegate when receive call.standby", () => {
    const expectedValue = "delegate";
    const sendValue = updateCallType("call.standby");

    expect(sendValue).toBe(expectedValue);
  });

  it("should return call.ongoing when receive delegate", () => {
    const expectedValue = "call.ongoing";
    const sendValue = updateCallType("delegate");

    expect(sendValue).toBe(expectedValue);
  });
});
