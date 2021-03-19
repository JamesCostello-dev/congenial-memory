import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import Auth from "../utils/auth";
import { searchMovieDB } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";

import { SAVE_MOVIE } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());
  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

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

      setSearchedMovies(data.results);
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

      console.log(data);

      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <div className="container">
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="column">
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a movie"
                />
              </div>
              <div className="column">
                <button type="submit" variant="success" size="lg">
                  Submit Search
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div className="container">
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : "Search for a movie to begin"}
        </h2>
        <div>
          {searchedMovies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <div className="card" key={movie.id}>
                <img
                  className="card--image"
                  src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
                  alt={"poster for " + movie.title}
                />
                <h3>{movie.title}</h3>
                <p>Release Date: {movie.release_date}</p>
                <p>Description: {movie.overview}</p>
                {/* {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movie.movieId)}>
                      {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                        ? 'This movie has already been saved!'
                        : 'Save this Movie!'}
                    </Button>
                  )} */}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SearchMovies;
