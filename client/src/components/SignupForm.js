import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations'
import { useMutation } from '@apollo/client'
import FormHelperText from '@material-ui/core/FormHelperText';
import AppContext from '../AppContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '1.5em',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: 'black',
    backgroundColor: '#ffd369',
    fontWeight: 'bold',
    '&:hover': {
      color: "#61afef",
      backgroundColor: '#393e46'
    },
  },
}));


const SignupForm = () => {
  const classes = useStyles();
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER);
  const history = useHistory();
  const {setLoggedIn} = useContext(AppContext);
 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      if (error) {
        throw new Error('Something went wrong')
      }

      Auth.login(data.addUser.token);
	history.push('/');
	setLoggedIn(true);
    } catch (err) {
      console.error(err);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign up
        </Typography>
          <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  onChange={handleInputChange}
                  value={userFormData.username}
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleInputChange}
                  value={userFormData.email}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  onChange={handleInputChange}
                  value={userFormData.password}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            {
              error ? <div>
                <FormHelperText error >Please enter a valid email address</FormHelperText>
              </div> : null
            }
            <Button
		to='/'
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
          </Button>
            <Grid container justify="center">
              <Grid item>
                <Link to='/login' variant="body1">
                  {"Already have an account? Sign in"}
              </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default SignupForm;
