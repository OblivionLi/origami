import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

export interface Product {
    id: number;
    name: string;
    slug: string;
    child_category_id?: number;
    product_code?: string;
    price?: number;
    discount?: number;
    description?: string;
    special_offer?: number | null;
    total_quantities?: number;
    total_reviews: number;
    rating: number;
    reviews: [];
    images: [];
    product_images: ProductImage[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    name: string;
    path: string;
}

interface ShowcaseData {
    latestProducts: Product[];
    latestDiscounts: Product[];
    mostCommented: Product[];
}

interface ProductState {
    product: Product[];
    loading: boolean;
    error: string | null;
    currentProduct: Product | null;
    success: boolean;
    showcase: ShowcaseData | null;
}

const initialState: ProductState = {
    product: [],
    loading: false,
    error: null,
    currentProduct: null,
    success: false,
    showcase: null,
}

export const fetchProducts = createAsyncThunk<
    Product[],
    void,
    { state: RootState, rejectValue: string }
>(
    'product/fetchProducts',
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

            const {data} = await axios.get<Product[]>('/api/products', config);

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

export const fetchProductBySlug = createAsyncThunk<
    Product,
    string,
    { state: RootState, rejectValue: string }
>(
    'product/fetchProductBySlug',
    async (slug, thunkAPI) => {
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

            const {data} = await axios.get(`/api/products/${slug}`, config);

            return data?.data;
        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createProduct = createAsyncThunk<
    Product,
    {
        name: string;
        child_category_id?: number;
        product_code?: string,
        price?: number,
        discount?: number,
        description?: string,
        special_offer?: number,
        total_quantities?: number
    }, { state: RootState, rejectValue: string }
>(
    'product/createProduct',
    async ({name, child_category_id, product_code, price, discount, description, special_offer, total_quantities}, thunkAPI) => {
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

            const {data} = await axios.post<Product>(`/api/products`, {
                name,
                child_category_id,
                product_code,
                price,
                discount,
                description,
                special_offer,
                total_quantities
            }, config);

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

export const updateProduct = createAsyncThunk<
    Product,
    {
        id: number;
        name: string;
        child_category_id?: number;
        product_code?: string,
        price?: number,
        discount?: number,
        description?: string,
        special_offer?: number,
        total_quantities?: number
    },
    { state: RootState, rejectValue: string }
>(
    'product/updateProduct',
    async ({id, name, child_category_id, product_code, price, discount, description, special_offer, total_quantities}, thunkAPI) => {
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

            const {data} = await axios.patch<Product>(`/api/products/${id}`, {
                name,
                child_category_id,
                product_code,
                price,
                discount,
                description,
                special_offer,
                total_quantities
            }, config);

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

export const deleteProduct = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'product/deleteProduct',
    async ({id}, thunkAPI) => {
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

            await axios.delete(`/api/products/${id}`, config);

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

export const createProductImage = createAsyncThunk<
    any,
    { productIdImage: number, formData: FormData },
    { state: RootState; rejectValue: string }
>(
    'products/createProductImage',
    async ({productIdImage, formData}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();
            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            const {data} = await axios.post(
                `/api/productImage/${productIdImage}`,
                formData,
                config
            );
            return data;

        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message)
        }
    }
);

export const replaceProductImage = createAsyncThunk<
    any,
    { productReplaceImageId: number, formData: FormData },
    { state: RootState, rejectValue: string }
>(
    'products/replaceProductImage',
    async ({productReplaceImageId, formData}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();
            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            const {data} = await axios.post(
                `/api/RproductImage/${productReplaceImageId}`,
                formData,
                config
            )
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteProductImage = createAsyncThunk<
    any,
    { id: number },
    { state: RootState; rejectValue: string }
>(
    'products/deleteProductImage',
    async ({id}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();
            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("user not logged in or token missing")
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`
                }
            };

            const {data} = await axios.delete(`/api/productImage/${id}`, config);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getShowcaseList = createAsyncThunk<
    ShowcaseData,
    void,
    { state: RootState; rejectValue: string }
>(
    'products/getShowcaseList',
    async (_, thunkAPI) => {
        try {
            const {data} = await axios.get('/api/showcase-products');
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const productSlice = createSlice({
    name: 'product',
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
            // Handle fetchProduct
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchProductBySlug
            .addCase(fetchProductBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductBySlug.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createProduct
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.product.push(action.payload); // Immer allows this!
                state.success = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                const index = state.product.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.product[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.product = state.product.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle getShowcaseList
            .addCase(getShowcaseList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getShowcaseList.fulfilled, (state, action: PayloadAction<ShowcaseData>) => {
                state.loading = false;
                state.showcase = action.payload;
            })
            .addCase(getShowcaseList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            });

        // add the remaining reducers
    },
});

export const {resetProductState, clearCurrentProduct} = productSlice.actions;
export default productSlice.reducer;
