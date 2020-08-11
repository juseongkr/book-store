import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const MainPage: React.FC = () => {
    return (
        <Container text>
            <Header as='h2' content='Welcome to Book Store 📚' style={ {
                fontSize: '3em',
                fontWeight: 'normal',
                textAlign: 'center',
                marginBottom: '3em',
                marginTop: '1.5em',
            } }>
            </Header>
        </Container>
    );
};

export default MainPage;