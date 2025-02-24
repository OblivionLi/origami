import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
    cartCompleted: boolean;
    shippingCompleted: boolean;
}

const initialState: CheckoutState = {
    cartCompleted: false,
    shippingCompleted: false,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCartCompleted(state, action: PayloadAction<boolean>) {
            state.cartCompleted = action.payload;
        },
        setShippingCompleted(state, action: PayloadAction<boolean>) {
            state.shippingCompleted = action.payload;
        },
        resetCheckout(state) {
            state.cartCompleted = false;
            state.shippingCompleted = false;
        }
    },
});

export const { setCartCompleted, setShippingCompleted, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
