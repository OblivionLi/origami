import {
    REVIEW_LIST_REQUEST,
    REVIEW_LIST_SUCCESS,
    REVIEW_LIST_FAIL,
    REVIEW_LIST_RESET,
    REVIEW_UPDATE_RESET,
    REVIEW_UPDATE_FAIL,
    REVIEW_UPDATE_SUCCESS,
    REVIEW_UPDATE_REQUEST,
    REVIEW_SHOW_RESET,
    REVIEW_SHOW_FAIL,
    REVIEW_SHOW_SUCCESS,
    REVIEW_SHOW_REQUEST,
    REVIEW_DELETE_REQUEST,
    REVIEW_DELETE_SUCCESS,
    REVIEW_DELETE_FAIL,
    REVIEW_STORE_RESET,
    REVIEW_STORE_FAIL,
    REVIEW_STORE_SUCCESS,
    REVIEW_STORE_REQUEST,
    REVIEW_LIST_PAGINATION_REQUEST,
    REVIEW_LIST_PAGINATION_SUCCESS,
    REVIEW_LIST_PAGINATION_FAIL,
    REVIEW_LIST_PAGINATION_RESET
} from "./../constants/reviewConstants";

export const reviewListReducer = (state = { reviews: {} }, action) => {
    switch (action.type) {
        case REVIEW_LIST_REQUEST:
            return { loading: true, reviews: [] };

        case REVIEW_LIST_SUCCESS:
            return { loading: false, reviews: action.payload };

        case REVIEW_LIST_FAIL:
            return { loading: false, error: action.payload };

        case REVIEW_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const reviewListPagReducer = (state = { reviews: {} }, action) => {
    switch (action.type) {
        case REVIEW_LIST_PAGINATION_REQUEST:
            return { loading: true, reviews: [] };

        case REVIEW_LIST_PAGINATION_SUCCESS:
            return { loading: false, reviews: action.payload };

        case REVIEW_LIST_PAGINATION_FAIL:
            return { loading: false, error: action.payload };

        case REVIEW_LIST_PAGINATION_RESET:
            return {};

        default:
            return state;
    }
};

export const reviewStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case REVIEW_STORE_REQUEST:
            return { loading: true };

        case REVIEW_STORE_SUCCESS:
            return { loading: false, success: true };

        case REVIEW_STORE_FAIL:
            return { loading: false, error: action.payload };

        case REVIEW_STORE_RESET:
            return {};

        default:
            return state;
    }
};

export const reviewUpdateReducer = (state = { review: {} }, action) => {
    switch (action.type) {
        case REVIEW_UPDATE_REQUEST:
            return { loading: true, };

        case REVIEW_UPDATE_SUCCESS:
            return { loading: false, success: true, review: action.payload };

        case REVIEW_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case REVIEW_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const reviewShowReducer = (state = { review: {} }, action) => {
    switch (action.type) {
        case REVIEW_SHOW_REQUEST:
            return { ...state, loading: true };

        case REVIEW_SHOW_SUCCESS:
            return { loading: false, review: action.payload };

        case REVIEW_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case REVIEW_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const reviewDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case REVIEW_DELETE_REQUEST:
            return { loading: true };

        case REVIEW_DELETE_SUCCESS:
            return { loading: false, success: true };

        case REVIEW_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}
