import React from "react";
import axios from "axios";
import { Container, Table, Button, Pagination } from "semantic-ui-react";
import { useStateValue } from "../state/state";
import { Book, BookInput, BookPage } from "../types";
import AddBookModal from "../AddBookModal";
import RatingBar from "../RatingBar";
import { baseUrl } from "../constants";
import { Link } from "react-router-dom";

const BookListPage: React.FC = (): JSX.Element => {
  const [{ books, curPage, totalPage, pageLimit }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    void (async () => {
      try {
        const { data: bookPage } = await axios.get<BookPage>(
          `${baseUrl}/books?page=${curPage}`
        );
        dispatch({ type: "SET_BOOK_LIST", payload: bookPage.data });
        dispatch({
          type: "SET_TOTAL_PAGE",
          payload: bookPage.pagination.total,
        });
        dispatch({
          type: "SET_COUNT_PER_PAGE",
          payload: bookPage.pagination.count,
        });
        dispatch({
          type: "SET_PAGE_LIMIT",
          payload: bookPage.pagination.limit,
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

  const genISBN = (): string =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString();

  const submitNewBook = async (values: BookInput): Promise<void> => {
    try {
      const book: Book = {
        ...values,
        isbn: genISBN(),
        genres: [
          ...new Set(
            values.genres
              .trim()
              .toLowerCase()
              .replace(/ /g, "")
              .split(",")
              .filter((g: string) => g !== "")
          ),
        ],
      };
      const { data: newBook } = await axios.post<Book>(
        `${baseUrl}/books`,
        book
      );
      dispatch({ type: "ADD_BOOK", payload: newBook });
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
        <h3>Book List</h3>
      </Container>
      <Button
        color="teal"
        onClick={openModal}
        style={{ margin: "10px" }}
        floated="right"
      >
        Add new book
      </Button>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No.</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Title</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Author</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Published</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Genres</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(books).map((book: Book, id: number) => (
            <Table.Row key={id}>
              <Table.Cell>{(curPage - 1) * pageLimit + id + 1}</Table.Cell>
              <Table.Cell>
                <Link to={"/books/" + book.isbn}>{book.title}</Link>
              </Table.Cell>
              <Table.Cell>{book.author}</Table.Cell>
              <Table.Cell>{book.published}</Table.Cell>
              <Table.Cell>{book.genres.join(", ")}</Table.Cell>
              <Table.Cell>
                <RatingBar rating={book.rating ?? 0} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <AddBookModal
        modalOpen={modalOpen}
        onSubmit={submitNewBook}
        onClose={closeModal}
        errMsg={error}
      />
      <Container textAlign="center">
        <Pagination
          boundaryRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={3}
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

export default BookListPage;
