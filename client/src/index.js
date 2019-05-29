import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './searchComps/navbar'
import Search from './pages/search'
import Plans from './pages/plans'
import Notifs from './plans-notifs/notifs'
import Requests from './plans-notifs/requests'
import LoginPage from './pages/login'
import * as serviceWorker from './serviceWorker';
//import { BrowserRouter as Router,Route } from 'react-router-dom';
import { BrowserRouter,Route } from 'react-router-dom'

const routing = (
        <BrowserRouter>
            <div>
                <Route exact path="/" component={Search} />
                <Route path = '/login' component={LoginPage} />
                <Route path ="/plans" component={Plans} />
                <Route path='/requests' component={Requests} />
                <Route path="/notifs" component={Notifs} />
            </div>
        </BrowserRouter>    
    )


// ReactDOM.render(<Navbar />, document.getElementById('navbar'));
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
