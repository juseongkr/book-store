import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { AuthorModalProps } from '../types';
import AddAuthorForm from './AddAuthorForm';

const AddAuthorModal = ({ onSubmit, onClose, modalOpen, errMsg }: AuthorModalProps) => {
    return (
        <Modal open={ modalOpen } onClose={ onClose } centered={ false } closeIcon>
            <Modal.Header>Add a new author</Modal.Header>
            <Modal.Content>
                { errMsg && <Segment inverted color='red'>{ `Error: ${errMsg}` }</Segment> }
                <AddAuthorForm onSubmit={ onSubmit } onClose={ onClose }/>
            </Modal.Content>
        </Modal>
    );
};

export default AddAuthorModal;