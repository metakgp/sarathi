import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import {unregisterPushManager} from '../utils/registerPush';

export default class Logout extends Component {

    state = {
        loading: true,
    }

    componentWillMount() {

        // unregister push manager and logout
        unregisterPushManager()
        .then(() => fetch('/api/auth/logout'))
        .then(res => this.setState({loading: false}))
        .catch(err => this.setState({loading: false}));

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