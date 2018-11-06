import {
  addCustomerContact,
  delegateCallApi,
  getQueueId,
  getAvailableAgentsFromQueue,
  lookupCustomerContact,
  updateAgentWithCallData,
} from "api/client";

import mockAxios from "axios";

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
});
