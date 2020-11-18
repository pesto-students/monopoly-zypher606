import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Monopoly from '../monopoly/monopoly.module';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  return (
    <Router basename={'/'}>
      <Switch>
        <Redirect exact from="/" to="monopoly" />
        <Route path="/monopoly" children={ Monopoly } />
        <Redirect from="**" to="/monopoly" />

        {/* Load the required modules accordingly below */}
      </Switch>
    </Router>
  );
}

export default App;
