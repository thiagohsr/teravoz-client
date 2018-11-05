import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import blue from "@material-ui/core/colors/blue";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Phonelink from "@material-ui/icons/Phonelink";
import Typography from "@material-ui/core/Typography";
import { enableAgentOnQueue } from "services/dashboard";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
  callerNumber: {
    marginTop: 15,
    marginBottom: 15,
  },
  paper: {
    ...theme.typography.button,
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
});

class Dashboard extends PureComponent {
  /** Update agent data in callcenter_agents */
  hangoutCall = (agentId, agentNumber, agentQueueId) => {
    enableAgentOnQueue(agentId, agentNumber, agentQueueId)
  }

  render() {
    const { agents, classes } = this.props;

    return (
      <Fragment>
        {agents.length
          ? agents.map(objAgent => (
            <Grid item xs={4} key={objAgent.id}>
              <Paper
                className={classes.paper}
                style={
                    objAgent.status === "unavailable"
                      ? { background: blue[300] }
                      : null
                  }
              >
                <Grid container spacing={16}>
                  <Grid item xs={2}>
                    <Avatar
                      style={
                          objAgent.status === "unavailable"
                            ? { background: "white" }
                            : null
                        }
                    >
                      <Phonelink
                        style={
                            objAgent.status === "unavailable"
                              ? { color: blue[300] }
                              : null
                          }
                      />
                    </Avatar>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography
                      variant="h4"
                      component="h3"
                      style={
                          objAgent.status === "unavailable"
                            ? { color: "white" }
                            : null
                        }
                    >
                      {objAgent.agent_number}
                    </Typography>
                    {objAgent.caller_number ? (
                      <Fragment>
                        <Typography
                          variant="caption"
                          component="h4"
                          className={classes.callerNumber}
                        >
                            Número do cliente:
                          {objAgent.caller_number}
                        </Typography>
                        <Divider light />
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          onClick={() => {
                              this.hangoutCall(
                                objAgent.id,
                                objAgent.agent_number,
                                objAgent.queueId
                              );
                            }}
                        >
                            Finalizar chamada
                        </Button>
                      </Fragment>
                      ) : null}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            ))
          : null}
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  agents: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
export default withStyles(styles)(Dashboard);
