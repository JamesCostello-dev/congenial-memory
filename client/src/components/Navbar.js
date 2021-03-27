import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../AppContext.js';
import Auth from '../utils/auth';

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
    backgroundColor: '#222831'
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#eeeeee',
  },
  link: {
    margin: theme.spacing(1, 1.5),
    fontSize: '1.5em',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#eeeeee',
    '&:hover': {
      color: "#61afef",
    },
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(25),
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
  const { loggedIn, setLoggedIn } = useContext(AppContext);
  const history = useHistory();

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
    history.push('/');
    setLoggedIn(false);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Movie DB Search
          </Typography>
          <nav>
            <Link to='/' className={classes.link}>
              Search Movies
            </Link>
            {Auth.loggedIn() ? (
              <>
                <Link to='/saved' className={classes.link}>
                  Saved Movies
            </Link>
                <Link to='/' onClick={logout} className={classes.link}>
                  logout
          </Link>
              </>
            ) : (
              <Link to='/login' className={classes.link}>
                Login
              </Link>
            )}
          </nav>
        </Toolbar>
      </AppBar>
    </React.Fragment >
  );
}

export default Navbar;
