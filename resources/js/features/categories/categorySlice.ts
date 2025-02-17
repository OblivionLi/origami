import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

interface Product {
    id: number;
    name: string;
    child_category_id?: number;
    product_code?: string;
    price?: number;
    discount?: number;
    description?: string;
    special_offer?: number | null;
    qty?: number;
}

interface ProductState {
    product: Product[];
    loading: boolean;
    error: string | null;
    currentProduct: Product | null;
    success: boolean;
}

const initialState: ProductState = {
    product: [],
    loading: false,
    error: null,
    currentProduct: null,
    success: false,
}

export const fetchProductsByOrigamiCategory = createAsyncThunk<
    Product[],
    { page: number },
    { state: RootState, rejectValue: string }
>(
    'category/fetchProducts',
    async ({page}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                }
            };

            const {data} = await axios.get<Product[]>('/api/products/origami', config);

            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchProductsByAccessoriesCategory = createAsyncThunk<
    Product[],
    { page: number },
    { state: RootState, rejectValue: string }
>(
    'category/fetchProducts',
    async ({page}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                }
            };

            const {data} = await axios.get<Product[]>('/api/products/accessories', config);

            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchProductsBySpecialOffers = createAsyncThunk<
    Product[],
    void,
    { state: RootState, rejectValue: string }
>(
    'category/fetchProducts',
    async (_, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                }
            };

            const {data} = await axios.get<Product[]>('/api/products/special-offers', config);

            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const categoryProductSlice = createSlice({
    name: 'categoryProduct',
    initialState,
    reducers: {
        resetProductState: (state) => {
            return initialState;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchProductsByOrigamiCategory
            .addCase(fetchProductsByOrigamiCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByOrigamiCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductsByOrigamiCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchProductsByAccessoriesCategory
            .addCase(fetchProductsByAccessoriesCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByAccessoriesCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductsByAccessoriesCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchProductsBySpecialOffers
            .addCase(fetchProductsBySpecialOffers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsBySpecialOffers.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductsBySpecialOffers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })
    },
});

export const {resetProductState, clearCurrentProduct} = categoryProductSlice.actions;
export default categoryProductSlice.reducer;
