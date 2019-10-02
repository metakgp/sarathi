import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Navbar from './inputs/navBar'
import * as serviceWorker from './serviceWorker';
import App from './App';
import Footer from './displays/footer'

import axios from 'axios';
import { join } from 'path';
//import { BrowserRouter as Router,Route } from 'react-router-dom';
// import { BrowserRouter, Route, Redirect } from 'react-router-dom'

// Set interceptors to add authorization headers
axios.interceptors.request.use((config) => {

    config.url = join('https://sarathi-api.herokuapp.com', config.url);

    var token = window.localStorage.getItem('auth-token');
    if (token)
        config.headers.authorization = token;
    else
        config.headers.authorization = null;

    return config;
});

class Root extends Component {

    render() {

        return (
            <div>
                <Navbar />
                <App />
                <Footer />
            </div>
        )
    }
}


ReactDOM.render(<Root />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<Footer />, document.getElementById('footer_container'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
