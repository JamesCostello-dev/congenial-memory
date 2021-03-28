import React, { useState } from "react";
import Auth from "../utils/auth";
import { searchMovieDB } from "../utils/API";
import { SAVE_MOVIE } from "../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { GET_ME } from "../utils/queries";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    padding: "5px",
  },
  button: {
    padding: "10px",
  },
  top: {
    paddingTop: "10px",
  },
}));

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const {loading, data} = useQuery(GET_ME);
  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);
  const classes = useStyles();

  const myTheme = {
    cardStylePref: {
      background: "#393e46",
      color: "#eeeeee"
    },
    buttonStylePref: {
      background: "#ffd369"
    }
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchMovieDB(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const data = await response.json();

      const movieData = data.results.map((movie) => ({
        movieId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path || "",
        date: movie.release_date,
      }));

      setSearchedMovies(movieData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMovie = async (movieId) => {
    const movieToSave = searchedMovies.find(
      (movie) => movie.movieId === movieId
    );

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMovie({
        variables: { input: movieToSave },
      });

      if (error) {
        throw new Error("Something went wrong");
      }

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <> </> 
  const savedMovies = data?.me?.savedMovies ?? []

  return (
    <>
        <Container maxWidth="sm" className={classes.top} align="center">
          <Typography component="h1">
            Search for Movies!
        </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              name="searchInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search for a movie"
            />
            <div>
              <Button type="submit" variant="contained" style={myTheme.buttonStylePref}>
                Submit Search
            </Button>
            </div>
          </form>
        </Container>

        <Container maxWidth="lg" align="center" className={classes.top}>
          <Typography component="h2">
            {searchedMovies.length
              ? `Viewing ${searchedMovies.length} results:`
              : "Search for a movie to begin"}
          </Typography>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {searchedMovies.map((movie) => {
              const alreadySaved = savedMovies?.some(
                (savedMovie) => savedMovie.movieId == movie.movieId
              )
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
                    {Auth.loggedIn() && (
                      <Button
                        disabled={alreadySaved}
                        onClick={() => handleSaveMovie(movie.movieId)}
                        variant="contained"
                        style={myTheme.buttonStylePref}
                        className={classes.button}
                      >
                        {alreadySaved
                          ? "This movie has already been saved!"
                          : "Save this Movie!"}
                      </Button>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
    </>
  );
};

export default SearchMovies;
