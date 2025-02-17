import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

interface ParentCategorySlice {
    id: number;
    name: string;
}

interface ParentCategoryState {
    parentCategories: ParentCategorySlice[];
    loading: boolean;
    error: string | null;
    currentParentCategory: ParentCategorySlice | null;
    success: boolean;
}

const initialState: ParentCategoryState = {
    parentCategories: [],
    loading: false,
    error: null,
    currentParentCategory: null,
    success: false,
}

export const fetchParentCategories = createAsyncThunk<
    ParentCategorySlice[],
    void,
    { state: RootState, rejectValue: string }
>(
    'parentCategory/fetchParentCategories',
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

            const {data} = await axios.get<ParentCategorySlice[]>('/api/parent-categories', config);

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

export const fetchParentCategoryById = createAsyncThunk<
    ParentCategorySlice,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'parentCategory/fetchParentCategoryById',
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

            const {data} = await axios.get<ParentCategorySlice>(`/api/parent-categories/${id}`, config);

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

export const createParentCategory = createAsyncThunk<
    ParentCategorySlice,
    { name: string },
    { state: RootState, rejectValue: string }
>(
    'parentCategory/createParentCategory',
    async ({name}, thunkAPI) => {
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

            const {data} = await axios.post<ParentCategorySlice>(`/api/parent-categories`, {name}, config);

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

export const updateParentCategory = createAsyncThunk<
    ParentCategorySlice,
    { id: number, name: string },
    { state: RootState, rejectValue: string }
>(
    'parentCategory/updateParentCategory',
    async ({id, name}, thunkAPI) => {
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

            const {data} = await axios.patch<ParentCategorySlice>(`/api/parent-categories/${id}`, {name}, config);

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

export const deleteParentCategory = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'parentCategory/deleteParentCategory',
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

            await axios.delete(`/api/parent-categories/${id}`, config);

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

const parentCategorySlice = createSlice({
    name: 'parentCategory',
    initialState,
    reducers: {
        resetParentCategoryState: (state) => {
            return initialState;
        },
        clearCurrentParentCategory: (state) => {
            state.currentParentCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchParentCategories
            .addCase(fetchParentCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParentCategories.fulfilled, (state, action: PayloadAction<ParentCategorySlice[]>) => {
                state.loading = false;
                state.parentCategories = action.payload;
            })
            .addCase(fetchParentCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchParentCategoryById
            .addCase(fetchParentCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParentCategoryById.fulfilled, (state, action: PayloadAction<ParentCategorySlice>) => {
                state.loading = false;
                state.currentParentCategory = action.payload;
            })
            .addCase(fetchParentCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createParentCategory
            .addCase(createParentCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createParentCategory.fulfilled, (state, action: PayloadAction<ParentCategorySlice>) => {
                state.loading = false;
                state.parentCategories.push(action.payload); // Immer allows this!
                state.success = true;
            })
            .addCase(createParentCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle updateParentCategory
            .addCase(updateParentCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateParentCategory.fulfilled, (state, action: PayloadAction<ParentCategorySlice>) => {
                state.loading = false;
                const index = state.parentCategories.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.parentCategories[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(updateParentCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deleteParentCategory
            .addCase(deleteParentCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteParentCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.parentCategories = state.parentCategories.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteParentCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetParentCategoryState, clearCurrentParentCategory} = parentCategorySlice.actions;
export default parentCategorySlice.reducer;
