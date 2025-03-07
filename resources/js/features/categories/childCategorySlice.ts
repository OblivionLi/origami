import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";
import {ParentCategory} from "@/features/categories/parentCategorySlice";

export interface ChildCategorySlice {
    id: number;
    name: string;
    parentCategory: ParentCategory;
    created_at: string;
    updated_at: string;
}

interface ChildCategoryState {
    childCategories: ChildCategorySlice[];
    loading: boolean;
    error: string | null;
    currentChildCategory: ChildCategorySlice | null;
    editChildCategorySuccess: boolean;
    addChildCategorySuccess: boolean;
    success: boolean;
}

const initialState: ChildCategoryState = {
    childCategories: [],
    loading: false,
    error: null,
    currentChildCategory: null,
    editChildCategorySuccess: false,
    addChildCategorySuccess: false,
    success: false,
}

export const fetchChildCategories = createAsyncThunk<
    ChildCategorySlice[],
    void,
    { state: RootState, rejectValue: string }
>(
    'childCategory/fetchChildCategories',
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

            const {data} = await axios.get('/api/child-categories', config);
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

export const fetchAdminChildCategories = createAsyncThunk<
    ChildCategorySlice[],
    void,
    { state: RootState, rejectValue: string }
>(
    'childCategory/fetchAdminChildCategories',
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

            const {data} = await axios.get('/api/admin/child-categories', config);
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

export const fetchChildCategoryById = createAsyncThunk<
    ChildCategorySlice,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'childCategory/fetchChildCategoryById',
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

            const {data} = await axios.get<ChildCategorySlice>(`/api/admin/child-categories/${id}`, config);

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

export const createChildCategory = createAsyncThunk<
    ChildCategorySlice,
    { name: string, parentCategoryId: string },
    { state: RootState, rejectValue: string }
>(
    'childCategory/createChildCategory',
    async ({parentCategoryId, name}, thunkAPI) => {
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

            const {data} = await axios.post<ChildCategorySlice>(`/api/admin/child-categories`, {
                name,
                parentCategoryId
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

export const updateChildCategory = createAsyncThunk<
    ChildCategorySlice,
    { id: number | undefined, name: string | undefined, parentCategoryId: string | undefined},
    { state: RootState, rejectValue: string }
>(
    'childCategory/updateChildCategory',
    async ({id, name, parentCategoryId}, thunkAPI) => {
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

            const {data} = await axios.patch<ChildCategorySlice>(`/api/admin/child-categories/${id}`, {
                name,
                parentCategoryId
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

export const deleteChildCategory = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'childCategory/deleteChildCategory',
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

            await axios.delete(`/api/admin/child-categories/${id}`, config);

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

const childCategorySlice = createSlice({
    name: 'childCategory',
    initialState,
    reducers: {
        resetChildCategoryState: (state) => {
            return initialState;
        },
        clearCurrentChildCategory: (state) => {
            state.currentChildCategory = null;
        },
        resetAddChildCategorySuccess: (state) => {
            state.addChildCategorySuccess = false;
        },
        resetEditChildCategorySuccess: (state) => {
            state.editChildCategorySuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchAdminChildCategories
            .addCase(fetchAdminChildCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminChildCategories.fulfilled, (state, action: PayloadAction<ChildCategorySlice[]>) => {
                state.loading = false;
                state.childCategories = action.payload;
            })
            .addCase(fetchAdminChildCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchChildCategories
            .addCase(fetchChildCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChildCategories.fulfilled, (state, action: PayloadAction<ChildCategorySlice[]>) => {
                state.loading = false;
                state.childCategories = action.payload;
            })
            .addCase(fetchChildCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchChildCategoryById
            .addCase(fetchChildCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChildCategoryById.fulfilled, (state, action: PayloadAction<ChildCategorySlice>) => {
                state.loading = false;
                state.currentChildCategory = action.payload;
            })
            .addCase(fetchChildCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createChildCategory
            .addCase(createChildCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.addChildCategorySuccess = false;
            })
            .addCase(createChildCategory.fulfilled, (state, action: PayloadAction<ChildCategorySlice>) => {
                state.loading = false;
                state.childCategories.push(action.payload);
                state.addChildCategorySuccess = true;
            })
            .addCase(createChildCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.addChildCategorySuccess = false;
            })

            // Handle updateChildCategory
            .addCase(updateChildCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editChildCategorySuccess = false;
            })
            .addCase(updateChildCategory.fulfilled, (state, action: PayloadAction<ChildCategorySlice>) => {
                state.loading = false;
                const index = state.childCategories.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.childCategories[index] = action.payload;
                }
                state.editChildCategorySuccess = true;
            })
            .addCase(updateChildCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.editChildCategorySuccess = false;
            })

            // Handle deleteChildCategory
            .addCase(deleteChildCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteChildCategory.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.childCategories = state.childCategories.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteChildCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {
    resetChildCategoryState,
    clearCurrentChildCategory,
    resetEditChildCategorySuccess,
    resetAddChildCategorySuccess
} = childCategorySlice.actions;
export default childCategorySlice.reducer;
