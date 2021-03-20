import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// import Auth from '../utils/auth';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  // const [showModal, setShowModal] = useState(false);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Final Project
          </Typography>
          <nav>
            <Link as={Link} to='/' variant="button" color="textPrimary" className={classes.link}>
              Search Movies
            </Link>
            <Link as={Link} to='/saved' variant="button" color="textPrimary" className={classes.link}>
              Saved Movies
            </Link>
            <Link as={Link} to='/login' color="primary" variant="outlined" className={classes.link}>
              Login
          </Link>
            <Link as={Link} to='/signup' color="primary" variant="outlined" className={classes.link}>
              Sign Up
          </Link>
          </nav>
        </Toolbar>
      </AppBar>
    </React.Fragment >
  );
}

export default Navbar;
