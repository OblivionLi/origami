import {
    ROLE_LIST_REQUEST,
    ROLE_LIST_SUCCESS,
    ROLE_LIST_FAIL,
    ROLE_LIST_RESET,
    ROLE_UPDATE_RESET,
    ROLE_UPDATE_FAIL,
    ROLE_UPDATE_SUCCESS,
    ROLE_UPDATE_REQUEST,
    ROLE_SHOW_RESET,
    ROLE_SHOW_FAIL,
    ROLE_SHOW_SUCCESS,
    ROLE_SHOW_REQUEST,
    ROLE_DELETE_REQUEST,
    ROLE_DELETE_SUCCESS,
    ROLE_DELETE_FAIL,
    ROLE_STORE_RESET,
    ROLE_STORE_FAIL,
    ROLE_STORE_SUCCESS,
    ROLE_STORE_REQUEST,
} from "./../constants/roleConstants";

export const roleListReducer = (state = { roles: {} }, action) => {
    switch (action.type) {
        case ROLE_LIST_REQUEST:
            return { loading: true, roles: [] };

        case ROLE_LIST_SUCCESS:
            return { loading: false, roles: action.payload };

        case ROLE_LIST_FAIL:
            return { loading: false, error: action.payload };

        case ROLE_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const roleStoreReducer = (state = {}, action) => {
    switch (action.type) {
        case ROLE_STORE_REQUEST:
            return { loading: true };

        case ROLE_STORE_SUCCESS:
            return { loading: false, success: true, role: action.payload };

        case ROLE_STORE_FAIL:
            return { loading: false, error: action.payload };

        case ROLE_STORE_RESET:
            return {};

        default:
            return state;
    }
};

export const roleUpdateReducer = (state = { role: {} }, action) => {
    switch (action.type) {
        case ROLE_UPDATE_REQUEST:
            return { loading: true, };

        case ROLE_UPDATE_SUCCESS:
            return { loading: false, success: true, role: action.payload };

        case ROLE_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case ROLE_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const roleShowReducer = (state = { role: {} }, action) => {
    switch (action.type) {
        case ROLE_SHOW_REQUEST:
            return { ...state, loading: true };

        case ROLE_SHOW_SUCCESS:
            return { loading: false, role: action.payload };

        case ROLE_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case ROLE_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const roleDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ROLE_DELETE_REQUEST:
            return { loading: true };

        case ROLE_DELETE_SUCCESS:
            return { loading: false, success: true };

        case ROLE_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}
