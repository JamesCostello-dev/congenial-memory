import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchMovies from './pages/SearchMovies';
import SavedMovies from './pages/SavedMovies';
import Copyright from './components/Footer';
import Navbar from './components/Navbar';
import { ApolloProvider } from '@apollo/client';
import ApolloClient from 'apollo-boost'
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AppContext from './AppContext';


const client = new ApolloClient({
  request: operation => {
    const token = localStorage.getItem('id_token')
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
  uri: '/graphql'
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const context = { loggedIn, setLoggedIn };

  return (
    <AppContext.Provider value={context}>
      <ApolloProvider client={client}>
        <Router>
          <>
            <Navbar />
            <Switch>
              <Route exact path='/' component={SearchMovies} />
              <Route exact path='/saved' component={SavedMovies} />
              <Route exact path='/login' component={LoginForm} />
              <Route exact path='/signup' component={SignupForm} />
              <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
            </Switch>
          </>
        </Router>
        <Copyright />
      </ApolloProvider>
    </AppContext.Provider >
  );
}

export default App;
