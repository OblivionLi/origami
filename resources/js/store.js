import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
    userRegisterReducer,
    userLoginReducer,
    userForgotPasswordReducer,
    userResetPasswordReducer,
    userTokenResetPasswordReducer,
    userUpdateCredentialsReducer,
    // userListReducer,
    // userResetPassReducer,
    // getUserResetReducer,
    // userDeleteReducer,
    // userGetEditDetailsReducer,
    // userEditReducer,
    // userDetailsReducer,
    // userUpdateProfileReducer,
} from "./reducers/userReducers";

const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userForgotPassword: userForgotPasswordReducer,
    userResetPassword: userResetPasswordReducer,
    userTokenResetPassword: userTokenResetPasswordReducer,
    userUpdateCredentials: userUpdateCredentialsReducer,
    // userList: userListReducer,
    // userResetPass: userResetPassReducer,
    // getUserReset: getUserResetReducer,
    // userDelete: userDeleteReducer,
    // userGetEditDetails: userGetEditDetailsReducer,
    // userEdit: userEditReducer,
    // userDetails: userDetailsReducer,
    // userUpdateProfile: userUpdateProfileReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;