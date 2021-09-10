import Axios from "axios";

import {
    PARENT_CATEGORY_LIST_REQUEST,
    PARENT_CATEGORY_LIST_SUCCESS,
    PARENT_CATEGORY_LIST_FAIL,
    PARENT_CATEGORY_SHOW_FAIL,
    PARENT_CATEGORY_SHOW_SUCCESS,
    PARENT_CATEGORY_SHOW_REQUEST,
    PARENT_CATEGORY_UPDATE_FAIL,
    PARENT_CATEGORY_UPDATE_SUCCESS,
    PARENT_CATEGORY_UPDATE_REQUEST,
    PARENT_CATEGORY_DELETE_FAIL,
    PARENT_CATEGORY_DELETE_SUCCESS,
    PARENT_CATEGORY_DELETE_REQUEST,
    PARENT_CATEGORY_STORE_FAIL,
    PARENT_CATEGORY_STORE_SUCCESS,
    PARENT_CATEGORY_STORE_REQUEST,
} from "./../constants/parentCategoryConstants";

export const getParentCatsList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PARENT_CATEGORY_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/parent-categories", config);

        dispatch({ type: PARENT_CATEGORY_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PARENT_CATEGORY_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createParentCat =
    (name) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: PARENT_CATEGORY_STORE_REQUEST });

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
                "/api/parent-categories",
                {
                    name,
                },
                config
            );

            dispatch({ type: PARENT_CATEGORY_STORE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PARENT_CATEGORY_STORE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.errors
                        : error.message,
            });
        }
    };

export const getParentCat = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PARENT_CATEGORY_SHOW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get(`/api/parent-categories/${id}`, config);

        dispatch({ type: PARENT_CATEGORY_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PARENT_CATEGORY_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const editParentCat =
    (id, name) => async (dispatch, getState) => {
        try {
            dispatch({ type: PARENT_CATEGORY_UPDATE_REQUEST });

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
                `/api/parent-categories/${id}`,
                {
                    id,
                    name
                },
                config
            );

            dispatch({ type: PARENT_CATEGORY_UPDATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PARENT_CATEGORY_UPDATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };

export const deleteParentCat =
    (id) => async (dispatch, getState) => {
        try {
            dispatch({ type: PARENT_CATEGORY_DELETE_REQUEST });

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
                `/api/parent-categories/${id}`,
                config
            );

            dispatch({ type: PARENT_CATEGORY_DELETE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PARENT_CATEGORY_DELETE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };
