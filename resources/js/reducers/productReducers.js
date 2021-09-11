import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_RESET,
    PRODUCT_UPDATE_RESET,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_SHOW_RESET,
    PRODUCT_SHOW_FAIL,
    PRODUCT_SHOW_SUCCESS,
    PRODUCT_SHOW_REQUEST,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_STORE_RESET,
    PRODUCT_STORE_FAIL,
    PRODUCT_STORE_SUCCESS,
    PRODUCT_STORE_REQUEST,
    PRODUCT_IMAGE_CREATE_FAIL,
    PRODUCT_IMAGE_CREATE_REQUEST,
    PRODUCT_IMAGE_CREATE_RESET,
    PRODUCT_IMAGE_CREATE_SUCCESS,
    PRODUCT_IMAGE_DELETE_FAIL,
    PRODUCT_IMAGE_DELETE_REQUEST,
    PRODUCT_IMAGE_DELETE_SUCCESS,
    PRODUCT_IMAGE_REPLACE_FAIL,
    PRODUCT_IMAGE_REPLACE_REQUEST,
    PRODUCT_IMAGE_REPLACE_RESET,
    PRODUCT_IMAGE_REPLACE_SUCCESS,
} from "./../constants/productConstants";

export const productListReducer = (state = { products: {} }, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] };

        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };

        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload };

        case PRODUCT_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const productStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_STORE_REQUEST:
            return { loading: true };

        case PRODUCT_STORE_SUCCESS:
            return { loading: false, success: true, product: action.payload };

        case PRODUCT_STORE_FAIL:
            return { loading: false, error: action.payload };

        case PRODUCT_STORE_RESET:
            return {};

        default:
            return state;
    }
};

export const productUpdateReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return { loading: true, };

        case PRODUCT_UPDATE_SUCCESS:
            return { loading: false, success: true, product: action.payload };

        case PRODUCT_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case PRODUCT_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const productShowReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_SHOW_REQUEST:
            return { ...state, loading: true };

        case PRODUCT_SHOW_SUCCESS:
            return { loading: false, product: action.payload };

        case PRODUCT_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case PRODUCT_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const productDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true };

        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true };

        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}


export const productImageCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_IMAGE_CREATE_REQUEST:
            return { loading: true };

        case PRODUCT_IMAGE_CREATE_SUCCESS:
            return { loading: false, success: true, image: action.payload };

        case PRODUCT_IMAGE_CREATE_FAIL:
            return { loading: false, error: action.payload };

        case PRODUCT_IMAGE_CREATE_RESET:
            return {};

        default:
            return state;
    }
};

export const productImageReplaceReducer = (state = { productImage: {} }, action) => {
    switch (action.type) {
        case PRODUCT_IMAGE_REPLACE_REQUEST:
            return { loading: true };

        case PRODUCT_IMAGE_REPLACE_SUCCESS:
            return { loading: false, success: true, productImage: action.payload };

        case PRODUCT_IMAGE_REPLACE_FAIL:
            return { loading: false, error: action.payload };

        case PRODUCT_IMAGE_REPLACE_RESET:
            return {
                productImage: {},
            };
        default:
            return state;
    }
};

export const productImageDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_IMAGE_DELETE_REQUEST:
            return { loading: true };

        case PRODUCT_IMAGE_DELETE_SUCCESS:
            return { loading: false, success: true };

        case PRODUCT_IMAGE_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};
