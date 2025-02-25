import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";
import {ProductImage} from "@/features/product/productSlice";

export interface Product {
    id: number;
    name: string;
    parent_category_id?: number;
    child_category_id?: number;
    product_code?: string;
    price?: number;
    discount?: number;
    description?: string;
    special_offer?: number | null;
    qty?: number;
    user_id?: number;
    slug: string;
    product_images: ProductImage[];
    rating: string;
    total_reviews: number;
}

export interface ChildCategory {
    id: number;
    name: string;
    slug: string;
    quantity: number;
    parent_category_id: number;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    path: string;
    per_page: number;
    total: number;
}

export interface PaginatedProducts {
    products: {
        data: Product[];
        links: PaginationLinks;
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
        first_page_url?: string;
        last_page_url?: string;
        next_page_url?: string | null;
        prev_page_url?: string | null;
    };
    childCategories: ChildCategory[];
}

interface ProductState {
    products: Product[];
    childCategories: ChildCategory[];
    links: PaginationLinks | null;
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
    currentProduct: Product | null;
    success: boolean;
}

const initialState: ProductState = {
    products: [],
    childCategories: [],
    links: null,
    meta: null,
    loading: false,
    error: null,
    currentProduct: null,
    success: false,
}

export const fetchProductsByOrigamiCategory = createAsyncThunk<
    PaginatedProducts,
    { page: number, childCategoryId: number | null},
    { state: RootState, rejectValue: string }
>(
    'category/fetchProductsByOrigamiCategory',
    async ({page, childCategoryId}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
                params: {
                    page: page
                }
            };

            if (!childCategoryId) {
                childCategoryId = -1;
            }

            const {data} = await axios.get<PaginatedProducts>(`/api/products/origami/${childCategoryId}`, config);

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
    PaginatedProducts,
    { page: number, childCategoryId: number | null},
    { state: RootState, rejectValue: string }
>(
    'category/fetchProductsByAccessoriesCategory',
    async ({page, childCategoryId}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
                params: {
                    page: page
                }
            };

            if (!childCategoryId) {
                childCategoryId = -1;
            }

            const {data} = await axios.get<PaginatedProducts>(`/api/products/accessories/${childCategoryId}`, config);
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
    PaginatedProducts,
    {page: number},
    { state: RootState, rejectValue: string }
>(
    'category/fetchProductsBySpecialOffers',
    async ({page}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
                params: {
                    page: page
                }
            };

            const {data} = await axios.get<PaginatedProducts>(`/api/products/special-offers`, config);
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
            .addMatcher(
                (action) => [
                    fetchProductsByOrigamiCategory.pending.type,
                    fetchProductsByAccessoriesCategory.pending.type,
                    fetchProductsBySpecialOffers.pending.type
                ].includes(action.type),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => [
                    fetchProductsByOrigamiCategory.rejected.type,
                    fetchProductsByAccessoriesCategory.rejected.type,
                    fetchProductsBySpecialOffers.rejected.type
                ].includes(action.type),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload ? action.payload : "Unknown error";
                }
            )

            // Handle fulfilled actions
            .addMatcher(
                (action) => [
                    fetchProductsByOrigamiCategory.fulfilled.type,
                    fetchProductsByAccessoriesCategory.fulfilled.type,
                    fetchProductsBySpecialOffers.fulfilled.type
                ].includes(action.type),
                (state, action: PayloadAction<PaginatedProducts>) => {
                    state.loading = false;
                    state.products = action.payload.products.data;
                    state.childCategories = action.payload.childCategories;
                    state.links = action.payload.products.links;
                    state.meta = {
                        current_page: action.payload.products.current_page,
                        last_page: action.payload.products.last_page,
                        path: action.payload.products.path,
                        per_page: action.payload.products.per_page,
                        total: action.payload.products.total,
                    };
                    state.success = true;
                }
            );
    },
});

export const {resetProductState, clearCurrentProduct} = categoryProductSlice.actions;
export default categoryProductSlice.reducer;
