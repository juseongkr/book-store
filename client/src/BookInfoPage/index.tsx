import React from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Divider, Button } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { baseUrl } from '../constants';
import RatingBar from '../RatingBar';
import { Book } from '../types';

const BookInfoPage: React.FC = () => {
    const [ { books }, dispatch ] = useStateValue();
    const { isbn } = useParams<{ isbn: string }>();
    const book = Object.values(books).find(b => b.isbn === isbn);

    const deleteBook = async () => {
        try {
            const { data: bookList } = await axios.get<Book>(`${baseUrl}/books/${isbn}`);
            await axios.delete<any>(`${baseUrl}/books/${isbn}`);
            dispatch({ type: 'DEL_BOOK', payload: bookList });
        } catch (err) {
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
            <Button as={ Link } to='/' basic color='red' onClick={ deleteBook }>Delete</Button>
        </div>
    );
};

export default BookInfoPage;