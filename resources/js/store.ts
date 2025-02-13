import {configureStore} from "@reduxjs/toolkit";
import addressReducer from '@/features/address/addressSlice';
import userReducer from '@/features/user/userSlice';
import cartReducer from '@/features/cart/cartSlice';

export const store = configureStore({
    reducer: {
        address: addressReducer,
        user: userReducer,
        cart: cartReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Example of adding extra middleware
    devTools: process.env.NODE_END !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
