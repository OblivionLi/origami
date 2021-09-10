import {
    CHILD_CATEGORY_LIST_REQUEST,
    CHILD_CATEGORY_LIST_SUCCESS,
    CHILD_CATEGORY_LIST_FAIL,
    CHILD_CATEGORY_LIST_RESET,
    CHILD_CATEGORY_UPDATE_RESET,
    CHILD_CATEGORY_UPDATE_FAIL,
    CHILD_CATEGORY_UPDATE_SUCCESS,
    CHILD_CATEGORY_UPDATE_REQUEST,
    CHILD_CATEGORY_SHOW_RESET,
    CHILD_CATEGORY_SHOW_FAIL,
    CHILD_CATEGORY_SHOW_SUCCESS,
    CHILD_CATEGORY_SHOW_REQUEST,
    CHILD_CATEGORY_DELETE_REQUEST,
    CHILD_CATEGORY_DELETE_SUCCESS,
    CHILD_CATEGORY_DELETE_FAIL,
    CHILD_CATEGORY_STORE_RESET,
    CHILD_CATEGORY_STORE_FAIL,
    CHILD_CATEGORY_STORE_SUCCESS,
    CHILD_CATEGORY_STORE_REQUEST,
} from "./../constants/childCategoryConstants";

export const childCatListReducer = (state = { childCats: {} }, action) => {
    switch (action.type) {
        case CHILD_CATEGORY_LIST_REQUEST:
            return { loading: true, childCats: [] };

        case CHILD_CATEGORY_LIST_SUCCESS:
            return { loading: false, childCats: action.payload };

        case CHILD_CATEGORY_LIST_FAIL:
            return { loading: false, error: action.payload };

        case CHILD_CATEGORY_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const childCatStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case CHILD_CATEGORY_STORE_REQUEST:
            return { loading: true };

        case CHILD_CATEGORY_STORE_SUCCESS:
            return { loading: false, success: true, childCat: action.payload };

        case CHILD_CATEGORY_STORE_FAIL:
            return { loading: false, error: action.payload };

        case CHILD_CATEGORY_STORE_RESET:
            return {};

        default:
            return state;
    }
};

export const childCatUpdateReducer = (state = { childCat: {} }, action) => {
    switch (action.type) {
        case CHILD_CATEGORY_UPDATE_REQUEST:
            return { loading: true, };

        case CHILD_CATEGORY_UPDATE_SUCCESS:
            return { loading: false, success: true, childCat: action.payload };

        case CHILD_CATEGORY_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case CHILD_CATEGORY_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const childCatShowReducer = (state = { childCat: {} }, action) => {
    switch (action.type) {
        case CHILD_CATEGORY_SHOW_REQUEST:
            return { ...state, loading: true };

        case CHILD_CATEGORY_SHOW_SUCCESS:
            return { loading: false, childCat: action.payload };

        case CHILD_CATEGORY_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case CHILD_CATEGORY_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const childCatDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case CHILD_CATEGORY_DELETE_REQUEST:
            return { loading: true };

        case CHILD_CATEGORY_DELETE_SUCCESS:
            return { loading: false, success: true };

        case CHILD_CATEGORY_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}
