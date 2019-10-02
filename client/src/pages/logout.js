import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios'

import {unregisterPushManager} from '../registerPush';

export default class Logout extends Component {

    state = {
        loading: true,
    }

    componentWillMount() {

        // unregister push manager and logout
        unregisterPushManager()
        .then(() => axios.get('/api/auth/logout'))
        .then(res => {
            this.setState({loading: false});

            // Remove token from local storage
            window.localStorage.removeItem('auth-token');
        })
        .catch(err =>  {
            this.setState({loading: false});
            
            // Remove token from local storage
            window.localStorage.removeItem('auth-token');
        });

    }

    render() {
        return (this.state.loading ?
        null :
        <Redirect to={{
            pathname: '/login',
            state: {message: 'Logged Out successfully'}
        }} />)
    }

};