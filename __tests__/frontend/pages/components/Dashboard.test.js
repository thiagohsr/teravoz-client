import { mount } from "enzyme";
import React from "react";
import Dashboard from "frontend/pages/components/Dashboard";

let context;
let mounted;

describe("Test dashboard component", () => {
  beforeEach(() => {
    context = {
      agents: [
        {
          queueId: 1,
          agent_number: 9001,
          status: "unavailable",
          id: 1,
          call_id: "0dab4d22-e7c6-4f42-9dcf-9d6139913939",
          type: "call.ongoing",
          caller_number: "11999999216",
        },
        {
          queueId: 2,
          agent_number: 9010,
          status: "unavailable",
          id: 2,
          call_id: "18312967-3857-4c75-8e43-3a1ac66476c5",
          type: "call.ongoing",
          caller_number: "11999999999",
        },
        {
          queueId: 2,
          agent_number: 9011,
          status: "available",
          id: 3,
        },
      ],
    };

    mounted = mount(<Dashboard {...context} />);
  });

  it(`should dashboard component mounted`, async () => {
    expect(mounted.children()).toMatchSnapshot();
    expect(mounted.children().name()).toBe("Dashboard");
  });

  it(`should dashboard component have three Paper childrens`, async () => {
    expect(
      mounted
        .children()
        .find("Paper")
        .first()
        .name()
    ).toBe("Paper");
    expect(mounted.children().find("Paper").length).toEqual(3);
  });

  it(`should dashboard Paper info match context data`, async () => {
    expect(
      mounted
        .children()
        .find(".callerNumber")
        .at(0)
        .text()
    ).toEqual(context.agents[0].caller_number);
    expect(
      mounted
        .children()
        .find(".callerNumber")
        .at(1)
        .text()
    ).toEqual(context.agents[1].caller_number);
  });
  it(`should hangoutCall to be called`, async () => {
    const hangoutCallMock = jest.spyOn(
      mounted.children().instance(),
      "hangoutCall"
    );

    mounted
      .children()
      .find("Paper")
      .at(0)
      .find("Button")
      .simulate("click");

    expect(hangoutCallMock).toHaveBeenCalled();
  });
});
