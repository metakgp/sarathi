import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './basicComps/navbar'
import Search from './comps/search'
import Plans from './plans-notifs/plans'
import Notifs from './plans-notifs/notifs'
import LoginPage from './comps/login'
import * as serviceWorker from './serviceWorker';
//import { BrowserRouter as Router,Route } from 'react-router-dom';
import { BrowserRouter,Route } from 'react-router-dom'

const routing = (
        <BrowserRouter>
            <div>
                <Route exact path="/" component={Search} />
                <Route exact path = '/login' component={LoginPage} />
                <Route exact path ="/plans" component={Plans} />
                <Route  exact path="/notifs" component={Notifs} />
            </div>
        </BrowserRouter>    
    )


ReactDOM.render(<Navbar />, document.getElementById('navbar'));
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
