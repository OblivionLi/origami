import {
    PARENT_CATEGORY_LIST_REQUEST,
    PARENT_CATEGORY_LIST_SUCCESS,
    PARENT_CATEGORY_LIST_FAIL,
    PARENT_CATEGORY_LIST_RESET,
    PARENT_CATEGORY_UPDATE_RESET,
    PARENT_CATEGORY_UPDATE_FAIL,
    PARENT_CATEGORY_UPDATE_SUCCESS,
    PARENT_CATEGORY_UPDATE_REQUEST,
    PARENT_CATEGORY_SHOW_RESET,
    PARENT_CATEGORY_SHOW_FAIL,
    PARENT_CATEGORY_SHOW_SUCCESS,
    PARENT_CATEGORY_SHOW_REQUEST,
    PARENT_CATEGORY_DELETE_REQUEST,
    PARENT_CATEGORY_DELETE_SUCCESS,
    PARENT_CATEGORY_DELETE_FAIL,
    PARENT_CATEGORY_STORE_RESET,
    PARENT_CATEGORY_STORE_FAIL,
    PARENT_CATEGORY_STORE_SUCCESS,
    PARENT_CATEGORY_STORE_REQUEST,
} from "./../constants/parentCategoryConstants";

export const parentCatListReducer = (state = { parentCats: {} }, action) => {
    switch (action.type) {
        case PARENT_CATEGORY_LIST_REQUEST:
            return { loading: true, parentCats: [] };

        case PARENT_CATEGORY_LIST_SUCCESS:
            return { loading: false, parentCats: action.payload };

        case PARENT_CATEGORY_LIST_FAIL:
            return { loading: false, error: action.payload };

        case PARENT_CATEGORY_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const parentCatStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case PARENT_CATEGORY_STORE_REQUEST:
            return { loading: true };

        case PARENT_CATEGORY_STORE_SUCCESS:
            return { loading: false, success: true, parentCat: action.payload };

        case PARENT_CATEGORY_STORE_FAIL:
            return { loading: false, error: action.payload };

        case PARENT_CATEGORY_STORE_RESET:
            return {};

        default:
            return state;
    }
};

export const parentCatUpdateReducer = (state = { parentCat: {} }, action) => {
    switch (action.type) {
        case PARENT_CATEGORY_UPDATE_REQUEST:
            return { loading: true, };

        case PARENT_CATEGORY_UPDATE_SUCCESS:
            return { loading: false, success: true, parentCat: action.payload };

        case PARENT_CATEGORY_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case PARENT_CATEGORY_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const parentCatShowReducer = (state = { parentCat: {} }, action) => {
    switch (action.type) {
        case PARENT_CATEGORY_SHOW_REQUEST:
            return { ...state, loading: true };

        case PARENT_CATEGORY_SHOW_SUCCESS:
            return { loading: false, parentCat: action.payload };

        case PARENT_CATEGORY_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case PARENT_CATEGORY_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const parentCatDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PARENT_CATEGORY_DELETE_REQUEST:
            return { loading: true };

        case PARENT_CATEGORY_DELETE_SUCCESS:
            return { loading: false, success: true };

        case PARENT_CATEGORY_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}
