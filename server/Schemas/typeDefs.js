const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Auth {
  token: ID!
  user: User
}
type Movie {
  movieId: String
  title: String
  overview: String
  poster: String
  date: String
}
input movieInput {
  movieId: String
  title: String
  overview: String
  poster: String
  date: String
}
type User {
  _id: ID
  username: String
  email: String
  movieCount: Int
  savedMovies: [Movie]
}
type Query {
  me: User
}
type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  savedMovie(input: movieInput): User 
  removeMovie(movieId: String!): User
}
`;

module.exports = typeDefs;