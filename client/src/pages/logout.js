import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default class Logout extends Component {

    state = {
        loading: true,
    }

    componentWillMount() {
        console.log("Inside logout");
        fetch('/api/auth/logout')
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