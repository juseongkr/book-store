import React from "react";
import axios from "axios";
import { Container, Table, Button, Icon, Pagination } from "semantic-ui-react";
import { useStateValue } from "../state";
import { Author, AuthorPage } from "../types";
import { Link } from "react-router-dom";
import { baseUrl } from "../constants";
import AddAuthorModal from "../AddAuthorModal";

const AuthorListPage: React.FC = (): JSX.Element => {
  const [{ authors, curPage, totalPage, pageLimit }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    void (async () => {
      try {
        const { data: authorPage } = await axios.get<AuthorPage>(
          `${baseUrl}/authors?page=${curPage}`
        );
        dispatch({ type: "SET_AUTHOR_LIST", payload: authorPage.data });
        dispatch({
          type: "SET_TOTAL_PAGE",
          payload: authorPage.pagination.total,
        });
        dispatch({
          type: "SET_COUNT_PER_PAGE",
          payload: authorPage.pagination.count,
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [curPage, dispatch]);

  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError("");
  };

  const submitNewAuthor = async (values: Author): Promise<void> => {
    try {
      const { data: newAuthor } = await axios.post<Author>(
        `${baseUrl}/authors`,
        values
      );
      dispatch({ type: "ADD_AUTHOR", payload: newAuthor });
      closeModal();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(err.response.data.error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setError(err.response.data.error);
    }
  };

  return (
    <div className="App">
      <Container textAlign="center">
        <h3>Author List</h3>
      </Container>
      <Button
        color="teal"
        onClick={openModal}
        style={{ margin: "10px" }}
        floated="right"
      >
        Add new author
      </Button>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>No.</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Birth</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Gender</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(authors).map((author: Author, id: number) => (
            <Table.Row key={id}>
              <Table.Cell>{(curPage - 1) * pageLimit + id + 1}</Table.Cell>
              <Table.Cell>
                <Link to={"/authors/" + author.ssn}>{author.name}</Link>
              </Table.Cell>
              <Table.Cell>{author?.birth}</Table.Cell>
              <Table.Cell>{author?.address}</Table.Cell>
              <Table.Cell>
                <Icon
                  name={
                    author.gender === "other"
                      ? "genderless"
                      : author.gender === "male"
                      ? "mars"
                      : "venus"
                  }
                ></Icon>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <AddAuthorModal
        modalOpen={modalOpen}
        onSubmit={submitNewAuthor}
        onClose={closeModal}
        errMsg={error}
      />
      <Container textAlign="center">
        <Pagination
          defaultActivePage={curPage}
          totalPages={Math.ceil(totalPage / pageLimit)}
          onPageChange={(_, data) =>
            dispatch({ type: "SET_CUR_PAGE", payload: Number(data.activePage) })
          }
        />
      </Container>
    </div>
  );
};

export default AuthorListPage;
