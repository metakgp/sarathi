import axios from 'axios';
import { push } from 'connected-react-router';
import { paths } from '../routes';
import { getRouteMatch } from './selectors';
import { toggleLoader, resolveMe, clear } from './actions';
import {unregisterPushManager} from '../utils/registerPush';

export const fetchUser = () => async (dispatch) => {
    const { data: user } = await axios.get('/api/user');
    if (user) dispatch(resolveMe(user));
}

export const fetchInitData = () => async (dispatch, getState) => {
    dispatch(toggleLoader(true));
    dispatch(fetchUser());
    dispatch(toggleLoader(false));
}

export const logout = () => async (dispatch, getState) => {
    try {
        dispatch(toggleLoader(true));
        dispatch(clear());
        const routeMatch = getRouteMatch(getState());
        if (!routeMatch || routeMatch.match.path !== paths.LOGIN) {
            dispatch(push(paths.LOGIN));
        }
        await unregisterPushManager();
        fetch('/api/auth/logout');
        dispatch(toggleLoader(false));
    } catch (error) {
        console.error(error);
    }
};

/* export const checkLogin = () => async (dispatch, getState) => {
    try {
        const routeMatch = getRouteMatch(getState());
        if (!!routeMatch) return;

        dispatch(toggleLoader(true));
        console.log('check login');

        axios
        .get('/api/auth/status')
        .then(res => {
            if (res.status === '200') {
                dispatch(toggleLoader(false));
                //dispatch(push(paths.SEARCH));
                return;
            } else {
                const error = new Error(res.error);
                throw error;
            }
        })
        .catch(err => {
            console.error(err);
            dispatch(resolveMe(false));
            dispatch(push(paths.LOGIN));
            dispatch(toggleLoader(false));
            return;
        });
    } catch (error) {
        console.error(error);
    }
}; */