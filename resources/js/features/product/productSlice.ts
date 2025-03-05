import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";
import {ParentCategory} from "@/features/categories/parentCategorySlice";
import {ChildCategory} from "@/features/categories/categorySlice";
import {User} from "@/features/user/userSlice";

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
    quantity: number;
}

export interface AdminProduct {
    id: number;
    name: string;
    slug: string;
    user_id: number;
    description: string;
    price: number;
    discount: number;
    special_offer: number;
    product_code: string;
    rating: number;
    reviews_count: number;
    total_quantities: number;
    created_at: string;
    updated_at: string;

    parentCategory?: ParentCategory;
    childCategory?: ChildCategory;
    user?: User;
    images?: ProductImage[];
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
    adminProductsList: AdminProduct[];
    loading: boolean;
    error: string | null;
    currentProduct: Product | null;
    addProductSuccess: boolean;
    editProductSuccess: boolean;
    addProductImageSuccess: boolean;
    editProductImageSuccess: boolean;
    success: boolean;
    showcase: ShowcaseData | null;
}

const initialState: ProductState = {
    product: [],
    adminProductsList: [],
    loading: false,
    error: null,
    currentProduct: null,
    addProductSuccess: false,
    editProductSuccess: false,
    addProductImageSuccess: false,
    editProductImageSuccess: false,
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

export const fetchAdminProductsList = createAsyncThunk<
    AdminProduct[],
    void,
    { state: RootState, rejectValue: string }
>(
    'product/fetchAdminProductsList',
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

            const {data} = await axios.get('/api/admin/products', config);
            return data.data;
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
    { formData: FormData },
    { state: RootState, rejectValue: string }
>(
    'product/createProduct',
    async ({formData}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`
                }
            };

            const {data} = await axios.post<Product>(`/api/admin/products`, formData, config);

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
        id: number | undefined;
        name: string | undefined;
        child_category_id: number | undefined;
        product_code: string | undefined;
        price: number | undefined;
        discount: number | undefined;
        description: string | undefined;
        special_offer: number | undefined;
        total_quantities: number | undefined;
    },
    { state: RootState, rejectValue: string }
>(
    'product/updateProduct',
    async ({
               id,
               name,
               child_category_id,
               product_code,
               price,
               discount,
               description,
               special_offer,
               total_quantities
           }, thunkAPI) => {
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

            const {data} = await axios.patch<Product>(`/api/admin/products/${id}`, {
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

            await axios.delete(`/api/admin/products/${id}`, config);

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
    { productId: number, formData: FormData },
    { state: RootState; rejectValue: string }
>(
    'products/createProductImage',
    async ({productId, formData}, thunkAPI) => {
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
                `/api/admin/products/${productId}/image`,
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
    { imageId: number | undefined, formData: FormData },
    { state: RootState, rejectValue: string }
>(
    'products/replaceProductImage',
    async ({imageId, formData}, thunkAPI) => {
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
                `/api/admin/products/image/${imageId}/replace`,
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

            const {data} = await axios.delete(`/api/admin/products/image/${id}`, config);
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
        },
        resetAddProductSuccess: (state) => {
            state.addProductSuccess = false;
        },
        resetEditProductSuccess: (state) => {
            state.editProductSuccess = false;
        },
        resetAddProductImageSuccess: (state) => {
            state.addProductImageSuccess = false
        },

        resetEditProductImageSuccess: (state) => {
            state.editProductImageSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle createProductImage
            .addCase(createProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.addProductImageSuccess = false;
            })
            .addCase(createProductImage.fulfilled, (state, action) => {
                state.loading = false;
                state.addProductImageSuccess = true;
            })
            .addCase(createProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.addProductImageSuccess = false;
            })

            // Handle replaceProductImage
            .addCase(replaceProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editProductImageSuccess = false;
            })
            .addCase(replaceProductImage.fulfilled, (state, action) => {
                state.loading = false;
                state.editProductImageSuccess = true;
            })
            .addCase(replaceProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.editProductImageSuccess = false;
            })

            // Handle deleteProductImage
            .addCase(deleteProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductImage.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming your API returns { productId, imageId } after deletion.
                const {productId, imageId} = action.payload; // Destructure

                // Find the product.
                const productIndex = state.adminProductsList.findIndex(p => p.id === productId);
                if (productIndex !== -1) {
                    // Filter out the deleted image.
                    state.adminProductsList[productIndex].images = state.adminProductsList[productIndex].images?.filter(img => img.id !== imageId);
                }
            })
            .addCase(deleteProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })

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

            // Handle fetchAdminProductsList
            .addCase(fetchAdminProductsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProductsList.fulfilled, (state, action: PayloadAction<AdminProduct[]>) => {
                state.loading = false;
                state.adminProductsList = action.payload;
            })
            .addCase(fetchAdminProductsList.rejected, (state, action) => {
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
                state.addProductSuccess = false;
            })
            .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.product.push(action.payload);
                state.addProductSuccess = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.addProductSuccess = false;
            })

            // Handle updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editProductSuccess = false;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                const index = state.product.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.product[index] = action.payload;
                }
                state.editProductSuccess = true;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.editProductSuccess = false;
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

export const {
    resetProductState,
    clearCurrentProduct,
    resetAddProductSuccess,
    resetEditProductSuccess,
    resetEditProductImageSuccess,
    resetAddProductImageSuccess
} = productSlice.actions;
export default productSlice.reducer;
