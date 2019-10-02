import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './inputs/navBar'
import * as serviceWorker from './serviceWorker';
import App from './App';
import Footer from './displays/footer'
import axios from 'axios'
import { join } from 'path';
//import { BrowserRouter as Router,Route } from 'react-router-dom';
// import { BrowserRouter, Route, Redirect } from 'react-router-dom'

axios.interceptors.request.use((config) => {

    if (process.env.NODE_ENV === 'production') {
        config.baseURL = 'http://localhost:5000'
    }

    const token = window.localStorage.getItem('auth-token');
    if (token)
        config.headers['Authorization'] = token;
    else
        config.headers['Authorization'] = undefined;

    return config;
})

ReactDOM.render(<Navbar />, document.getElementById('navbar'));
ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Footer />, document.getElementById('footer_container'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
