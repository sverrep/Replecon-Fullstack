import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LoginApp from "./Apps/Login/LoginApp";
import ProfileApp from "./Apps/Profile/ProfileApp";
import SignUpApp from "./Apps/SignUp/SignUpApp";
import TeacherClassApp from "./Apps/TeacherClass/TeacherClassApp";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/SignUp">
            <SignUpApp />
          </Route>
          <Route path="/Login">
            <LoginApp />
          </Route>
          <Route path="/Profile">
            <ProfileApp />
          </Route>
          <Route exact path="/Class/">
            <TeacherClassApp />
          </Route>
          <Route path="/Class/:code">
            <TeacherClassApp />
          </Route>
          <Route
            exactpath="/"
            render={() => {
                return (
                  <Redirect to="/Login" />
                )
            }}
          />
        </Switch>
      </div>
    </Router>
  );
}