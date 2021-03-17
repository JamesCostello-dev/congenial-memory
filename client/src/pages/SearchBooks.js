import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button } from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchMovieDB } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

import { SAVE_BOOK } from '../utils/mutations'
import { useMutation } from '@apollo/client'

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchMovieDB(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const data = await response.json();

      // const movieData = items.map((movie) => ({
      //   movieId: movie.id,
      //   releaseDate: movie.release_date,
      //   title: movie.title,
      //   description: movie.overview,
      //   image: movie.poster_path || '',
      // }));

    console.log(data.results);
    setSearchedMovies(data.results);
    setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedMovies` state by the matching id
    const bookToSave = searchedMovies.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: { input: bookToSave }
      });

      if (error) {
        throw new Error('Something went wrong');
      }

      console.log(data);

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a movie'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : 'Search for a movie to begin'}
        </h2>
        <div>
          {searchedMovies.map(movie => movie.title)}
        </div>
      </Container>
    </>
  );
};

export default SearchBooks;
