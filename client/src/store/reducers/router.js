import { connectRouter, LOCATION_CHANGE } from 'connected-react-router';
import { matchRoutes } from 'react-router-config';
import { parse } from 'query-string';
import history from '../../utils/history';
import routes from '../../routes';

const getState = (state, action) => {
  const router = connectRouter(history)(state, action);
  return {
    ...router,
    match: matchRoutes(routes, router.location.pathname)[0] || null,
    query: parse(router.location.search)
  };
};

export default (state = getState(), action) => {
  return action.type === LOCATION_CHANGE ? getState(state, action) : state;
};
