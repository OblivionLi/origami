import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
    cartCompleted: boolean;
    shippingCompleted: boolean;
}

const loadState = (): CheckoutState => {
    try {
        const savedState = localStorage.getItem('checkoutState');
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (err) {
        console.error('Error loading checkout state:', err);
    }

    return {
        cartCompleted: false,
        shippingCompleted: false,
    };
};

const initialState: CheckoutState = loadState();

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCartCompleted(state, action: PayloadAction<boolean>) {
            state.cartCompleted = action.payload;
            localStorage.setItem('checkoutState', JSON.stringify(state));
        },
        setShippingCompleted(state, action: PayloadAction<boolean>) {
            state.shippingCompleted = action.payload;
            localStorage.setItem('checkoutState', JSON.stringify(state));
        },
        resetCheckout(state) {
            state.cartCompleted = false;
            state.shippingCompleted = false;
            localStorage.removeItem('checkoutState');
        }
    },
});

export const { setCartCompleted, setShippingCompleted, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
