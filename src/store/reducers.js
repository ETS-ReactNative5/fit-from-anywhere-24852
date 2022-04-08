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

export function workoutPlans(state = {}, action) {
    if (action.type == types.SET_WORKOUT_PLANS) {
        return action.payload;
    }

    return state;
}

export function gym(state = null, action) {
    if (action.type == types.SET_GYM) {
        return action.payload;
    }

    return state;
}

export function programs(state = [], action) {
    if (action.type == types.SET_PROGRAMS) {
        return action.payload;
    }

    return state;
}

export function isNextExercise(state = false, action) {
    if (action.type == types.SET_NEXT_EXERCISE) {
        return action.payload;
    }

    return state;
}

export function remember(state = null, action) {
    if (action.type == types.SET_REMEMBER) {
        return action.payload;
    }

    return state;
}