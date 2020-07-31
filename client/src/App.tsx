import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Container, Divider, Menu } from "semantic-ui-react";
import loadable from '@loadable/component';

import { Book, Author } from './types';
import { useStateValue } from './state/state';
import { baseUrl } from './constants';
import Loading from './LoadingPage';

const App: React.FC = () => {
  const [ , dispatch ] = useStateValue();
  const [ activeItem, setActiveItem ] = React.useState('home');

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

  React.useEffect(() => {
    void (async () => {
      try {
        const { data: bookList } = await axios.get<Book[]>(`${baseUrl}/books`);
        const { data: authorList } = await axios.get<Author[]>(`${baseUrl}/authors`);
        dispatch({ type: 'SET_BOOK_LIST', payload: bookList });
        dispatch({ type: 'SET_AUTHOR_LIST', payload: authorList });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [dispatch]);

  return (
    <div className='App'>
      <Router>
        <Container>
          <Menu pointing secondary>
            <Menu.Item as={ Link } to='/' name='home' active={activeItem === 'home'} onClick={ () => setActiveItem('home') }>Home</Menu.Item>
            <Menu.Item as={ Link } to='/books' name='book' active={activeItem === 'book'} onClick={ () => setActiveItem('book') } onMouseOver={ () => BookListPage.preload() }>Book</Menu.Item>
            <Menu.Item as={ Link } to='/authors' name='author' active={activeItem === 'author'} onClick={ () => setActiveItem('author') } onMouseOver={ () => AuthorListPage.preload() }>Author</Menu.Item>
          </Menu>
          <Divider hidden/>
          <Switch>
            <Route path='/books/:isbn' render={ () => <BookInfoPage/> }/>
            <Route path='/authors/:ssn' render={ () => <AuthorInfoPage/> }/>
            <Route path='/authors' render={ () => <AuthorListPage/> }/>
            <Route path='/' render={ () => <BookListPage/> }/>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;