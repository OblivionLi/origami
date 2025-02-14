import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

interface Review {
    id: number;
    name: string;
}

interface ReviewState {
    review: Review[];
    loading: boolean;
    error: string | null;
    currentReview: Review | null;
    success: boolean;
}

const initialState: ReviewState = {
    review: [],
    loading: false,
    error: null,
    currentReview: null,
    success: false,
}

export const fetchReviews = createAsyncThunk<
    Review[],
    void,
    { state: RootState, rejectValue: string }
>(
    'categories/fetchReviews',
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

export const fetchReviewsWithPagination = createAsyncThunk<
    Review[],
    { id: number, page: string | null },
    { state: RootState, rejectValue: string }
>(
    'categories/fetchReviewsWithPagination',
    async ({id, page}, thunkAPI) => {
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

            if (page == null) {
                page = "";
            }

            const {data} = await axios.get<Review[]>(`/api/reviews/${id}?page=${page}`, config);

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
    'categories/fetchReviewById',
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
    'categories/createReview',
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

            const {data} = await axios.post<Review>(`/api/reviews/${product_id}`, {
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
    'categories/updateReview',
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

            const {data} = await axios.patch<Review>(`/api/reviews/${id}`, {
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
    'categories/deleteReview',
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

            await axios.delete(`/api/reviews/${id}`, config);

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
                state.review = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchReview with pagination
            .addCase(fetchReviewsWithPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewsWithPagination.fulfilled, (state, action: PayloadAction<Review[]>) => {
                state.loading = false;
                state.review = action.payload;
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
                state.review.push(action.payload); // Immer allows this!
                state.success = true;
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
                state.success = false;
            })
            .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                const index = state.review.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.review[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deleteReview
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.review = state.review.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetReviewState, clearCurrentReview} = reviewSlice.actions;
export default reviewSlice.reducer;
