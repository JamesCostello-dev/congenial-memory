import React from "react";
import Auth from "../utils/auth";
import { removeMovieId } from "../utils/localStorage";
import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_MOVIE } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Dark Grey
      main: '#393e46',
    },
    secondary: {
      // Yellow
      main: '#ffd369',
    },
  },
  typography: {
    fontSize: 20,
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    padding: "5px",
    // backgroundColor: theme.palette.primary.main
  },
}));

const SavedMovies = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeMovie, { error }] = useMutation(REMOVE_MOVIE);
  const classes = useStyles();

  const userData = data?.me || [];

  const myTheme = {
    cardStylePref:{
      background: "#393e46",
      color: "#eeeeee"
    }
  }

  const handleDeleteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeMovie({
        variables: { movieId },
      });

      if (error) {
        throw new Error("Something went wrong");
      }

      removeMovieId(movieId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
  <ThemeProvider theme={theme}>
      <Container maxWidth="sm" align="center">
        <Typography component="h1">Viewing saved movies!</Typography>
      </Container>
      <Container maxWidth="lg" align="center">
        <Typography component="h2">
          {userData.savedMovies.length
            ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? "movie" : "movies"}:`
            : "You have no saved movies!"}
        </Typography>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {userData.savedMovies.map((movie) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={movie.movieId}>

              <Card key={movie.movieId} className={classes.root} style={myTheme.cardStylePref}>
                <CardHeader
                    title={movie.title}
                    subheader={movie.date}
                    align="left"
                    style={myTheme.cardStylePref}
                  />
                  <CardContent>
                    <img
                      src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster}`}
                      alt={"poster for " + movie.title}
                    />
                  </CardContent>
                  <CardContent align="left" component="p" style={myTheme.cardStylePref}>
                      {movie.overview}
                  </CardContent>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteMovie(movie.movieId)}
                >
                  Delete this Movie!
                  </Button>
              </Card>

              </Grid>
            );
          })}
        </Grid>
      </Container>
      </ThemeProvider>
    </>
  );
};

export default SavedMovies;
