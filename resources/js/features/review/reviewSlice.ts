import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

export interface Review {
    id: number;
    user_name: string;
    rating: string;
    user_comment: string;
    created_at: string;
    updated_at: string;
    admin_name: string | null;
    admin_comment: string | null;
    product: {
        slug: string;
        name: string
    }
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedReviews {
    data: Review[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

interface ReviewState {
    reviews: Review[] | null;
    paginatedReviews: PaginatedReviews | null;
    loading: boolean;
    error: string | null;
    currentReview: Review | null;
    editReviewSuccess: boolean;
    success: boolean;
}

const initialState: ReviewState = {
    reviews: null,
    paginatedReviews: null,
    loading: false,
    error: null,
    currentReview: null,
    editReviewSuccess: false,
    success: false,
}

export const fetchReviews = createAsyncThunk<
    Review[],
    void,
    { state: RootState, rejectValue: string }
>(
    'review/fetchReviews',
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

            const {data} = await axios.get<Review[]>('/api/reviews', config);
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

export const fetchAdminReviewsList = createAsyncThunk<
    Review[],
    void,
    { state: RootState, rejectValue: string }
>(
    'review/fetchAdminReviewList',
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

            const {data} = await axios.get('/api/admin/reviews', config);
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

export const fetchReviewsWithPagination = createAsyncThunk<
    PaginatedReviews,
    { productId: number, page: number | null },
    { state: RootState, rejectValue: string }
>(
    'review/fetchReviewsWithPagination',
    async ({productId, page}, thunkAPI) => {
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

            const pageParam = page === null ? '' : `?page=${page}`;

            const {data} = await axios.get<PaginatedReviews>(`/api/products/${productId}/reviews${pageParam}`, config);
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

export const fetchReviewById = createAsyncThunk<
    Review,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'review/fetchReviewById',
    async (id, thunkAPI) => {
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

            const {data} = await axios.get<Review>(`/api/reviews/${id}`, config);

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

export const createReview = createAsyncThunk<
    Review,
    { product_id: number, user_id: number, username: string, rating: number, comment: string },
    { state: RootState, rejectValue: string }
>(
    'review/createReview',
    async ({product_id, user_id, username, rating, comment}, thunkAPI) => {
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

            console.log('called create review');
            const {data} = await axios.post<Review>(`/api/products/${product_id}/reviews`, {
                user_id,
                username,
                rating,
                comment
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

export const updateReview = createAsyncThunk<
    Review,
    { id: number, user_comment: string, admin_comment: string },
    { state: RootState, rejectValue: string }
>(
    'review/updateReview',
    async ({id, user_comment, admin_comment}, thunkAPI) => {
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

            const {data} = await axios.patch<Review>(`/api/admin/reviews/${id}`, {
                id,
                user_comment,
                admin_comment
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

export const deleteReview = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'review/deleteReview',
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

            await axios.delete(`/api/admin/reviews/${id}`, config);

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

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            return initialState;
        },
        clearCurrentReview: (state) => {
            state.currentReview = null;
        },
        resetEditReviewSuccess: (state) => {
            state.editReviewSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchReview
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
                state.loading = false;
                state.reviews = action.payload;
                state.paginatedReviews = null;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchAdminReviewList
            .addCase(fetchAdminReviewsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminReviewsList.fulfilled, (state, action: PayloadAction<Review[]>) => {
                state.loading = false;
                state.reviews = action.payload;
                state.paginatedReviews = null;
            })
            .addCase(fetchAdminReviewsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchReview with pagination
            .addCase(fetchReviewsWithPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewsWithPagination.fulfilled, (state, action: PayloadAction<PaginatedReviews>) => {
                state.loading = false;
                state.paginatedReviews = action.payload;
                state.reviews = null;
            })
            .addCase(fetchReviewsWithPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchReviewById
            .addCase(fetchReviewById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewById.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.currentReview = action.payload;
            })
            .addCase(fetchReviewById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createReview
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.success = true;
                state.reviews = null;
                if (state.paginatedReviews && state.paginatedReviews.data) {
                    state.paginatedReviews.data = [action.payload, ...state.paginatedReviews.data]
                }
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle updateReview
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editReviewSuccess = false;
            })
            .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.editReviewSuccess = true;
                if (state.reviews) {
                    const index = state.reviews.findIndex((review) => review.id === action.payload.id);
                    if (index !== -1) {
                        state.reviews[index] = action.payload;
                    }
                } else if (state.paginatedReviews && state.paginatedReviews.data) {
                    const index = state.paginatedReviews.data.findIndex((review) => review.id === action.payload.id);

                    if (index !== -1) {
                        state.paginatedReviews.data[index] = action.payload;
                    }
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.editReviewSuccess = false;
            })

            // Handle deleteReview
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.success = true;
                if (state.reviews) {
                    state.reviews = state.reviews.filter((review) => review.id !== action.payload);
                } else if (state.paginatedReviews && state.paginatedReviews.data) {
                    state.paginatedReviews.data = state.paginatedReviews.data.filter((review) => review.id !== action.payload);
                }
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetReviewState, clearCurrentReview, resetEditReviewSuccess} = reviewSlice.actions;
export default reviewSlice.reducer;
