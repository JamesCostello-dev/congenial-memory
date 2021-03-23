import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  top: {
    paddingTop: "50px",
  },
}));

const Copyright = () => {

  const classes = useStyles();

  return (
    <Typography variant="body2" color="textSecondary" align="center" className={classes.top}>
      {'Copyright © '}
      <Link color="inherit">
        Final Project
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;