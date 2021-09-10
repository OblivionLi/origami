import Axios from "axios";

import {
    ROLE_LIST_REQUEST,
    ROLE_LIST_SUCCESS,
    ROLE_LIST_FAIL,
    ROLE_SHOW_FAIL,
    ROLE_SHOW_SUCCESS,
    ROLE_SHOW_REQUEST,
    ROLE_UPDATE_FAIL,
    ROLE_UPDATE_SUCCESS,
    ROLE_UPDATE_REQUEST,
    ROLE_DELETE_FAIL,
    ROLE_DELETE_SUCCESS,
    ROLE_DELETE_REQUEST,
    ROLE_STORE_FAIL,
    ROLE_STORE_SUCCESS,
    ROLE_STORE_REQUEST,
} from "./../constants/roleConstants";

export const getRolesList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ROLE_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/roles", config);

        dispatch({ type: ROLE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ROLE_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createRole =
    (name) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: ROLE_STORE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const { data } = await Axios.post(
                "/api/roles",
                {
                    name,
                },
                config
            );

            dispatch({ type: ROLE_STORE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: ROLE_STORE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.errors
                        : error.message,
            });
        }
    };

export const getRole = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ROLE_SHOW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get(`/api/roles/${id}`, config);

        dispatch({ type: ROLE_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ROLE_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const editRole =
    (id, name, is_admin, perms) => async (dispatch, getState) => {
        try {
            dispatch({ type: ROLE_UPDATE_REQUEST });

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
                `/api/roles/${id}`,
                {
                    id,
                    name,
                    is_admin,
                    perms
                },
                config
            );

            dispatch({ type: ROLE_UPDATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: ROLE_UPDATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };

export const deleteRole =
    (id) => async (dispatch, getState) => {
        try {
            dispatch({ type: ROLE_DELETE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const { data } = await Axios.delete(
                `/api/roles/${id}`,
                config
            );

            dispatch({ type: ROLE_DELETE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: ROLE_DELETE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };
