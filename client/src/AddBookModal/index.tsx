import React from "react";
import { Modal, Segment } from "semantic-ui-react";
import AddBookForm from "./AddBookForm";
import { BookFormProps } from "../types";

const AddBookModal: React.FC<BookFormProps> = ({
  onSubmit,
  onClose,
  modalOpen,
  errMsg,
}: BookFormProps): JSX.Element => {
  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new book</Modal.Header>
      <Modal.Content>
        {errMsg && <Segment inverted color="red">{`Error: ${errMsg}`}</Segment>}
        <AddBookForm onSubmit={onSubmit} onClose={onClose} />
      </Modal.Content>
    </Modal>
  );
};

export default AddBookModal;
