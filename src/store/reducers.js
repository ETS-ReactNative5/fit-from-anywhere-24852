import * as types from "./constants.js"

const initialCredential = {
    email: '',
    password: '',
};

export function user(state = null, action) {
    if (action.type == types.SET_USER) {
        //console.log("reducer", action);
        return action.payload;
    }

    return state;
}

export function splash(state = true, action) {
    if (action.type == types.SET_SPLASH) {
        return action.payload;
    }

    return state;
}