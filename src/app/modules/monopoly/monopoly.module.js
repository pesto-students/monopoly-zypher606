import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import HomeComponent from "./components/home/home.component";
import GameplayComponent from './components/gameplay/gameplay.component';

function Monopoly(props) {
    return (
        <Router basename={props.match.path}>
            <Redirect exact from="/" to="gameplay" />
            <Route exact path="/" component={ HomeComponent } />
            <Route exact path="/gameplay" component={ GameplayComponent } />
        </Router>
    );
}

export default Monopoly;