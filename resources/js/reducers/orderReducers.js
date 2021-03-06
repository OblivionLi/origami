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
    ORDER_PAY_RESET,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_RESET,
    ORDER_USER_LIST_FAIL, 
    ORDER_USER_LIST_REQUEST,
    ORDER_USER_LIST_SUCCESS,
    ORDER_PDF_REQUEST,
    ORDER_PDF_SUCCESS,
    ORDER_PDF_FAIL,
    ORDER_DELETE_FAIL,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_REQUEST
} from "../constants/orderConstants";

export const orderListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return { loading: true };

        case ORDER_LIST_SUCCESS:
            return { loading: false, orders: action.payload };

        case ORDER_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const orderUserListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_USER_LIST_REQUEST:
            return { loading: true };

        case ORDER_USER_LIST_SUCCESS:
            return { loading: false, orders: action.payload };

        case ORDER_USER_LIST_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return {
                loading: true,
            };

        case ORDER_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload,
            };

        case ORDER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const orderShowReducer = (
    state = { order: {} },
    action
) => {
    switch (action.type) {
        case ORDER_SHOW_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case ORDER_SHOW_SUCCESS:
            return {
                loading: false,
                order: action.payload,
            };

        case ORDER_SHOW_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return {
                loading: true,
            };

        case ORDER_PAY_SUCCESS:
            return {
                loading: false,
                success: true,
            };

        case ORDER_PAY_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case ORDER_PAY_RESET:
            return {};
        default:
            return state;
    }
};

export const orderDeliverReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELIVER_REQUEST:
            return {
                loading: true,
            };

        case ORDER_DELIVER_SUCCESS:
            return {
                loading: false,
                success: true,
            };

        case ORDER_DELIVER_FAIL:
            return {
                loading: false,
                error: action.payload,
            };

        case ORDER_DELIVER_RESET:
            return {};
        default:
            return state;
    }
};


export const orderPDFReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PDF_REQUEST:
            return {
                loading: true,
            };

        case ORDER_PDF_SUCCESS:
            return {
                loading: false,
                success: true
            };

        case ORDER_PDF_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};


export const orderDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELETE_REQUEST:
            return { loading: true };

        case ORDER_DELETE_SUCCESS:
            return { loading: false, success: true };

        case ORDER_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}