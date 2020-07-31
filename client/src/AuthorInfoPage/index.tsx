import React from 'react';
import axios from 'axios';
import { useStateValue } from '../state';
import { Container, Icon, Divider, Button } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import { baseUrl } from '../constants';
import { Author } from '../types';

const AuthorInfoPage: React.FC = () => {
    const [ { authors }, dispatch ] = useStateValue();
    const { ssn } = useParams<{ ssn: string }>();
    const author = Object.values(authors).find(a => a.ssn === ssn);

    const deleteAuthor = async () => {
        try {
            const { data: authorList } = await axios.get<Author>(`${baseUrl}/authors/${ssn}`);
            await axios.delete<unknown>(`${baseUrl}/authors/${ssn}`);
            dispatch({ type: 'DEL_AUTHOR', payload: authorList });
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error(err.response.data.error);
        }
    };

    return (
        <div className='App'>
            <Container textAlign='left'>
                <h3>{ author?.name }<Icon name={ author?.gender === 'other' ? 'genderless' : author?.gender === 'male' ? 'mars' : 'venus' }/></h3>
                <Divider/>
                <div>SSN: { author?.ssn }</div>
                <div>Birth: { author?.birth }</div>
                <div>Address: { author?.address }</div>
            </Container>
            <Divider hidden/>
            <Button as={ Link } to='/authors' basic color='grey'>Back</Button>
            <Button as={ Link } to='/authors' basic color='red' onClick={ deleteAuthor }>Delete</Button>
        </div>
    );
};

export default AuthorInfoPage;