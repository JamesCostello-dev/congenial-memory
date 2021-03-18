const { Schema } = require("mongoose");

const movieSchema = new Schema({
  description: {
    type: String,
  },
  // saved movie id
  movieId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = movieSchema;
