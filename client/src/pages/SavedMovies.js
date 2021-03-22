import React from "react";
import Auth from "../utils/auth";
import { removeMovieId } from "../utils/localStorage";
import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_MOVIE } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

const SavedMovies = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeMovie, { error }] = useMutation(REMOVE_MOVIE);

  const userData = data?.me || [];

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
      <Container>
        <Typography component="h1" variant="h5">
          Viewing saved movies!
        </Typography>
      </Container>
      <Container>
        <Typography component="h2" variant="h5">
          {userData.savedMovies.length
            ? `Viewing ${userData.savedMovies.length} saved ${
                userData.savedMovies.length === 1 ? "movie" : "movies"
              }:`
            : "You have no saved movies!"}
          You have no saved movies!
        </Typography>
        <div className="column">
          {userData.savedMovies.filter((movie) => {
            return (
              <Card key={movie.id}>
                <CardContent>
                  <img
                    src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
                    alt={"poster for " + movie.title}
                  />
                </CardContent>
                <CardHeader
                  title={movie.title}
                  subheader={movie.release_date}
                  align="left"
                />
                <CardContent align="left">
                  <Typography component="p" variant="h5">
                    {movie.overview}
                  </Typography>
                </CardContent>
                <Button
                  className="btn-block btn-danger"
                  onClick={() => handleDeleteMovie(movie.id)}
                >
                  Delete this Movie!
                </Button>
              </Card>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default SavedMovies;
