import axios from "axios";
import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { DATA_API } from "settings";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Dashboard from "./components/dashboard";
import Layout from "./components/Layout";

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class Home extends Component {
  static async getInitialProps() {
    const agents = await axios
      .get(`${DATA_API}/callcenter_agents`)
      .then(res => res.data)
      .catch(error => error);

    return {
      pageProps: {
        agents,
      },
    };
  }

  render() {
    const { pageProps } = this.props;
    const { agents } = pageProps;
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
  pageProps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Home);
