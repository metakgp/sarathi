import { TOGGLE_LOADER } from '../actionNames';

export default (state = false, action) => {
    switch (action.type) {
        case TOGGLE_LOADER:
            return action.payload;
        default:
            return state;
    }
};
