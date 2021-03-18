import gql from 'graphql-tag'

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      movieCount
      savedMovies {
        movieId
        title
        releaseDate
        description
        poster
        link
      }
    }
  }
}
`;

export const ADD_USER = gql` 
mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      movieCount
      savedMovies {
        movieId
        title
        releaseDate
        description
        poster
        link
      }
    }
  }
}
`;

export const SAVE_BOOK = gql`
mutation saveMovie($input: bookInput!) {
  saveMovie(input: $input) {
    _id
    username
    email
    savedMovies {
      movieId
      title
      releaseDate
      description
      poster
      link
    }
  }
}
`;

export const REMOVE_BOOK = gql`
mutation removieMovie($movieId: String!) {
  removieMovie(movieId: $movieId) {
    _id
    username
    email
    movieCount
    savedMovies {
      movieId
      title
      releaseDate
      description
      poster
      link
    }
  }
}
`;