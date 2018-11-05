import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
});

const Layout = props => {
  const { classes, children } = props;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid container>{children}</Grid>
    </div>
  );
};

Layout.propTypes = {
  classes: PropTypes.arrayOf(PropTypes.array).isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Layout);
