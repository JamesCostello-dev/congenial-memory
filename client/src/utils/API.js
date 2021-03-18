
export const searchMovieDB = (query) => {
  return fetch(`https://api.themoviedb.org/3/search/movie?api_key=91501ab3958133e02fbea303404e65cf&language=en-US&query=${query}&page=1&include_adult=false`);
};
