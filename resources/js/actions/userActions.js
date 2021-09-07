import Axios from "axios";
import {
    USER_FORGOT_PASSWORD_REQUEST,
    USER_FORGOT_PASSWORD_SUCCESS,
    USER_FORGOT_PASSWORD_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_RESET,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_RESET_PASSWORD_FAIL,
    USER_RESET_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_SUCCESS,
    USER_TOKEN_RESET_PASSWORD_REQUEST,
    USER_TOKEN_RESET_PASSWORD_SUCCESS,
    USER_TOKEN_RESET_PASSWORD_FAIL,
    USER_UPDATE_CREDENTIALS_FAIL,
    USER_UPDATE_CREDENTIALS_SUCCESS,
    USER_UPDATE_CREDENTIALS_REQUEST,
} from "../constants/userConstants";

export const register =
    (name, email, password, password_confirmation, remember_me) =>
    async (dispatch) => {
        try {
            dispatch({ type: USER_REGISTER_REQUEST });

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

            const { data } = await Axios.post(
                "/api/register",
                {
                    name,
                    email,
                    password,
                    password_confirmation,
                    remember_me,
                },
                config
            );

            dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
            dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

            localStorage.setItem("userInfo", JSON.stringify(data));
        } catch (error) {
            dispatch({
                type: USER_REGISTER_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.errors
                        : error.message,
            });
        }
    };

export const login = (email, password, remember_me) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        };

        const { data } = await Axios.post(
            "/api/login",
            {
                email,
                password,
                remember_me,
            },
            config
        );

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logout = (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_REGISTER_RESET });
};

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        };

        const { data } = await Axios.post(
            "/api/forgot-password",
            {
                email,
            },
            config
        );

        dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_FORGOT_PASSWORD_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const resetPassword =
    (email, password, password_confirmation) => async (dispatch) => {
        try {
            dispatch({ type: USER_RESET_PASSWORD_REQUEST });

            const { data } = await Axios.patch(`/api/reset-password/${email}`, {
                password,
                password_confirmation,
            });

            dispatch({ type: USER_RESET_PASSWORD_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: USER_RESET_PASSWORD_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const getTokenResetPassword = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_TOKEN_RESET_PASSWORD_REQUEST });

        const { data } = await Axios.get(`/api/reset-password/${id}`);

        dispatch({ type: USER_TOKEN_RESET_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_TOKEN_RESET_PASSWORD_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateCredentials =
    (id, name, email, password) => async (dispatch, getState) => {
        try {
            dispatch({ type: USER_UPDATE_CREDENTIALS_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const { data } = await Axios.patch(
                `/api/update-credentials/${id}`,
                {
                    name,
                    email,
                    password,
                },
                config
            );

            dispatch({ type: USER_UPDATE_CREDENTIALS_SUCCESS, payload: data });

            const profile = JSON.parse(localStorage.getItem("userInfo"));

            const obj = {
                data: {
                    message: data.message,
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    access_token: profile.data.access_token,
                },
            };

            localStorage.setItem("userInfo", JSON.stringify(obj));
        } catch (error) {
            dispatch({
                type: USER_UPDATE_CREDENTIALS_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.errors
                        : error.message,
            });
        }
    };
