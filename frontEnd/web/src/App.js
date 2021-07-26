import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import TestApp from "./Apps/Test/TestApp";
import LoginApp from "./Apps/Login/LoginApp";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/TestApp">
            <TestApp />
          </Route>
          <Route path="/">
            <LoginApp />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}