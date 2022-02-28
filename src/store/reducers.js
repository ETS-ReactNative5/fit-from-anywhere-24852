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

export function profile(state = {}, action) {
    if (action.type == types.SET_PROFILE) {
        return action.payload;
    }

    return state;
}

export function profiles(state = {}, action) {
    if (action.type == types.SET_PROFILES) {
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

export function isOnboarding(state = true, action) {
    if (action.type == types.SET_SHOW_ONBOARDING) {
        return action.payload;
    }

    return state;
}