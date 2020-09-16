import React from 'react';
import { Container, Divider } from 'semantic-ui-react';
import DeleteUserForm from './DeleteUserForm';
import UpdateUserForm from './UpdateUserForm';

const UserInfoPage: React.FC = (): JSX.Element => {
    return (
        <Container>
            <UpdateUserForm/>
            <Divider hidden/>
            <DeleteUserForm/>
        </Container>
    );
};

export default UserInfoPage;