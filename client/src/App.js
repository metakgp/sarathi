import React, { PureComponent } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import routes from './routes';
import { getMe, getRouteMatch } from './store/selectors.js';
import { checkLogin, fetchInitData } from './store/thunks';
import InvalidPage from './pages/invalidPage';

const mapStateToProps = (state) => ({
    // loader: getLoader(state),
    isLoggedIn: !!getMe(state),
    route: getRouteMatch(state),
  });

const mapDispatchToProps = { checkLogin, fetchInitData };

class App extends PureComponent {
    componentDidMount() {
        console.log('mount');
        this.props.fetchInitData();
    }

    renderRoute = (props) => {
        const { isLoggedIn } = this.props;
        const path = props.match.path;
        const route = routes.find(route => route.path === path);
        if (!route) return null;
        window.scrollTo(0, 0);
        const { auth, component: Component } = route;
        // We do not provide props to component, because
        // props.match is never the same object as previously
        // and causes a render every time...
        return auth && !isLoggedIn ? null : <Component />;
    };

    render() {
        return (
            <ConnectedRouter history={this.props.history}>
                <Switch>
                    {routes.map(({ path, exact }) => (
                        <Route key={path} path={path} exact={exact} render={this.renderRoute} />
                    ))}
                    <Route component={InvalidPage} />
                </Switch>
            </ConnectedRouter>
        )
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);