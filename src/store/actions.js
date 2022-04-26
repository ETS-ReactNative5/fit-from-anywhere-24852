import * as types from "./constants"

export const setUser = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_USER,
        payload,
    });
};

export const setProfile = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_PROFILE,
        payload,
    });
};

export const setProfiles = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_PROFILES,
        payload,
    });
};

export const setSplash = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_SPLASH,
        payload,
    });
};

export const setShowOnboard = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_SHOW_ONBOARDING,
        payload,
    });
};

export const setWorkoutPlans = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_WORKOUT_PLANS,
        payload,
    });
};

export const setGym = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_GYM,
        payload,
    });
};


export const setPrograms = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_PROGRAMS,
        payload,
    });
};

export const setNextExercise = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_NEXT_EXERCISE,
        payload,
    });
};

export const setRemember = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_REMEMBER,
        payload,
    });
};

export const setDateIndicator = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_DATE_INDICATOR,
        payload,
    });
};



