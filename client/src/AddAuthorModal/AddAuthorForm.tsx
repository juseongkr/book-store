import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { AuthorFormProps, Author, Gender, GenderSelect } from '../types';
import { Formik, Form, Field } from 'formik';
import { TextField, SelectField } from '../Form';

type Props = Omit<AuthorFormProps, 'errMsg' | 'modalOpen'>;

const genderSelections: Array<GenderSelect> = [
    { value: Gender.Male, label: "Male" },
    { value: Gender.Female, label: "Female" },
    { value: Gender.Other, label: "Other" },
];

const AddAuthorForm: React.FC<Props> = ({ onSubmit, onClose }: Props) => {
    const initValue: Author = {
        ssn: '',
        name: '',
        birth: '',
        address: '',
        gender: Gender.Other,
    };

    const checkForm = (values: Author) => {
        const reg = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g;
        const errFill = 'You must fill out form';
        const errInvalid = 'Invalid date format';
        const errors: {
            [field: string]: string;
        } = {};

        if (!values.ssn) {
            errors.ssn = errFill;
        }
        if (!values.name) {
            errors.name = errFill;
        }
        if (!values.gender) {
            errors.gender = errFill;
        }
        if (values.birth && !values.birth?.match(reg)) {
            errors.birth = errInvalid;
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

export default AddAuthorForm;
