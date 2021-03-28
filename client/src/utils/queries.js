import gql from "graphql-tag";

export const GET_ME = gql`
  query {
    me {
      _id
      username
      email
      movieCount
      savedMovies {
        movieId
        title
        overview
        poster
        date
      }
    }
  }
`;
