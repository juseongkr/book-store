import React from 'react';
import axios from 'axios';
import { Form as SemanticForm, Grid, Container, Segment, Button, Header } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import { User, ActiveItem, NewUser } from '../types';
import { useStateValue } from '../state';
import { baseUrl, emailRegex, pwRegex } from '../constants';
import { TextField, PasswordField } from '../Form';
import { useHistory } from 'react-router-dom';

const DeleteUserForm: React.FC = (): JSX.Element => {
    const history = useHistory();
    const [ { userInfo }, dispatch ] = useStateValue();
    const [ error, setError ] = React.useState<string>('');

    const initValue: NewUser = {
        username: userInfo.username,
        password: '',
        passwordCheck: '',
    };

    const submitDeleteUser = async (values: NewUser): Promise<void> => {
        try {
            const deleteUser: User = {
                username: values.username,
                password: values.password,
            };
            await axios.delete<User>(`${baseUrl}/auth/unregister`, { data: deleteUser });
            dispatch({ type: 'SET_USER', payload: { username: '', id: '', name: '' } });
            dispatch({ type: 'SET_ACTIVE', payload: ActiveItem.Home });
            history.push('/');
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error(err.response.data.error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setError(err.response.data.error);
        }
    };

    const checkForm = (values: NewUser) => {
        const errors: {
            [field: string]: string;
        } = {};

        if (!values.username || !values.username?.match(emailRegex)) {
            errors.username = 'You must fill out email';
        }
        if (!values.password || !values.passwordCheck || values.password.length < 8 || !values.password?.match(pwRegex)) {
            errors.password = 'You must fill out password at least 8 characters including a number and a lowercase letter';
        }
        if (values.password !== values.passwordCheck) {
            errors.password = 'Please re-enter your password';
        }

        return errors;
    };

    return (
        <Container>
            <Grid textAlign='left'>
                <Grid.Column style={ { maxWidth: 400 } }>
                    <Header>Delete account</Header>
                    { error && <Segment inverted color='red'>{ `Error: ${error}` }</Segment>}
                    <Formik initialValues={ initValue } onSubmit={ submitDeleteUser } validate= { checkForm }>
                    {
                        ({ isValid, dirty }) => {
                            return (
                                <Form className='form ui'>
                                    <Field placeholder='Email' name='username' value={ userInfo.username } component={ TextField }/>
                                    <SemanticForm.Group widths='equal'>
                                        <Field placeholder='Password' name='password' component={ PasswordField }/>
                                        <Field placeholder='Re-enter Password' name='passwordCheck' component={ PasswordField }/>
                                    </SemanticForm.Group>
                                    <Grid>
                                        <Grid.Column>
                                            <Button type='submit' color='red' disabled={ !isValid || !dirty }>Delete</Button>
                                        </Grid.Column>
                                    </Grid>
                                </Form>
                            );
                        }
                    }
                    </Formik>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default DeleteUserForm;