/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import axios from "axios";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Container, Divider } from "semantic-ui-react";
import { Helmet } from "react-helmet-async";

import { BookPage, AuthorPage } from "./types";
import { useStateValue } from "./state/state";
import { baseUrl } from "./constants";
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
  const [{ actived }, dispatch] = useStateValue();

  React.useEffect(() => {
    void (async () => {
      try {
        const { data: bookPage } = await axios.get<BookPage>(
          `${baseUrl}/books`
        );
        const { data: authorPage } = await axios.get<AuthorPage>(
          `${baseUrl}/authors`
        );
        dispatch({ type: "SET_BOOK_LIST", payload: bookPage.data });
        dispatch({ type: "SET_AUTHOR_LIST", payload: authorPage.data });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [dispatch]);

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
