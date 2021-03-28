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
import { LOGIN_USER } from '../utils/mutations'
import { useMutation } from '@apollo/client'
import FormHelperText from '@material-ui/core/FormHelperText';
import AppContext from '../AppContext';
 
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '1.5em'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#ffd369',
    '&:hover': {
      color: "#61afef",
      backgroundColor: '#393e46'
    },
  },
}));

const LoginForm = () => {
  const classes = useStyles();

  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const history = useHistory();
  const { setLoggedIn } = useContext(AppContext);
  const handleInputChange = (event) => {
  const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: { ...userFormData }
      });

      if (error) {
        throw new Error('Something went wrong');
      }

      Auth.login(data.login.token);
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
            Login
        </Typography>
          <form className={classes.form} onSubmit={handleFormSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              type="text"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={handleInputChange}
              value={userFormData.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={handleInputChange}
              value={userFormData.password}
              label="Password"
              type="password"
              id="password"
            />
            {
              error ? <div>
                <FormHelperText error >Incorrect credentials</FormHelperText>
              </div> : null
            }
            <Button
              type="submit"
              to='/'
              fullWidth
              className={classes.submit}
            >
              Sign In
          </Button>
            <Grid container justify="center">
              <Grid item>
                <Link to='/signup' variant="body1">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
}

export default LoginForm;
