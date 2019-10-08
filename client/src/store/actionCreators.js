import * as actionNames from './actionNames';

export const toggleLoader = (active) => ({ type: actionNames.TOGGLE_LOADER, payload: active });
export const resolveMe = (me) => ({ type: actionNames.RESOLVE_ME, payload: me });

export const clear = () => ({ type: actionNames.CLEAR });