import React from 'react';
import axios from 'axios';
import { Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { useStateValue } from '../state/state';
import { baseUrl } from '../constants';
import { ActiveItem, User } from '../types';
import loadable from '@loadable/component';
import Loading from '../LoadingPage';

export const BookListPage = loadable(() => import('../BookListPage'), {
  fallback: <Loading/>,
});

export const AuthorListPage = loadable(() => import('../AuthorListPage'), {
  fallback: <Loading/>,
});

export const BookInfoPage = loadable(() => import('../BookInfoPage'), {
  fallback: <Loading/>,
});

export const AuthorInfoPage = loadable(() => import('../AuthorInfoPage'), {
  fallback: <Loading/>,
});

export const LoginForm = loadable(() => import('../LoginForm'), {
  fallback: <Loading/>,
});

const MenuBar: React.FC = () => {
  const [ { username, actived }, dispatch ] = useStateValue();
  
  const userLogout = async () => {
    try {
      await axios.post<User>(`${baseUrl}/auth/logout`);
      window.localStorage.removeItem('loggedUser');
      dispatch({ type: 'SET_USER', payload: '' });
      dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Home });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Menu pointing secondary>
      <Menu.Item as={ Link } to='/' color='teal' name='home' active={ actived === 'home' } onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Home }) }>Home</Menu.Item>
        <Menu.Item as={ Link } to='/books' color='teal' name='book' active={ actived === 'book' } onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Book }) } onMouseOver={ () => BookListPage.preload() }>Book</Menu.Item>
        <Menu.Item as={ Link } to='/authors' color='teal' name='author' active={ actived === 'author' } onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Author }) } onMouseOver={ () => AuthorListPage.preload() }>Author</Menu.Item>
        {
          username ?
          <Menu.Item as={ Link } to='/' color='teal' name='logout' position='right' onClick={ userLogout }>Logout</Menu.Item> :
          <Menu.Item as={ Link } to='/login' color='teal' name='login' position='right' active={ actived === 'login' } onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Login }) } onMouseOver={ () => LoginForm.preload() }>Login</Menu.Item>
        }
    </Menu>
  );
};

export default MenuBar;