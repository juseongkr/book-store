import React from 'react';
import UpdateAuthorForm from './UpdateAuthorForm';
import { Modal, Segment } from 'semantic-ui-react';
import { AuthorFormProps } from '../types';

const UpdateAuthorModal: React.FC<AuthorFormProps> = ({ onSubmit, onClose, modalOpen, errMsg }: AuthorFormProps) => {
    return (
        <Modal open={ modalOpen } onClose={ onClose } centered={ false } closeIcon>
            <Modal.Header>Update a author</Modal.Header>
            <Modal.Content>
                { errMsg && <Segment inverted color='red'>{ `Error: ${errMsg}` }</Segment> }
                <UpdateAuthorForm onSubmit={ onSubmit } onClose={ onClose }/>
            </Modal.Content>
        </Modal>
    );
};

export default UpdateAuthorModal;