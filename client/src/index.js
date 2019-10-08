import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ConnectedRouter } from 'connected-react-router';
import history from './utils/history';
import Navbar from './inputs/navBar'
import * as serviceWorker from './serviceWorker';
import App from './App';
import Footer from './displays/footer'

ReactDOM.render(
    <Provider store={store}>
        <Navbar />
    </Provider>,
    document.getElementById('navbar'));

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'));

ReactDOM.render(<Footer />, document.getElementById('footer_container'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
