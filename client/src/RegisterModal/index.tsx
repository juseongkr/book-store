import React from 'react';
import RegisterForm from './RegisterForm';
import { Modal, Segment } from 'semantic-ui-react';
import { RegisterFormProps } from '../types';

const RegisterModal: React.FC<RegisterFormProps> = ({ onSubmit, onClose, modalOpen, errMsg }: RegisterFormProps) => {
    return (
        <Modal size='small' open={ modalOpen } onClose={ onClose } centered={ false } closeIcon>
            <Modal.Header>Book Store Sign up</Modal.Header>
            <Modal.Content>
                { errMsg && <Segment inverted color='red'>{ `Error: ${errMsg}` }</Segment>}
                <RegisterForm onSubmit={ onSubmit } onClose={ onClose }/>
            </Modal.Content>
        </Modal>
    );
};

export default RegisterModal;