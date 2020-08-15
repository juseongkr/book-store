import React from 'react';
import { RegisterFormProps, NewUser } from '../types';
import { Form as SemanticForm, Grid, Button} from 'semantic-ui-react';
import { Formik, Field, Form } from 'formik';
import { TextField, PasswordField } from '../Form';
import { emailRegex } from '../constants';

type Props = Omit<RegisterFormProps, 'errMsg' | 'modalOpen'>;

const RegisterForm: React.FC<Props> = ({ onSubmit, onClose }: Props): JSX.Element => {
    const initValue: NewUser = {
        username: '',
        password: '',
        passwordCheck: '',
        name: '',
    };

    const checkForm = (values: NewUser) => {
        const errors: {
            [field: string]: string;
        } = {};

        if (!values.username || !values.username?.match(emailRegex)) {
            errors.username = 'You must fill out email';
        }
        if (!values.password || !values.passwordCheck || values.password.length < 8) {
            errors.password = 'You must fill out password at least 8 characters';
        }
        if (values.password !== values.passwordCheck) {
            errors.password = 'Please re-enter your password';
        }

        return errors;
    };

    return (
        <Formik initialValues={ initValue } onSubmit={ onSubmit } validate={ checkForm }>
        {
            ({ isValid, dirty }) => {
                return (
                    <Form className='form ui'>
                        <Field placeholder='Email address' name='username' component={ TextField }/>
                        <SemanticForm.Group widths='equal'>
                            <Field placeholder='Password' name='password' component={ PasswordField }/>
                            <Field placeholder='Re-enter Password' name='passwordCheck' component={ PasswordField }/>
                        </SemanticForm.Group>
                        <Field placeholder='Name (Optional)' name='name' component={ TextField }/>
                        <Grid>
                            <Grid.Column floated='left'>
                                <Button type='button' color='red' onClick={ onClose }>Close</Button>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <Button type='submit' floated='right' color='blue' disabled={ !dirty || !isValid }>Sign up</Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }
        }
        </Formik>
    );
};

export default RegisterForm;