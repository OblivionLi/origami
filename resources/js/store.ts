import {configureStore} from "@reduxjs/toolkit";
import addressReducer from '@/features/address/addressSlice';
import userReducer from '@/features/user/userSlice';
import cartReducer from '@/features/cart/cartSlice';
import orderReducer from '@/features/order/orderSlice';
import productReducer from '@/features/product/productSlice';
import permissionReducer from '@/features/permission/permissionSlice';
import roleReducer from '@/features/role/roleSlice';
import reviewReducer from '@/features/review/reviewSlice';
import parentCategoryReducer from '@/features/categories/parentCategorySlice';
import childCategoryReducer from '@/features/categories/childCategorySlice';
import categoryProductReducer from '@/features/categories/categorySlice';
import checkoutReducer from '@/features/checkout/checkoutSlice';

export const store = configureStore({
    reducer: {
        address: addressReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
        product: productReducer,
        permission: permissionReducer,
        role: roleReducer,
        review: reviewReducer,
        parentCategory: parentCategoryReducer,
        childCategory: childCategoryReducer,
        categoryProduct: categoryProductReducer,
        checkout: checkoutReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Example of adding extra middleware
    devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
