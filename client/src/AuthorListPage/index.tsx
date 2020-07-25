import React from 'react';
import axios from 'axios';
import { Container, Table, Button, Icon } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { Author } from '../types';
import { Link } from 'react-router-dom';
import { baseUrl } from '../constants';
import AddAuthorModal from '../AddAuthorModal';

const AuthorListPage: React.FC = () => {
    const [ { authors }, dispatch ] = useStateValue();
    const [ modalOpen, setModalOpen ] = React.useState<boolean>(false);
    const [ error, setError ] = React.useState<string>('');

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
        setError('');
    };

    const submitNewAuthor = async (values: Author) => {
        try {
            const { data: newAuthor } = await axios.post<Author>(`${baseUrl}/authors`, values);
            dispatch({ type: 'ADD_AUTHOR', payload: newAuthor });
            closeModal();
        } catch (err) {
            console.error(err.response.data.error);
            setError(err.response.data.error);
        }
    };
    
    return (
        <div className='App'>
            <Container textAlign='center'>
                <h3>Author List</h3>
            </Container>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Birth</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Gender</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        Object.values(authors).map((author: Author, id: number) => (
                            <Table.Row key={ id }>
                                <Table.Cell><Link to={'/authors/' + author.ssn}>{ author.name }</Link></Table.Cell>
                                <Table.Cell>{ author?.birth }</Table.Cell>
                                <Table.Cell>{ author?.address }</Table.Cell>
                                <Table.Cell><Icon name={ author.gender === 'other' ? 'genderless' : author.gender == 'male' ? 'mars' : 'venus'  }></Icon></Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
            <AddAuthorModal modalOpen={ modalOpen } onSubmit={ submitNewAuthor } onClose={ closeModal } errMsg={ error }/>
            <Button onClick={ () => openModal() }>Add new author</Button>
        </div>
    );
};

export default AuthorListPage;