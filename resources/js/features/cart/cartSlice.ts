import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/store";
import {Product} from "@/features/product/productSlice";

export interface Cart {
    cartItems: CartItem[];
    itemsPrice: string;
    itemsPriceDiscount: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

interface UpdateQuantityPayload {
    productId: number;
    qty: number;
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
    { product: Product, qty: number },
    { state: RootState; rejectValue: string }
>(
    'cart/addToCart',
    async ({product, qty}, thunkAPI) => {
        try {
            const {user: {userInfo}, cart: {cartItems}} = thunkAPI.getState(); // Get current cartItems

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in.");
            }

            const newItem: CartItem = {
                product: product.id,
                name: product.name,
                slug: product.slug,
                product_code: product.product_code,
                special_offer: product.special_offer,
                discount: product.discount,
                price: product.price,
                description: product.description,
                total_quantities: product.total_quantities,
                qty,
            };
            return [newItem];
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
    { state: RootState; rejectValue: string }
>(
    'cart/removeFromCart',
    async (id, thunkAPI) => {
        try {
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

export const updateQuantity = createAsyncThunk<
    UpdateQuantityPayload,
    UpdateQuantityPayload,
    {state: RootState; rejectValue: string}
>(
    'cart/updateQuantity',
    async ({productId, qty}, thunkAPI) => {
        try{
            return {productId, qty}
        } catch (error: any){
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartState: () => initialState,
        clearCurrentCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
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
                const newItems = action.payload;

                newItems.forEach(newItem => {
                    const existingItem = state.cartItems.find(item => item.product === newItem.product);
                    if (existingItem) {
                        existingItem.qty += newItem.qty;
                    } else {
                        state.cartItems.push(newItem);
                    }
                });
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
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
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An unknown error occurred';
                state.success = false;
            })
            .addCase(updateQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const {productId, qty} = action.payload;
                const itemIndex = state.cartItems.findIndex(item => item.product === productId);

                if (itemIndex !== -1) {
                    state.cartItems[itemIndex].qty = qty;
                    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
                }
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred.';
            });
    }
})

export const {resetCartState, clearCurrentCart} = cartSlice.actions;
export default cartSlice.reducer;
