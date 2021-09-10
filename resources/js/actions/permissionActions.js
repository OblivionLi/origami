import Axios from "axios";

import {
    PERMISSION_LIST_REQUEST,
    PERMISSION_LIST_SUCCESS,
    PERMISSION_LIST_FAIL,
    PERMISSION_SHOW_FAIL,
    PERMISSION_SHOW_SUCCESS,
    PERMISSION_SHOW_REQUEST,
    PERMISSION_UPDATE_FAIL,
    PERMISSION_UPDATE_SUCCESS,
    PERMISSION_UPDATE_REQUEST,
    PERMISSION_DELETE_FAIL,
    PERMISSION_DELETE_SUCCESS,
    PERMISSION_DELETE_REQUEST,
    PERMISSION_STORE_FAIL,
    PERMISSION_STORE_SUCCESS,
    PERMISSION_STORE_REQUEST,
} from "./../constants/permissionConstants";

export const getPermissionsList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PERMISSION_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/permissions", config);

        dispatch({ type: PERMISSION_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PERMISSION_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createPermission =
    (name) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: PERMISSION_STORE_REQUEST });

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
                "/api/permissions",
                {
                    name,
                },
                config
            );

            dispatch({ type: PERMISSION_STORE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PERMISSION_STORE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.errors
                        : error.message,
            });
        }
    };

export const getPermission = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PERMISSION_SHOW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get(`/api/permissions/${id}`, config);

        dispatch({ type: PERMISSION_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PERMISSION_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const editPermission =
    (id, name) => async (dispatch, getState) => {
        try {
            dispatch({ type: PERMISSION_UPDATE_REQUEST });

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
                `/api/permissions/${id}`,
                {
                    id,
                    name
                },
                config
            );

            dispatch({ type: PERMISSION_UPDATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PERMISSION_UPDATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };

export const deletePermission =
    (id) => async (dispatch, getState) => {
        try {
            dispatch({ type: PERMISSION_DELETE_REQUEST });

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
                `/api/permissions/${id}`,
                config
            );

            dispatch({ type: PERMISSION_DELETE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PERMISSION_DELETE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };
