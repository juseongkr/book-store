/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Container, Divider, Menu } from "semantic-ui-react";
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';

import { Book, Author, User } from './types';
import { useStateValue } from './state/state';
import { baseUrl } from './constants';
import Loading from './LoadingPage';
import MainPage from './MainPage';

const App: React.FC = () => {
  const [ { username }, dispatch ] = useStateValue();
  const [ activeItem, setActiveItem ] = React.useState<string>('home');
  
  const BookListPage = loadable(() => import('./BookListPage'), {
    fallback: <Loading/>,
  });

  const BookInfoPage = loadable(() => import('./BookInfoPage'), {
    fallback: <Loading/>,
  });

  const AuthorListPage = loadable(() => import('./AuthorListPage'), {
    fallback: <Loading/>,
  });

  const AuthorInfoPage = loadable(() => import('./AuthorInfoPage'), {
    fallback: <Loading/>,
  });

  const LoginForm = loadable(() => import('./LoginForm'), {
    fallback: <Loading/>,
  });

  const userLogout = async () => {
    try {
      await axios.post<User>(`${baseUrl}/auth/logout`);
      window.localStorage.removeItem('loggedUser');
      dispatch({ type: 'SET_USER', payload: '' });
      setActiveItem('home');
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    void (async () => {
      try {
        const { data: bookList } = await axios.get<Book[]>(`${baseUrl}/books`);
        const { data: authorList } = await axios.get<Author[]>(`${baseUrl}/authors`);
        dispatch({ type: 'SET_BOOK_LIST', payload: bookList });
        dispatch({ type: 'SET_AUTHOR_LIST', payload: authorList });
        const token = window.localStorage.getItem('loggedUser');
        if (token) {
          const token_obj = JSON.parse(token);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dispatch({ type: 'SET_USER', payload: token_obj.username });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [dispatch]);

  return (
    <div className='App'>
      <Helmet>
        <title>Book store { activeItem === 'home' ? '' : ': ' + activeItem }</title>
      </Helmet>
      <Router>
        <Container>
          <Menu pointing secondary>
              <Menu.Item as={ Link } to='/' color='teal' name='home' active={ activeItem === 'home' } onClick={ () => setActiveItem('home') }>Home</Menu.Item>
              <Menu.Item as={ Link } to='/books' color='teal' name='book' active={ activeItem === 'book' } onClick={ () => setActiveItem('book') } onMouseOver={ () => BookListPage.preload() }>Book</Menu.Item>
              <Menu.Item as={ Link } to='/authors' color='teal' name='author' active={ activeItem === 'author' } onClick={ () => setActiveItem('author') } onMouseOver={ () => AuthorListPage.preload() }>Author</Menu.Item>
              {
                username ?
                <Menu.Item as={ Link } to='/' color='teal' name='logout' position='right' onClick={ userLogout }>Logout</Menu.Item> :
                <Menu.Item as={ Link } to='/login' color='teal' name='login' position='right' active={ activeItem === 'login' } onClick={ () => setActiveItem('login') } onMouseOver={ () => LoginForm.preload() }>Login</Menu.Item>
              }
          </Menu>
          <Divider hidden/>
          <Switch>
            <Route path='/books/:isbn' render={ () => <BookInfoPage/> }/>
            <Route path='/authors/:ssn' render={ () => <AuthorInfoPage/> }/>
            <Route path='/authors' render={ () => <AuthorListPage/> }/>
            <Route path='/books' render={ () => <BookListPage/> }/>
            <Route path='/login' render={ () => <LoginForm/> }/>
            <Route path='/' render={ () => <MainPage/> } exact/>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;