import React from "react";
import axios from "axios";
import { useStateValue } from "../state";
import { Container, Icon, Divider, Button } from "semantic-ui-react";
import { useParams, Link } from "react-router-dom";
import { baseUrl } from "../constants";
import { Author } from "../types";
import UpdateAuthorModal from "../UpdateAuthorModal";

const AuthorInfoPage: React.FC = (): JSX.Element => {
  const [{ userInfo, authors }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const { ssn } = useParams<{ ssn: string }>();
  const author: Author | undefined = Object.values(authors).find(
    (a) => a.ssn === ssn
  );

  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError("");
  };

  const submitUpdateAuthor = async (values: Author): Promise<void> => {
    try {
      await axios.put(`${baseUrl}/authors/${ssn}`, values);
      dispatch({ type: "ADD_AUTHOR", payload: values });
      closeModal();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(err.response.data.error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setError(err.response.data.error);
    }
  };

  const deleteAuthor = async (): Promise<void> => {
    try {
      const { data: authorList } = await axios.get<Author>(
        `${baseUrl}/authors/${ssn}`
      );
      await axios.delete<unknown>(`${baseUrl}/authors/${ssn}`);
      dispatch({ type: "DEL_AUTHOR", payload: authorList });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(err.response.data.error);
    }
  };

  return (
    <div className="App">
      <Container textAlign="left">
        <h3>
          {author?.name}
          <Icon
            name={
              author?.gender === "other"
                ? "genderless"
                : author?.gender === "male"
                ? "mars"
                : "venus"
            }
          />
        </h3>
        <Divider />
        <div>SSN: {author?.ssn}</div>
        <div>Birth: {author?.birth}</div>
        <div>Address: {author?.address}</div>
      </Container>
      <Divider hidden />
      <Button as={Link} to="/authors" color="grey">
        Back
      </Button>
      <UpdateAuthorModal
        modalOpen={modalOpen}
        onSubmit={submitUpdateAuthor}
        onClose={closeModal}
        errMsg={error}
      />
      <Button
        color="blue"
        onClick={openModal}
        disabled={author?.uploader !== userInfo.id}
      >
        Update
      </Button>
      <Button
        as={Link}
        to="/authors"
        color="red"
        onClick={deleteAuthor}
        disabled={author?.uploader !== userInfo.id}
      >
        Delete
      </Button>
    </div>
  );
};

export default AuthorInfoPage;
