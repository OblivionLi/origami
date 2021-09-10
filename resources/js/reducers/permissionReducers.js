import {
    PERMISSION_LIST_REQUEST,
    PERMISSION_LIST_SUCCESS,
    PERMISSION_LIST_FAIL,
    PERMISSION_LIST_RESET,
    PERMISSION_UPDATE_RESET,
    PERMISSION_UPDATE_FAIL,
    PERMISSION_UPDATE_SUCCESS,
    PERMISSION_UPDATE_REQUEST,
    PERMISSION_SHOW_RESET,
    PERMISSION_SHOW_FAIL,
    PERMISSION_SHOW_SUCCESS,
    PERMISSION_SHOW_REQUEST,
    PERMISSION_DELETE_REQUEST,
    PERMISSION_DELETE_SUCCESS,
    PERMISSION_DELETE_FAIL,
    PERMISSION_STORE_RESET,
    PERMISSION_STORE_FAIL,
    PERMISSION_STORE_SUCCESS,
    PERMISSION_STORE_REQUEST,
} from "./../constants/permissionConstants";

export const permissionListReducer = (state = { permissions: {} }, action) => {
    switch (action.type) {
        case PERMISSION_LIST_REQUEST:
            return { loading: true, permissions: [] };

        case PERMISSION_LIST_SUCCESS:
            return { loading: false, permissions: action.payload };

        case PERMISSION_LIST_FAIL:
            return { loading: false, error: action.payload };

        case PERMISSION_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const permissionStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case PERMISSION_STORE_REQUEST:
            return { loading: true };

        case PERMISSION_STORE_SUCCESS:
            return { loading: false, success: true, permission: action.payload };

        case PERMISSION_STORE_FAIL:
            return { loading: false, error: action.payload };

        case PERMISSION_STORE_RESET:
            return {};

        default:
            return state;
    }
};

export const permissionUpdateReducer = (state = { permission: {} }, action) => {
    switch (action.type) {
        case PERMISSION_UPDATE_REQUEST:
            return { loading: true, };

        case PERMISSION_UPDATE_SUCCESS:
            return { loading: false, success: true, permission: action.payload };

        case PERMISSION_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case PERMISSION_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const permissionShowReducer = (state = { permission: {} }, action) => {
    switch (action.type) {
        case PERMISSION_SHOW_REQUEST:
            return { ...state, loading: true };

        case PERMISSION_SHOW_SUCCESS:
            return { loading: false, permission: action.payload };

        case PERMISSION_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case PERMISSION_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const permissionDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PERMISSION_DELETE_REQUEST:
            return { loading: true };

        case PERMISSION_DELETE_SUCCESS:
            return { loading: false, success: true };

        case PERMISSION_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}
