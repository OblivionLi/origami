import Axios from "axios";

import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_SHOW_FAIL,
    PRODUCT_SHOW_SUCCESS,
    PRODUCT_SHOW_REQUEST,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_DELETE_FAIL,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_STORE_FAIL,
    PRODUCT_STORE_SUCCESS,
    PRODUCT_STORE_REQUEST,
    PRODUCT_IMAGE_CREATE_FAIL,
    PRODUCT_IMAGE_CREATE_REQUEST,
    PRODUCT_IMAGE_CREATE_SUCCESS,
    PRODUCT_IMAGE_DELETE_FAIL,
    PRODUCT_IMAGE_DELETE_REQUEST,
    PRODUCT_IMAGE_DELETE_SUCCESS,
    PRODUCT_IMAGE_REPLACE_FAIL,
    PRODUCT_IMAGE_REPLACE_REQUEST,
    PRODUCT_IMAGE_REPLACE_SUCCESS,
    PRODUCT_SHOWCASE_FAIL,
    PRODUCT_SHOWCASE_SUCCESS,
    PRODUCT_SHOWCASE_REQUEST,
} from "./../constants/productConstants";

export const getProductsList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/products", config);

        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createProduct = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_STORE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.post("/api/products", formData, config);

        dispatch({ type: PRODUCT_STORE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_STORE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.errors
                    : error.message,
        });
    }
};

export const getProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_SHOW_REQUEST });

        const { data } = await Axios.get(`/api/products/${id}`);

        dispatch({ type: PRODUCT_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const editProduct =
    (
        id,
        child_category_id,
        name,
        product_code,
        price,
        discount,
        description,
        special_offer
    ) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: PRODUCT_UPDATE_REQUEST });

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
                `/api/products/${id}`,
                {
                    id,
                    child_category_id,
                    name,
                    product_code,
                    price,
                    discount,
                    description,
                    special_offer
                },
                config
            );

            dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PRODUCT_UPDATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.message
                        : error.message,
            });
        }
    };

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.delete(`/api/products/${id}`, config);

        dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

export const createProductImage = (productIdImage, formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_IMAGE_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
                "Content-Type": "multipart/form-data"
            },
        };

        const { data } = await Axios.post(
            `/api/productImage/${productIdImage}`,
            formData,
            config
        );

        dispatch({ type: PRODUCT_IMAGE_CREATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_IMAGE_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const replaceProductImage = (
    productReplaceImageId,
    formData
) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_IMAGE_REPLACE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
                "Content-Type": "multipart/form-data"
            },
        };

        const { data } = await Axios.post(
            `/api/RproductImage/${productReplaceImageId}`,
            formData,
            config
        );

        dispatch({ type: PRODUCT_IMAGE_REPLACE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_IMAGE_REPLACE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deleteProductImage = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_IMAGE_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.delete(`/api/productImage/${id}`, config);

        dispatch({ type: PRODUCT_IMAGE_DELETE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_IMAGE_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getShowcaseList = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_SHOWCASE_REQUEST });

        const { data } = await Axios.get("/api/showcase-products");

        dispatch({ type: PRODUCT_SHOWCASE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_SHOWCASE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};

