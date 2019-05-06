import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './basicComps/navbar'
import Search from './comps/search'
import Plans from './plans-notifs/plans'
import Notifs from './plans-notifs/notifs'
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

const routing = (
    <div>
        <Navbar />
        <Router>
            <Switch>
                <Route exact path="/" component={Search} />
                <Route path ="/plans" component={Plans} />
                <Route path="/notifs" component={Notifs} />
            </Switch>
        </Router>    
    </div>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
