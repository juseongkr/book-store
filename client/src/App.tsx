import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Container, Divider, Menu } from "semantic-ui-react";

import { Book, Author } from './types';
import { useStateValue } from './state/state';
import { baseUrl } from './constants';
import BookListPage from './BookListPage';
import BookInfoPage from './BookInfoPage';
import AuthorListPage from './AuthorListPage';
import AuthorInfoPage from './AuthorInfoPage';

const App: React.FC = () => {
  const [ , dispatch ] = useStateValue();
  const [ activeItem, setActiveItem ] = React.useState('home');

  React.useEffect(() => {
    (async () => {
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
            <Menu.Item as={ Link } to='/books' name='book' active={activeItem === 'book'} onClick={ () => setActiveItem('book') }>Book</Menu.Item>
            <Menu.Item as={ Link } to='/authors' name='author' active={activeItem === 'author'} onClick={ () => setActiveItem('author') }>Author</Menu.Item>
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
}

export default App;