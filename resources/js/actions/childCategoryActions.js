import Axios from "axios";

import {
    CHILD_CATEGORY_LIST_REQUEST,
    CHILD_CATEGORY_LIST_SUCCESS,
    CHILD_CATEGORY_LIST_FAIL,
    CHILD_CATEGORY_SHOW_FAIL,
    CHILD_CATEGORY_SHOW_SUCCESS,
    CHILD_CATEGORY_SHOW_REQUEST,
    CHILD_CATEGORY_UPDATE_FAIL,
    CHILD_CATEGORY_UPDATE_SUCCESS,
    CHILD_CATEGORY_UPDATE_REQUEST,
    CHILD_CATEGORY_DELETE_FAIL,
    CHILD_CATEGORY_DELETE_SUCCESS,
    CHILD_CATEGORY_DELETE_REQUEST,
    CHILD_CATEGORY_STORE_FAIL,
    CHILD_CATEGORY_STORE_SUCCESS,
    CHILD_CATEGORY_STORE_REQUEST,
} from "./../constants/childCategoryConstants";

export const getChildCatsList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CHILD_CATEGORY_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/child-categories", config);

        dispatch({ type: CHILD_CATEGORY_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CHILD_CATEGORY_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createChildCat =
    (name, parent_category_id) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: CHILD_CATEGORY_STORE_REQUEST });

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
                "/api/child-categories",
                {
                    name,
                    parent_category_id
                },
                config
            );

            dispatch({ type: CHILD_CATEGORY_STORE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: CHILD_CATEGORY_STORE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.errors
                        : error.message,
            });
        }
    };

export const getChildCat = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: CHILD_CATEGORY_SHOW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get(`/api/child-categories/${id}`, config);

        dispatch({ type: CHILD_CATEGORY_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CHILD_CATEGORY_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const editChildCat =
    (id, name, parent_category_id) => async (dispatch, getState) => {
        try {
            dispatch({ type: CHILD_CATEGORY_UPDATE_REQUEST });

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
                `/api/child-categories/${id}`,
                {
                    id,
                    name,
                    parent_category_id
                },
                config
            );

            dispatch({ type: CHILD_CATEGORY_UPDATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: CHILD_CATEGORY_UPDATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };

export const deleteChildCat =
    (id) => async (dispatch, getState) => {
        try {
            dispatch({ type: CHILD_CATEGORY_DELETE_REQUEST });

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
                `/api/child-categories/${id}`,
                config
            );

            dispatch({ type: CHILD_CATEGORY_DELETE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: CHILD_CATEGORY_DELETE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };
