import React from 'react';
import axios from 'axios';
import { Container, Table, Button } from "semantic-ui-react";
import { useStateValue } from '../state/state';
import { Book } from '../types';
import AddBookModal from '../AddBookModal';
import RatingBar from '../RatingBar';
import { baseUrl } from '../constants';
import { Link } from 'react-router-dom';

const BookListPage: React.FC = () => {
    const [ { books }, dispatch ] = useStateValue();
    const [ modalOpen, setModalOpen ] = React.useState<boolean>(false);
    const [ error, setError ] = React.useState<string>('');

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
        setError('');
    };

    const genISBN = (): string => Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const submitNewBook = async (values: Book) => {
        try {
            const book: Book = {
                ...values,
                isbn: genISBN(),
                genres: values.genres.toString().replace(/ /g, '').split(','),
            };
            const { data: newBook } = await axios.post<Book>(`${baseUrl}/books`, book);
            dispatch({ type: 'ADD_BOOK', payload: newBook });
            closeModal();
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error(err.response.data.error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setError(err.response.data.error);
        }
    };

    return (
        <div className='App'>
            <Container textAlign='center'>
                <h3>Book List</h3>
            </Container>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Author</Table.HeaderCell>
                        <Table.HeaderCell>Published</Table.HeaderCell>
                        <Table.HeaderCell>Genres</Table.HeaderCell>
                        <Table.HeaderCell>Rating</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        Object.values(books).map((book: Book, id: number) => (
                            <Table.Row key={ id }>
                                <Table.Cell><Link to={'/books/' + book.isbn }>{ book.title }</Link></Table.Cell>
                                <Table.Cell>{ book.author }</Table.Cell>
                                <Table.Cell>{ book.published }</Table.Cell>
                                <Table.Cell>{ book.genres.join(', ') }</Table.Cell>
                                <Table.Cell><RatingBar rating={ book.rating || 0 }/></Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            <AddBookModal modalOpen={ modalOpen } onSubmit={ submitNewBook } onClose={ closeModal } errMsg={ error }/>
            <Button onClick={ () => openModal() }>Add new book</Button>
        </div>
    );
};

export default BookListPage;