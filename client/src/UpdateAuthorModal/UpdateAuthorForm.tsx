import React from 'react';
import { AuthorFormProps, Author, GenderSelect, Gender } from '../types';
import { useStateValue } from '../state';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { SelectField, TextField } from '../Form';
import { Grid, Button } from 'semantic-ui-react';

type Props = Omit<AuthorFormProps, 'errMsg' | 'isOpen'>;

const genderSelections: GenderSelect[] = [
    { value: Gender.Male, label: "Male" },
    { value: Gender.Female, label: "Female" },
    { value: Gender.Other, label: "Other" },
];

const UpdateAuthorForm: React.FC<Props> = ({ onSubmit, onClose }: Props) => {
    const [ { authors }, ] = useStateValue();
    const { ssn } = useParams<{ ssn: string }>();

    const initValue: Author = {
        ...authors[ssn],
    };

    const checkForm = (values: Author) => {
        const reg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g;
        const errFill = 'You must fill out form';
        const errInvalid = 'Invalid date format';
        const errors: {
            [field: string]: string;
        } = {};

        if (!values.name) {
            errors.name = errFill;
        }
        if (values.birth && !values.birth?.match(reg)) {
            errors.birth = errInvalid;
        }
        if (!values.gender) {
            errors.gender = errFill;
        }

        return errors;
    };

    return (
        <Formik initialValues={ initValue } onSubmit={ onSubmit } validate={ checkForm }>
            {
                ({ isValid, dirty }) => {
                    return (
                        <Form className='form ui'>
                            <Field label='Author Name' placeholder='Name' name='name' component={ TextField }/>
                            <Field label='SSN' placeholder='Social Security Number' name='ssn' component={ TextField }/>
                            <SelectField label='Gender' name='gender' options={ genderSelections } />
                            <Field label='Birth' placeholder='YYYY-MM-DD' name='birth' component= { TextField }/>
                            <Field label='Address' placeholder='Address (optional)' name='address' component= { TextField }/>
                            <Grid>
                                <Grid.Column floated='left'>
                                    <Button type='button' color='red' onClick={ onClose }>Cancel</Button>
                                </Grid.Column>
                                <Grid.Column floated='right'>
                                    <Button type='submit' floated='right' color='blue' disabled={ !dirty || !isValid }>Save</Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    );
                }
            }
        </Formik>
    );
};

export default UpdateAuthorForm;