import * as types from "./constants"

export const setUser = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_USER,
        payload,
    });
};

export const setSplash = (payload) => (dispatch) => {
    dispatch({
        type: types.SET_SPLASH,
        payload,
    });
};

