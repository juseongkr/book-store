import React from 'react';
import { Container, Grid, Header, List, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../state/state';
import { ActiveItem } from '../types';
import { BookListPage, AuthorListPage } from '../MenuBar';

const FooterBar: React.FC = (): JSX.Element => {
  const [ , dispatch ] = useStateValue();

  return (
    <Segment inverted color='teal' style={{ padding: '4em 0em' }} vertical>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={ 3 }>
              <Header inverted as='h4' content='Book Store' />
              <List link inverted>
                <List.Item as={ Link } to='/' onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Home }) }>Home</List.Item>
                <List.Item as={ Link } to='/books' onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Book }) } onMouseOver={ () => BookListPage.preload() }>Book</List.Item>
                <List.Item as={ Link } to='/authors' onClick={ () => dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Author }) } onMouseOver={ () => AuthorListPage.preload() }>Author</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={ 7 }>
              <Header as='h4' inverted content='About' />
              <List link inverted>
                <List.Item icon='user' content='Juseong Park'></List.Item>
                <List.Item icon='marker' content='Seoul, South Korea'></List.Item>
                <List.Item icon='mail' content={ <a href='mailto:juseongkr@gmail.com'>juseongkr@gmail.com</a> }></List.Item>
                <List.Item icon='linkify' content={ <a href='https://github.com/juseongkr'>github.com/juseongkr</a> }></List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

export default FooterBar;