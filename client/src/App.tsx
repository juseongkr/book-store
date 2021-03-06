/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Container, Divider } from "semantic-ui-react";
import { Helmet } from "react-helmet-async";

import { useStateValue } from "./state/state";
import MainPage from "./MainPage";
import FooterBar from "./FooterBar";
import MenuBar, {
  BookListPage,
  AuthorListPage,
  BookInfoPage,
  AuthorInfoPage,
  LoginForm,
  InfoPage,
} from "./MenuBar";

const App: React.FC = (): JSX.Element => {
  const [{ actived }] = useStateValue();

  return (
    <div className="App">
      <Helmet>
        <title>Book store {actived === "home" ? "" : ": " + actived}</title>
      </Helmet>
      <Router>
        <Container style={{ padding: "0em 0em 10em" }} vertical>
          <MenuBar />
          <Divider hidden />
          <Switch>
            <Route path="/books/:isbn" render={() => <BookInfoPage />} />
            <Route path="/authors/:ssn" render={() => <AuthorInfoPage />} />
            <Route path="/authors" render={() => <AuthorListPage />} />
            <Route path="/books" render={() => <BookListPage />} />
            <Route path="/login" render={() => <LoginForm />} />
            <Route path="/info" render={() => <InfoPage />} />
            <Route path="/" render={() => <MainPage />} exact />
          </Switch>
        </Container>
        <FooterBar />
      </Router>
    </div>
  );
};

export default App;
