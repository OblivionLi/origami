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
    userListReducer,
    userUpdateReducer,
    userShowReducer,
    userDeleteReducer
} from "./reducers/userReducers";

import {
    roleListReducer,
    roleUpdateReducer,
    roleShowReducer,
    roleDeleteReducer,
    roleStoreReducer
} from "./reducers/roleReducers";

import {
    permissionListReducer,
    permissionUpdateReducer,
    permissionShowReducer,
    permissionDeleteReducer,
    permissionStoreReducer
} from "./reducers/permissionReducers";

import {
    parentCatListReducer,
    parentCatUpdateReducer,
    parentCatShowReducer,
    parentCatDeleteReducer,
    parentCatStoreReducer
} from "./reducers/parentCategoryReducers";

import {
    childCatListReducer,
    childCatUpdateReducer,
    childCatShowReducer,
    childCatDeleteReducer,
    childCatStoreReducer
} from "./reducers/childCategoryReducers";

import {
    productListReducer,
    productUpdateReducer,
    productShowReducer,
    productDeleteReducer,
    productStoreReducer,
    productImageCreateReducer,
    productImageDeleteReducer,
    productImageReplaceReducer,
    productShowcaseReducer
} from "./reducers/productReducers";

import {
    reviewListReducer,
    reviewUpdateReducer,
    reviewShowReducer,
    reviewDeleteReducer,
    reviewStoreReducer,
    reviewListPagReducer
} from "./reducers/reviewReducers";

import {
    cartReducer
} from "./reducers/cartReducers";

import {
    addressListReducer,
    addressCreateReducer,
    addressShowReducer,
    addressUpdateReducer,
    addressDeleteReducer,
} from "./reducers/addressReducers";

import {
    orderListReducer,
    orderCreateReducer,
    orderShowReducer,
    orderPayReducer,
    orderDeliverReducer,
    orderUserListReducer,
    orderPDFReducer,
    orderDeleteReducer,
} from "./reducers/orderReducers";

import {
    accessoryListReducer,
    origamiListReducer,
    specialOfferListReducer,
} from "./reducers/categoryReducers";

const reducer = combineReducers({
    // user reducers
    userRegister:               userRegisterReducer,
    userLogin:                  userLoginReducer,
    userForgotPassword:         userForgotPasswordReducer,
    userResetPassword:          userResetPasswordReducer,
    userTokenResetPassword:     userTokenResetPasswordReducer,
    userUpdateCredentials:      userUpdateCredentialsReducer,
    userList:                   userListReducer,
    userUpdate:                 userUpdateReducer,
    userShow:                   userShowReducer,
    userDelete:                 userDeleteReducer,

    // role reducers
    roleList:                   roleListReducer,
    roleStore:                  roleStoreReducer,
    roleUpdate:                 roleUpdateReducer,
    roleShow:                   roleShowReducer,
    roleDelete:                 roleDeleteReducer,

    // permission reducers
    permissionList:             permissionListReducer,
    permissionStore:            permissionStoreReducer,
    permissionUpdate:           permissionUpdateReducer,
    permissionShow:             permissionShowReducer,
    permissionDelete:           permissionDeleteReducer,

    // parent category reducers
    parentCatList:              parentCatListReducer,
    parentCatStore:             parentCatStoreReducer,
    parentCatUpdate:            parentCatUpdateReducer,
    parentCatShow:              parentCatShowReducer,
    parentCatDelete:            parentCatDeleteReducer,

    // child category reducers
    childCatList:               childCatListReducer,
    childCatStore:              childCatStoreReducer,
    childCatUpdate:             childCatUpdateReducer,
    childCatShow:               childCatShowReducer,
    childCatDelete:             childCatDeleteReducer,

    // product reducers
    productList:                productListReducer,
    productStore:               productStoreReducer,
    productUpdate:              productUpdateReducer,
    productShow:                productShowReducer,
    productDelete:              productDeleteReducer,
    productShowcase:            productShowcaseReducer,

    // product image reducers
    productImageCreate:         productImageCreateReducer,
    productImageDelete:         productImageDeleteReducer,
    productImageReplace:        productImageReplaceReducer,

    // review reducers
    reviewList:                 reviewListReducer,
    reviewStore:                reviewStoreReducer,
    reviewUpdate:               reviewUpdateReducer,
    reviewShow:                 reviewShowReducer,
    reviewDelete:               reviewDeleteReducer,
    reviewListPag:              reviewListPagReducer,

    // cart reducers
    cart:                       cartReducer,

    // address reducers
    addressList:                addressListReducer,
    addressCreate:              addressCreateReducer,
    addressShow:                addressShowReducer,
    addressUpdate:              addressUpdateReducer,
    addressDelete:              addressDeleteReducer,

    // order reducers
    orderList:                  orderListReducer,
    orderCreate:                orderCreateReducer,
    orderShow:                  orderShowReducer,
    orderPay:                   orderPayReducer,
    orderDeliver:               orderDeliverReducer,
    orderUserList:              orderUserListReducer,
    orderPDF:                   orderPDFReducer,
    orderDelete:                orderDeleteReducer,

    // category reducers
    accessoryList:              accessoryListReducer,
    origamiList:                origamiListReducer,
    specialOfferList:           specialOfferListReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
    },

    cart: {
        cartItems: cartItemsFromStorage
    }
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;