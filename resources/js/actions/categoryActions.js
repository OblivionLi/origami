import Axios from "axios";

import {
    ACCESSORIES_LIST_FAIL,
    ACCESSORIES_LIST_REQUEST,
    ACCESSORIES_LIST_SUCCESS,
    ORIGAMI_LIST_REQUEST,
    ORIGAMI_LIST_SUCCESS,
    ORIGAMI_LIST_FAIL,
    SPECIAL_OFFER_LIST_FAIL,
    SPECIAL_OFFER_LIST_SUCCESS,
    SPECIAL_OFFER_LIST_REQUEST,
} from "./../constants/categoryConstants";


export const getAccessories = (page="") => async (dispatch, getState) => {
    try {
        dispatch({ type: ACCESSORIES_LIST_REQUEST });

        const { data } = await Axios.get(`/api/accessories?page=${page}`);

        dispatch({ type: ACCESSORIES_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ACCESSORIES_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const getOrigami = (page="") => async (dispatch, getState) => {
    try {
        dispatch({ type: ORIGAMI_LIST_REQUEST });

        const { data } = await Axios.get(`/api/origami?page=${page}`);

        dispatch({ type: ORIGAMI_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORIGAMI_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const getSpecialOffers = (page="") => async (dispatch, getState) => {
    try {
        dispatch({ type: SPECIAL_OFFER_LIST_REQUEST });

        const { data } = await Axios.get(`/api/special-offers?page=${page}`);

        dispatch({ type: SPECIAL_OFFER_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: SPECIAL_OFFER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};
