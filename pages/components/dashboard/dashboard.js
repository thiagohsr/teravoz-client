import React, { Fragment } from "react";
import PropTypes from "prop-types";
import blue from "@material-ui/core/colors/blue";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    ...theme.typography.button,
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
});

const Dashboard = props => {
  const { classes, agents } = props;

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
                <Typography variant="caption" component="h5">
                    Número do cliente:
                  {objAgent.caller_number}
                </Typography>
                ) : null}
            </Paper>
          </Grid>
          ))
        : null}
    </Fragment>
  );
};

Dashboard.propTypes = {
  agents: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.arrayOf(PropTypes.array).isRequired,
};
export default withStyles(styles)(Dashboard);
