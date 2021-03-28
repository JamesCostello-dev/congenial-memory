const { Schema } = require("mongoose");

const movieSchema = new Schema({
  overview: {
    type: String,
  },
  // saved movie id
  movieId: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = movieSchema;
