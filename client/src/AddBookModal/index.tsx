import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddBookForm from './AddBookForm';
import { ModalProps } from '../types';

const AddBookModal = ({ onSubmit, onClose, modalOpen, errMsg }: ModalProps) => {
    return (
        <Modal open={ modalOpen } onClose={ onClose } centered={ false } closeIcon>
            <Modal.Header>Add a new book</Modal.Header>
            <Modal.Content>
                { errMsg && <Segment inverted color='red'>{`Error: ${errMsg}`}</Segment> }
                <AddBookForm onSubmit={ onSubmit } onClose={ onClose }/>
            </Modal.Content>
        </Modal>
    );
}

export default AddBookModal;