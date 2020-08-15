import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { AuthorFormProps } from '../types';
import AddAuthorForm from './AddAuthorForm';

const AddAuthorModal: React.FC<AuthorFormProps> = ({ onSubmit, onClose, modalOpen, errMsg }: AuthorFormProps): JSX.Element => {
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