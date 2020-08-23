import React from 'react';
import axios from 'axios';
import { Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { useStateValue } from '../state/state';
import { baseUrl } from '../constants';
import { ActiveItem, User, UserInfo } from '../types';
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

export const InfoPage = loadable(() => import('../InfoPage'), {
  fallback:<Loading/>,
});

const MenuBar: React.FC = (): JSX.Element => {
  const [ { userInfo, actived }, dispatch ] = useStateValue();

  React.useEffect(() => {
    void (async() => {
      try {
        const { data: authUser } = await axios.get<UserInfo>(`${baseUrl}/auth/check`);
        dispatch({ type: 'SET_USER', payload: authUser });
      } catch (err) {
        dispatch({ type: 'SET_USER', payload: { username: '', id: '' } });
      }
    })();
  }, [dispatch]);
  
  const userLogout = async (): Promise<void> => {
    try {
      await axios.post<User>(`${baseUrl}/auth/logout`);
      dispatch({ type: 'SET_USER', payload: { username: '', id: '' } });
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
        userInfo?.username ?
        <Menu.Menu position='right'>
          <Menu.Item as={ Link } to='/info' color='teal' name='info' active={ actived === 'info' } onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Info }) } onMouseOver={ () => InfoPage.preload() }>{ userInfo.username.split('@')[0] }</Menu.Item>
          <Menu.Item as={ Link } to='/' color='teal' name='logout' onClick={ userLogout }>Logout</Menu.Item>
        </Menu.Menu> : 
        <Menu.Item as={ Link } to='/login' color='teal' name='login' position='right' active={ actived === 'login' } onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Login }) } onMouseOver={ () => LoginForm.preload() }>Login</Menu.Item>
      }
    </Menu>
  );
};

export default MenuBar;