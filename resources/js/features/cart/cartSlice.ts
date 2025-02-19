import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

export interface Cart {
    cartItems: CartItem[];
    itemsPrice: string;
    itemsPriceDiscount: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

export interface CartItem {
    product: number;
    name: string;
    slug: string;
    product_code: string;
    special_offer: string;
    discount: number | null;
    price: number;
    description: string;
    total_quantities: number;
    qty: number;
    image?: string;
}

interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: CartState = {
    cartItems: [],
    loading: false,
    error: null,
    success: false,
}

export const addToCart = createAsyncThunk<
    CartItem[],
    { id: number; qty: number },
    { state: RootState; rejectValue: string }
>(
    'cart/addToCart',
    async ({ id, qty }, thunkAPI) => {
        try {
            const { user: { userInfo }, cart: { cartItems } } = thunkAPI.getState(); // Get current cartItems

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const { data } = await axios.get(`/api/products/${id}`, config);
            const newItem: CartItem = {
                product: data.data.id,
                name: data.data.name,
                slug: data.data.slug,
                product_code: data.data.product_code,
                special_offer: data.data.special_offer,
                discount: data.data.discount,
                price: data.data.price,
                description: data.data.description,
                total_quantities: data.data.total_quantities,
                qty,
            };

            // --- Logic moved to the thunk ---
            const existItem = cartItems.find(item => item.product === newItem.product);
            let updatedCartItems: CartItem[];

            if (existItem) {
                updatedCartItems = cartItems.map((item) =>
                    item.product === existItem.product
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            } else {
                updatedCartItems = [...cartItems, newItem];
            }

            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
            return updatedCartItems;

        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeFromCart = createAsyncThunk<
    number,
    number,
    {state: RootState; rejectValue: string}
>(
    'cart/removeFromCart',
    async(id, thunkAPI) => {
        try {
            const { cart: {cartItems} } = thunkAPI.getState()

            const updatedCartItems = cartItems.filter(item => item.product !== id);
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

            return id;
        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartState: () => initialState,
        clearCurrentCart: (state) => {
            state.cartItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.cartItems = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "An unknown error occurred";
                state.success = false;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true; //might not need a loader here
                state.error = null;
                state.success = false;
            })
            .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.success = true;
                state.cartItems = state.cartItems.filter(item => item.product !== action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred';
                state.success = false;
            });
    }
})

export const {resetCartState, clearCurrentCart} = cartSlice.actions;
export default cartSlice.reducer;
