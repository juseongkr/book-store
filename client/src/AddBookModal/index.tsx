import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddBookForm from './AddBookForm';
import { BookModalProps } from '../types';

const AddBookModal: React.FC<BookModalProps> = ({ onSubmit, onClose, modalOpen, errMsg }: BookModalProps) => {
    return (
        <Modal open={ modalOpen } onClose={ onClose } centered={ false } closeIcon>
            <Modal.Header>Add a new book</Modal.Header>
            <Modal.Content>
                { errMsg && <Segment inverted color='red'>{ `Error: ${errMsg}` }</Segment> }
                <AddBookForm onSubmit={ onSubmit } onClose={ onClose }/>
            </Modal.Content>
        </Modal>
    );
};

export default AddBookModal;