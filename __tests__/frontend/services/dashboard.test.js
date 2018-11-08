import mockAxios from "axios";

import Home from "frontend/pages";
import { enableAgentOnQueue } from "services/dashboard";

let pagePropsData;
let agentData;

describe("Test frontend services", () => {
  beforeEach(() => {
    pagePropsData = { pageProps: { agents: [] } };
    agentData = {
      queueId: 1,
      agent_number: 9001,
      id: 1,
    };
  });

  it(`should getAgents called and return an empty agents`, async () => {
    const getAgents = mockAxios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [],
        })
      )
      .mockResolvedValue({
        data: [pagePropsData],
      });
    const getInitialPropsCall = await Home.getInitialProps();
    const { pageProps } = getInitialPropsCall;
    expect(getAgents).toBeCalled();
    expect(pageProps.agents.length).toEqual(0);
  });
  it(`should enableAgentOnQueue to be called`, async () => {
    const enableAgentOnQueueMock = mockAxios.put.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          queueId: 1,
          agent_number: 9001,
          id: 1,
        },
      })
    );
    const response = await enableAgentOnQueue(
      agentData.id,
      agentData.agent_number,
      agentData.queueId
    );

    expect(enableAgentOnQueueMock).toBeCalled();
    expect(response).toEqual(agentData);
  });
});
