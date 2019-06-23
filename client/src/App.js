import React, {Component} from 'react';
import Search from './pages/search'
import Plans from './pages/plans'
import Notifs from './pages/notifs'
import Requests from './pages/requests'
import LoginPage from './pages/login'
import Logout from './pages/logout'
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import withAuth from './AuthWrapper'

function LoginRedirector(props) {
    const redirectUrl = window.localStorage.getItem('redirectUrl');
    window.localStorage.removeItem('redirectUrl');
    return (
        <Redirect to={redirectUrl ? redirectUrl : '/'} />
    )
}

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Route path = '/login' component={LoginPage} />
                <Route path = '/logout' component={Logout} />
                <Route exact path="/" component={withAuth(Search)} />
                <Route path ="/groups" component={withAuth(Plans)} />
                <Route path='/requests' component={withAuth(Requests)} />
                <Route path="/notifs" component={withAuth(Notifs)} />
                <Route path='/loginRedirect' component={LoginRedirector} />
            </BrowserRouter>
        )
    }
}

export default App;