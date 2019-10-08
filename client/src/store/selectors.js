import { createSelector } from 'reselect';

export const getMe = (state) => state.me;

export const getRouter = (state) => state.router;

export const getLocation = createSelector(
  getRouter,
  router => router.location
);

export const getHash = createSelector(
  getLocation,
  location => (location ? location.hash : null)
);

export const getPathname = createSelector(
  getLocation,
  location => location.pathname
);

export const getRouteMatch = createSelector(
  getRouter,
  router => router.match
);