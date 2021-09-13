import Axios from "axios";

import {
    REVIEW_LIST_REQUEST,
    REVIEW_LIST_SUCCESS,
    REVIEW_LIST_FAIL,
    REVIEW_SHOW_FAIL,
    REVIEW_SHOW_SUCCESS,
    REVIEW_SHOW_REQUEST,
    REVIEW_UPDATE_FAIL,
    REVIEW_UPDATE_SUCCESS,
    REVIEW_UPDATE_REQUEST,
    REVIEW_DELETE_FAIL,
    REVIEW_DELETE_SUCCESS,
    REVIEW_DELETE_REQUEST,
    REVIEW_STORE_FAIL,
    REVIEW_STORE_SUCCESS,
    REVIEW_STORE_REQUEST,
    REVIEW_LIST_PAGINATION_REQUEST,
    REVIEW_LIST_PAGINATION_SUCCESS,
    REVIEW_LIST_PAGINATION_FAIL,
    REVIEW_LIST_PAGINATION_RESET
} from "./../constants/reviewConstants";

export const getReviewsList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: REVIEW_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/reviews", config);

        dispatch({ type: REVIEW_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: REVIEW_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const getReviewsPagList = (id, page="") => async (dispatch, getState) => {
    try {
        dispatch({ type: REVIEW_LIST_PAGINATION_REQUEST });

        const { data } = await Axios.get(`/api/reviews/product/${id}?page=${page}`);

        dispatch({ type: REVIEW_LIST_PAGINATION_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: REVIEW_LIST_PAGINATION_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createReview =
    (product_id, user_id, username, rating, comment) => async (dispatch, getState) => {
        try {
            dispatch({ type: REVIEW_STORE_REQUEST });

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
                `/api/reviews/${product_id}`,
                {
                    user_id,
                    username,
                    rating,
                    comment,
                },
                config
            );

            dispatch({ type: REVIEW_STORE_SUCCESS });
        } catch (error) {
            dispatch({
                type: REVIEW_STORE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const getReview = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: REVIEW_SHOW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get(`/api/reviews/${id}`, config);

        dispatch({ type: REVIEW_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: REVIEW_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const editReview =
    (id, user_comment, admin_comment) => async (dispatch, getState) => {
        try {
            dispatch({ type: REVIEW_UPDATE_REQUEST });

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
                `/api/reviews/${id}`,
                {
                    id,
                    user_comment,
                    admin_comment,
                },
                config
            );

            dispatch({ type: REVIEW_UPDATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: REVIEW_UPDATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };

export const deleteReview = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: REVIEW_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.delete(`/api/reviews/${id}`, config);

        dispatch({ type: REVIEW_DELETE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: REVIEW_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};
