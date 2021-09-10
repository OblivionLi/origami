import {
    USER_REGISTER_REQUEST,
    USER_REGISTER_FAIL,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_RESET,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_FORGOT_PASSWORD_FAIL,
    USER_FORGOT_PASSWORD_SUCCESS,
    USER_FORGOT_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_FAIL,
    USER_RESET_PASSWORD_SUCCESS,
    USER_RESET_PASSWORD_REQUEST,
    USER_TOKEN_RESET_PASSWORD_FAIL,
    USER_TOKEN_RESET_PASSWORD_SUCCESS,
    USER_TOKEN_RESET_PASSWORD_REQUEST,
    USER_UPDATE_CREDENTIALS_RESET,
    USER_UPDATE_CREDENTIALS_FAIL,
    USER_UPDATE_CREDENTIALS_SUCCESS,
    USER_UPDATE_CREDENTIALS_REQUEST,
    USER_LIST_RESET,
    USER_LIST_FAIL,
    USER_LIST_SUCCESS,
    USER_LIST_REQUEST,
    USER_UPDATE_RESET,
    USER_UPDATE_FAIL,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_REQUEST,
    USER_SHOW_RESET,
    USER_SHOW_FAIL,
    USER_SHOW_SUCCESS,
    USER_SHOW_REQUEST,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL
} from "./../constants/userConstants";

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };

        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };

        case USER_REGISTER_RESET:
            return {};

        default:
            return state;
    }
};

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };

        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };

        case USER_LOGOUT:
            return {};

        default:
            return state;
    }
};

export const userForgotPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FORGOT_PASSWORD_REQUEST:
            return { loading: true };

        case USER_FORGOT_PASSWORD_SUCCESS:
            return { loading: false, success: true };

        case USER_FORGOT_PASSWORD_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userResetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_RESET_PASSWORD_REQUEST:
            return { loading: true };

        case USER_RESET_PASSWORD_SUCCESS:
            return { loading: false, success: true };

        case USER_RESET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userTokenResetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_TOKEN_RESET_PASSWORD_REQUEST:
            return { loading: true };

        case USER_TOKEN_RESET_PASSWORD_SUCCESS:
            return { loading: false, success: true, userReset: action.payload };

        case USER_TOKEN_RESET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};

export const userUpdateCredentialsReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_CREDENTIALS_REQUEST:
            return { loading: true };

        case USER_UPDATE_CREDENTIALS_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case USER_UPDATE_CREDENTIALS_FAIL:
            return { loading: false, error: action.payload };

        case USER_UPDATE_CREDENTIALS_RESET:
            return {};

        default:
            return state;
    }
};

export const userListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true, users: [] };

        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload };

        case USER_LIST_FAIL:
            return { loading: false, error: action.payload };

        case USER_LIST_RESET:
            return {};

        default:
            return state;
    }
}

export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true, };

        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true, user: action.payload };

        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload };

        case USER_UPDATE_RESET:
            return {};

        default:
            return state;
    }
}

export const userShowReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_SHOW_REQUEST:
            return { ...state, loading: true };

        case USER_SHOW_SUCCESS:
            return { loading: false, user: action.payload };

        case USER_SHOW_FAIL:
            return { loading: false, error: action.payload };

        case USER_SHOW_RESET:
            return {};

        default:
            return state;
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true };

        case USER_DELETE_SUCCESS:
            return { loading: false, success: true };

        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}
