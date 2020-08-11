import React from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Divider, Button } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { baseUrl } from '../constants';
import RatingBar from '../RatingBar';
import { Book } from '../types';
import UpdateBookModal from '../UpdateBookModal';

const BookInfoPage: React.FC = () => {
    const [ { books }, dispatch ] = useStateValue();
    const [ modalOpen, setModalOpen ] = React.useState<boolean>(false);
    const [ error, setError ] = React.useState<string>('');
    const { isbn } = useParams<{ isbn: string }>();
    const book = Object.values(books).find(b => b.isbn === isbn);

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
        setError('');
    };
    
    const submitUpdateBook = async (values: Book) => {
        try {
            const updatedBook: Book = {
                ...values,
            };
            await axios.put(`${baseUrl}/books/${isbn}`, updatedBook);
            dispatch({ type: 'ADD_BOOK', payload: updatedBook });
            closeModal();
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error(err.response.data.error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setError(err.response.data.error);
        }
    };

    const deleteBook = async () => {
        try {
            const { data: bookList } = await axios.get<Book>(`${baseUrl}/books/${isbn}`);
            await axios.delete<unknown>(`${baseUrl}/books/${isbn}`);
            dispatch({ type: 'DEL_BOOK', payload: bookList });
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error(err.response.data.error);
        }
    };

    return (
        <div className='App'>
            <Container textAlign='left'>
                <h3>{ book?.title }<RatingBar rating={ book?.rating || 0 }/></h3>
                <Divider/>
                <div>Author: { book?.author }</div>
                <div>Published: { book?.published }</div>
                <div>Genres: {book?.genres.join(', ') }</div>
                <div>Description: {book?.description }</div>
            </Container>
            <Divider hidden/>
            <Button as={ Link } to='/books' color='grey'>Back</Button>
            <UpdateBookModal modalOpen={ modalOpen } onSubmit={ submitUpdateBook } onClose={ closeModal } errMsg={ error }/>
            <Button color='blue' onClick={ () => openModal() }>Update</Button>
            <Button as={ Link } to='/books' color='red' onClick={ deleteBook }>Delete</Button>
        </div>
    );
};

export default BookInfoPage;