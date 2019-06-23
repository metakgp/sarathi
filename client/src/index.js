import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './searchComps/respNav'
import * as serviceWorker from './serviceWorker';
import App from './App';
//import { BrowserRouter as Router,Route } from 'react-router-dom';
// import { BrowserRouter, Route, Redirect } from 'react-router-dom'


ReactDOM.render(<Navbar />, document.getElementById('navbar'));
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
