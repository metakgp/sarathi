import LoginPage from './pages/login'
import Search from './pages/search'
import Groups from './pages/groups'
import Requests from './pages/requests'
import Notifs from './pages/notifs'
import loginRedirector from './utils/loginRedirector'
import privacyPolicy from './pages/privacyPolicy';
import termsOfUse from './pages/termsOfUse';

export const paths = {
  LOGIN: '/login',
  SEARCH: '/',
  GROUPS: '/groups',
  REQUESTS: '/requests',
  NOTIFS: '/notifs',
  LOGIN_REDIRECT: '/loginRedirect',
  PRIVACY_POLICY: '/privacyPolicy',
  TERMS_OF_USE: '/termsOfUse'
}

export default [
  { path: paths.LOGIN, component: LoginPage, exact: true, auth: false },
  { path: paths.SEARCH, component: Search, exact: true, auth: true },
  { path: paths.GROUPS, component: Groups, exact: true, auth: true },
  { path: paths.REQUESTS, component: Requests, exact: true, auth: true },
  { path: paths.NOTIFS, component: Notifs, exact: true, auth: true },
  { path: paths.LOGIN_REDIRECT, component: loginRedirector, exact: true, auth: false },
  { path: paths.PRIVACY_POLICY, component: privacyPolicy, exact: true, auth: false },
  { path: paths.TERMS_OF_USE, component: termsOfUse, exact: true, auth: false },
];