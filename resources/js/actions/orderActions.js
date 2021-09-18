import Axios from "axios";
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_SHOW_REQUEST,
    ORDER_SHOW_SUCCESS,
    ORDER_SHOW_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_USER_LIST_FAIL,
    ORDER_USER_LIST_REQUEST,
    ORDER_USER_LIST_SUCCESS,
    ORDER_PDF_REQUEST,
    ORDER_PDF_SUCCESS,
    ORDER_PDF_FAIL,
    ORDER_DELETE_FAIL,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_REQUEST,
} from "../constants/orderConstants";

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/orders", config);

        dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listUserOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_USER_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get("/api/user-order", config);

        dispatch({ type: ORDER_USER_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_USER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const createOrder =
    (
        user_id,
        cart_items,
        products_price,
        shipping_price,
        tax_price,
        total_price,
        products_discount_price
    ) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_CREATE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const { data } = await Axios.post(
                "/api/order",
                {
                    user_id,
                    cart_items,
                    products_price,
                    products_discount_price,
                    shipping_price,
                    tax_price,
                    total_price,
                },
                config
            );

            dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: ORDER_CREATE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const getOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_SHOW_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "aplication/json",
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.get(`/api/order/${id}`, config);

        dispatch({ type: ORDER_SHOW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_SHOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const payOrder = (orderId) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.patch(
            `/api/order/${orderId}/pay`,
            {},
            config
        );

        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deliverOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DELIVER_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.data.access_token}`,
            },
        };

        const { data } = await Axios.patch(
            `/api/orders/${id}/delivered`,
            {},
            config
        );

        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const createPDFOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PDF_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        Axios({
            url: `/api/order/pdf/${id}`,
            method: "GET",
            responseType: "blob", // important
            authorization: `Bearer ${userInfo.data.access_token}`,
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Your-Order-Invoice.pdf");
            document.body.appendChild(link);
            link.click();
        });

        dispatch({ type: ORDER_PDF_SUCCESS });
    } catch (error) {
        dispatch({
            type: ORDER_PDF_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deleteOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DELETE_REQUEST });

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
            `/api/orders/${id}`,
            config
        );

        dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.message
                    : error.message,
        });
    }
};
