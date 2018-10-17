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
    const expected_response = {
      id: 1,
      customer_number: "11999921320",
    };
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: expected_response,
      })
    );

    const newCustomer = await addCustomerContact(expected_response);

    expect(newCustomer).toEqual(expected_response);
  });

  it(`should return queue id for a given queue number`, async () => {
    const expected_id = 1;
    const queueNumber = 900;
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ id: 1 }],
      })
    );
    const queueId = await getQueueId(queueNumber);

    expect(queueId).toEqual(expected_id);
  });

  it(`should return available agents for a given queue`, async () => {
    const queueNumber = 900;
    const expected_response = [
      {
        id: 2,
        queueId: 2,
        agent_number: 9010,
        status: "available",
      },
    ];
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

    expect(availableAgents).toEqual(expected_response);
  });

  it(`should return updated agent data for give call data`, async () => {
    const expected_response = {
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

    const updateAgent = await updateAgentWithCallData(expected_response, 900);

    expect(updateAgent).toEqual(expected_response);
  });

  it(`should return status ok`, async () => {
    const expected_response = { status: "ok" };
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

    expect(response).toEqual(expected_response);
    expect(mockedCall.mock.calls[1][1].call_id).toBe(incomingCall.call_id);
    expect(response.status).toBe(expected_response.status);
  });

  it(`should return list with found customer contact`, async () => {
    const expected_response = {
      customer_number: "11999921320",
      id: 10,
    };

    const mockedCall = mockAxios.get.mockResolvedValue({
      data: {
        customer_number: "11999921320",
        id: 10,
      },
    });

    const response = await lookupCustomerContact(
      expected_response.customer_number
    );
    expect(response.customer_number).toBe(expected_response.customer_number);
  });
});
