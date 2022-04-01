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



