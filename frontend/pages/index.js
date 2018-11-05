import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { connect, getAgents } from "services/dashboard";

import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class Home extends Component {
  static async getInitialProps() {
    const agents = await getAgents();
    return {
      pageProps: {
        agents,
      },
    };
  }

  constructor(props) {
    super(props);
    const { pageProps } = this.props;
    this.state = {
      agents: pageProps.agents,
    };
    connect(() => {
      this.updateAgents();
    });
  }

  updateAgents = async () => {
    this.setState({
      agents: await getAgents(),
    });
  };

  render() {
    const { agents } = this.state;
    return (
      <Fragment>
        <Layout>
          <Grid item xs={12}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  Dashboard de agentes
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>
          <Dashboard agents={agents} />
        </Layout>
      </Fragment>
    );
  }
}

Home.propTypes = {
  pageProps: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default withStyles(styles)(Home);
