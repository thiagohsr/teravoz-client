import {
  addCustomerContact,
  delegateCallApi,
  getQueueByCustomerType,
  getQueueId,
  getAvailableAgentsFromQueue,
  getOrCreateAgent,
  lookupCustomerContact,
  redirectCallToCallCenterAgent,
  updateAgentWithCallData,
} from "api/client";

import mockAxios from "axios";
import { updateCallType } from "api/common/utils";

describe("Api client test methods", () => {
  it(`should add customer contact in customer_contact_list`, async () => {
    const expectedResponse = {
      id: 1,
      customer_number: "11999921320",
    };
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: expectedResponse,
      })
    );

    const newCustomer = await addCustomerContact(expectedResponse);

    expect(newCustomer).toEqual(expectedResponse);
  });

  it(`should return queue 900 to new customer`, async () => {
    const expectedQueueNumber = 900;
    const newCustomer = true;
    const queueNumber = getQueueByCustomerType(newCustomer);

    expect(queueNumber).toEqual(expectedQueueNumber);
  });

  it(`should return queue 901 to existing customer`, async () => {
    const expectedQueueNumber = 901;
    const newCustomer = false;
    const queueNumber = getQueueByCustomerType(newCustomer);

    expect(queueNumber).toEqual(expectedQueueNumber);
  });

  it(`should return queue id for a given queue number`, async () => {
    const expectedId = 1;
    const queueNumber = 900;
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ id: 1 }],
      })
    );
    const queueId = await getQueueId(queueNumber);

    expect(queueId).toEqual(expectedId);
  });

  it(`should return available agents for a given queue`, async () => {
    const queueNumber = 900;
    const expectedResponse = {
      id: 2,
      queueId: 2,
      agent_number: 9010,
      status: "available",
    };
    mockAxios.get.mockResolvedValue({
      data: [
        {
          id: 2,
          queueId: 2,
          agent_number: 9010,
          status: "available",
        },
      ],
    });
    const availableAgents = await getAvailableAgentsFromQueue(queueNumber);

    expect(availableAgents).toEqual(expectedResponse);
  });

  it(`should return updated agent data for give call data`, async () => {
    const expectedResponse = {
      id: 2,
      queueId: 2,
      agent_number: 9010,
      status: "unavailable",
      type: "call.ongoing",
      call_id: "95dff755-ca7a-46bf-a73d-4212c46bcf00",
      caller_number: "11999921324",
    };
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ id: 2 }],
      })
    );
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            id: 2,
            queueId: 2,
            agent_number: 9010,
            status: "available",
          },
        ],
      })
    );
    mockAxios.patch.mockResolvedValue({
      data: {
        id: 2,
        queueId: 2,
        agent_number: 9010,
        status: "unavailable",
        type: "call.ongoing",
        call_id: "95dff755-ca7a-46bf-a73d-4212c46bcf00",
        caller_number: "11999921324",
      },
    });

    const updateAgent = await updateAgentWithCallData(expectedResponse, 900);

    expect(updateAgent).toEqual(expectedResponse);
  });

  it(`should return status ok`, async () => {
    const expectedResponse = { status: "ok" };
    const incomingCall = {
      id: 2,
      queueId: 2,
      agent_number: 9010,
      status: "unavailable",
      type: "delegate",
      call_id: "95dff755-ca7a-46bf-a73d-4212c46bcf00",
      their_number: "11999921324",
    };
    const mockedCall = mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { status: "ok" },
      })
    );
    const response = await delegateCallApi(incomingCall, true);

    expect(response).toEqual(expectedResponse);
    expect(mockedCall.mock.calls[1][1].call_id).toBe(incomingCall.call_id);
    expect(response.status).toBe(expectedResponse.status);
  });

  it(`should return list with found customer contact`, async () => {
    const expectedResponse = {
      customer_number: "11999921320",
      id: 10,
    };

    mockAxios.get.mockResolvedValue({
      data: {
        customer_number: "11999921320",
        id: 10,
      },
    });

    const response = await lookupCustomerContact(
      expectedResponse.customer_number
    );

    expect(response.customer_number).toBe(expectedResponse.customer_number);
  });

  it(`should return existing agent from given queue`, async () => {
    const queueNumber = 900;
    const expectedResponse = {
      queueId: 1,
      agent_number: 9001,
      status: "available",
      id: 1,
    };

    /** Mock chain of axios calls inside client methods */
    const mockedCalls = mockAxios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ id: 1 }],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            {
              queueId: 1,
              agent_number: 9001,
              status: "available",
              id: 1,
            },
          ],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ id: 1 }],
        })
      );

    const response = await getOrCreateAgent(queueNumber);

    expect(mockedCalls).toBeCalled();
    expect(response.queueId).toBe(expectedResponse.queueId);
    expect(response.agent_number).toEqual(expectedResponse.agent_number);
  });

  it(`should create and return agent from given queue`, async () => {
    const queueNumber = 900;
    const expectedResponse = {
      queueId: 1,
      agent_number: Math.random().toFixed(4),
      status: "available",
      id: 1,
    };

    const mockedCalls = mockAxios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ id: 1 }],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ id: 1 }],
        })
      );

    mockAxios.post.mockResolvedValue({
      data: {
        queueId: 1,
        agent_number: expectedResponse.agent_number,
        status: "available",
        id: 1,
      },
    });

    const response = await getOrCreateAgent(queueNumber);

    expect(mockedCalls).toBeCalled();
    expect(response.queueId).toBe(expectedResponse.queueId);
    expect(response.agent_number).toBe(expectedResponse.agent_number);
  });

  it(`should call lookupCustomerContact, addCustomerContact and delegateCallApi methods if type is call.new`, async () => {
    const callData = {
      type: "call.standby",
      call_id: "ed4f5f5e-91b6-4b8a-bc29-e7a9950ae953",
      code: "123456",
      direction: "inbound",
      our_number: "0800000000",
      their_number: "11999999999",
      their_number_type: "mobile",
      timestamp: "1541523584",
    };
    const expectedData = {
      status: 200,
    };
    const lookupCustomerContactMock = mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          customer_number: callData.their_number,
        },
      })
    );

    const addCustomerContactMock = mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          id: 1,
          customer_number: callData.their_number,
        },
      })
    );

    const delegateCallApiMock = mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          status: 200,
        },
      })
    );

    const response = await redirectCallToCallCenterAgent(callData);

    expect(response.status).toEqual(expectedData.status);
    expect(lookupCustomerContactMock).toBeCalled();
    expect(addCustomerContactMock).toBeCalled();
    expect(delegateCallApiMock).toBeCalled();
  });

  it(`should call updateAgentWithCallData if type is delegate`, async () => {
    const callData = {
      type: "delegate",
      call_id: "ed4f5f5e-91b6-4b8a-bc29-e7a9950ae953",
      code: "123456",
      direction: "inbound",
      our_number: "0800000000",
      their_number: "11999999999",
      their_number_type: "mobile",
      timestamp: "1541523584",
    };
    const agentData = {
      id: 2,
      queueId: 2,
      agent_number: 9010,
      status: "available",
    };
    mockAxios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ id: 1 }],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [agentData],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ id: 1 }],
        })
      );
    const updateAgentWithCallDataMock = mockAxios.patch.mockImplementationOnce(
      () =>
        Promise.resolve({
          data: {
            ...callData,
            type: updateCallType(callData.type),
          },
        })
    );

    const response = await redirectCallToCallCenterAgent(callData);

    expect(response.type).not.toBe(callData.type);
    expect(response.call_id).toEqual(callData.call_id);
    expect(updateAgentWithCallDataMock).toBeCalled();
  });

  it(`should return message if call data hasn't type key`, async () => {
    const callData = {
      call_id: "ed4f5f5e-91b6-4b8a-bc29-e7a9950ae953",
      code: "123456",
      direction: "inbound",
      our_number: "0800000000",
      their_number: "11999999999",
      their_number_type: "mobile",
      timestamp: "1541523584",
    };
    const expectedResponse = { message: "Request data needs to have a type." };
    const response = await redirectCallToCallCenterAgent(callData);

    expect(response).toEqual(expectedResponse);
  });
});
