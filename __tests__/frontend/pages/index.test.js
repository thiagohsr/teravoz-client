import { mount } from "enzyme";
import React from "react";
import Home from "frontend/pages";

let context;
let mounted;

describe("Test Home component", () => {
  beforeEach(() => {
    context = { pageProps: { agents: [] } };
    mounted = mount(<Home {...context} />);
  });

  it(`should home component mounted`, async () => {
    expect(mounted.children().name()).toBe("Home");
    expect(mounted.children()).toMatchSnapshot();
  });
  it(`should have children Dashboard node`, async () => {
    expect(
      mounted
        .children()
        .find("Dashboard")
        .name()
    ).toBe("Dashboard");
    expect(mounted.children().exists("Dashboard")).toBe(true);
  });
});
