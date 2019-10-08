import { RESOLVE_ME, CLEAR } from '../actionNames';

export default (state = null, action) => {
    switch (action.type) {
        case RESOLVE_ME:
            return action.payload;
        case CLEAR:
            return null;
        default:
            return state;
    }
};
