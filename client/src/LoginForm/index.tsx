import React from 'react';
import axios from 'axios';
import { Grid, Header, Segment, Form, Button, Divider } from 'semantic-ui-react';
import { User } from '../types';
import { baseUrl } from '../constants';
import { useStateValue } from '../state/state';
import { useHistory } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const history = useHistory();
    const [ , dispatch ] = useStateValue();
    const [ username, setUsername ] = React.useState<string>('');
    const [ password, setPassword ] = React.useState<string>('');

    const userLogin = async () => {
        if (username !== '' && password !== '') {
            try {
                const { data: user } = await axios.post<User>(`${baseUrl}/auth/login`, { username, password });
                console.log(user);
                window.localStorage.setItem('loggedUser', JSON.stringify(user));
                dispatch({ type: 'SET_USER', payload: user.username });
                setUsername('');
                setPassword('');
                history.push('/');
            } catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.error(err.response.data.error);
            }
        }
    };

    return (
        <Grid textAlign='center' style={ { height: '25vh' } } verticalAlign='middle'>
            <Grid.Column style={ { maxWidth: 400 } }>
                <Header as='h3' textAlign='center'>
                    Book Store Log in
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input autoFocus fluid icon='user' iconPosition='left' name='username' placeholder='Email' onChange={ e => setUsername(e.target.value) }/>
                        <Form.Input fluid icon='lock' iconPosition='left' name='password' placeholder='Password' type='password' onChange={ e => setPassword(e.target.value) }/>
                        <Button fluid color='teal' type='submit' size='large' onClick={ userLogin }>Log in</Button>
                    </Segment>
                </Form>
                <Divider hidden/>
                <Form size='large'>
                    <Button fluid type='submit' size='large'>Sign up</Button>
                </Form>
            </Grid.Column>
        </Grid>
    );
};

export default LoginForm;