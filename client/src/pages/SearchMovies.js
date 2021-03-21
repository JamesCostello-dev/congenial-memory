import React, { useState, useEffect } from "react";

import Auth from "../utils/auth";
import { searchMovieDB } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";

import { SAVE_MOVIE } from "../utils/mutations";
import { useMutation } from "@apollo/client";

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    padding: '5px' 
  },
  button: {
    padding: '10px'
  },
  top: {
    paddingTop: '10px'
  }

}));

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());
  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);
  const classes = useStyles();


  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

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
        poster: movie.poster_path || '',
        date: movie.release_date
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

      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      <Container maxWidth="sm" className={classes.top} align="center">
        <Typography component="h1" variant="h5">Search for Movies!</Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            name="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            size="lg"
            placeholder="Search for a movie"
          />
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="lg" >
              Submit Search
                </Button>
          </div>
        </form>
      </Container>


      <Container maxWidth="sm" align="center" className={classes.top}>
        <Typography component="h2" variant="h5">
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : "Search for a movie to begin"}
        </Typography>
        <div>
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} className={classes.root}>
                <CardHeader title={movie.title} subheader={movie.date} align="left" />
                <CardContent>
                  <img
                    src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster}`}
                    alt={"poster for " + movie.title}
                  /></CardContent>
                <CardContent align="left">
                  <Typography component="p" variant="h5">
                    {movie.overview}
                  </Typography></CardContent>
                {Auth.loggedIn() && (
                <Button
                  disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                  onClick={() => handleSaveMovie(movie.movieId)}
                  variant="contained"
                  color="primary"
                  className={classes.button}>
                  {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                    ? 'This movie has already been saved!'
                    : 'Save this Movie!'}
                </Button>
                 )} 
              </Card>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default SearchMovies;
