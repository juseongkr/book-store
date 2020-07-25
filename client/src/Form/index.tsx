import React from 'react';
import { Form } from 'semantic-ui-react';
import { FieldProps, Field, ErrorMessage } from 'formik';
import { GenderSelect } from '../types';

interface TextProps extends FieldProps {
    label: string;
    placeholder: string;
}

interface NumberProps extends FieldProps {
    label: string;
    min: number;
    max: number;
    errorMessage?: string;
}

interface SelectProps {
    label: string;
    name: string;
    options: GenderSelect[];
}

export const TextField: React.FC<TextProps> = ({ field, label, placeholder }: TextProps) => {
    return (
        <Form.Field>
            <label>{ label }</label>
            <Field { ...field } placeholder={ placeholder }/>
            <div style={ { color: 'red' } }>
                <ErrorMessage name={ field.name }/>
            </div>
        </Form.Field>
    );
};

export const NumberField: React.FC<NumberProps> = ({ field, label, min, max }: NumberProps) => {
    return (
        <Form.Field>
            <label>{ label }</label>
            <Field { ...field } type='number' min={ min } max={ max }/>
            <div style={ { color: 'red' } }>
                <ErrorMessage name={ field.name }/>
            </div>
        </Form.Field>
    );
};

export const SelectField: React.FC<SelectProps> = ({ label, name, options }: SelectProps) => {
    return (
        <Form.Field>
            <label>{ label }</label>
            <Field as='select' name={ name } className='ui dropdown'>
                {
                    options.map((option, id) => (
                        <option key={ id } value={ option.value }>
                            { option.label || option.value }
                        </option>
                    ))
                }
            </Field>
        </Form.Field>
    );
};