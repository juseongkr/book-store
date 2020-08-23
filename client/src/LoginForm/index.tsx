import React from 'react';
import axios from 'axios';
import { Grid, Header, Segment, Form, Button, Divider } from 'semantic-ui-react';
import { User, UserInfo, NewUser, ActiveItem } from '../types';
import { baseUrl } from '../constants';
import { useStateValue } from '../state/state';
import { useHistory } from 'react-router-dom';
import RegisterModal from '../RegisterModal';

const LoginForm: React.FC = (): JSX.Element => {
    const history = useHistory();
    const [ , dispatch ] = useStateValue();
    const [ error, setError ] = React.useState<string>('');
    const [ modalOpen, setModalOpen ] = React.useState<boolean>(false);
    const [ username, setUsername ] = React.useState<string>('');
    const [ password, setPassword ] = React.useState<string>('');

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
        setError('');
    };

    const submitRegister = async (values: NewUser): Promise<void> => {
        try {
            const newUser: User = {
                username: values.username,
                password: values.password,
                name: values?.name,
            };
            await axios.post(`${baseUrl}/auth/register`, newUser);
            dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Home });
            history.push('/');
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error(err.response.data.error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setError(err.response.data.error);
        }
    };
    
    const userLogin = async (): Promise<void> => {
        if (username !== '' && password !== '') {
            try {
                const { data: user } = await axios.post<UserInfo>(`${baseUrl}/auth/login`, { username, password });
                dispatch({ type: 'SET_USER', payload: user });
                dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Home });
                setUsername('');
                setPassword('');
                history.push('/');
            } catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.error(err.response.data.error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setError(err.response.data.error);
            }
        }
    };

    return (
        <div className='App'>
            <Grid textAlign='center' style={ { height: '35vh' } } verticalAlign='middle'>
                <Grid.Column style={ { maxWidth: 400 } }>
                    <Header as='h3' textAlign='center'>
                        Book Store Log in
                    </Header>
                    <Form size='large'>
                        { error && <Segment inverted color='red'>{ `Error: ${error}` }</Segment>}
                        <Segment>
                            <Form.Input autoFocus fluid icon='user' iconPosition='left' name='username' placeholder='Email' onChange={ e => setUsername(e.target.value) }/>
                            <Form.Input fluid icon='lock' iconPosition='left' name='password' placeholder='Password' type='password' onChange={ e => setPassword(e.target.value) }/>
                            <Button fluid color='teal' type='submit' size='large' onClick={ userLogin }>Log in</Button>
                        </Segment>
                    </Form>
                    <Divider hidden/>
                    <RegisterModal modalOpen={ modalOpen } onSubmit={ submitRegister } onClose={ closeModal } errMsg={ error }/>
                    <Button onClick={ openModal } fluid size='large'>Sign up</Button>
                </Grid.Column>
            </Grid>
        </div>
    );
};

export default LoginForm;