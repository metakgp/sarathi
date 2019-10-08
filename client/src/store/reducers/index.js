import { combineReducers } from 'redux';
import router from './router';
import loader from './loader';
import me from './me';

export default combineReducers({
  router,
  loader,
  me,
});
