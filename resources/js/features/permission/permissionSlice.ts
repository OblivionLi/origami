import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

interface Permission {
    id: number;
    name: string;
}

interface PermissionState {
    permission: Permission[];
    loading: boolean;
    error: string | null;
    currentPermission: Permission | null;
    success: boolean;
}

const initialState: PermissionState = {
    permission: [],
    loading: false,
    error: null,
    currentPermission: null,
    success: false,
}

export const fetchPermissions = createAsyncThunk<
    Permission[],
    void,
    { state: RootState, rejectValue: string }
>(
    'permission/fetchPermissions',
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

            const {data} = await axios.get<Permission[]>('/api/permissions', config);

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

export const fetchPermissionById = createAsyncThunk<
    Permission,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'permission/fetchPermissionById',
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

            const {data} = await axios.get<Permission>(`/api/permissions/${id}`, config);

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

export const createPermission = createAsyncThunk<
    Permission,
    { name: string },
    { state: RootState, rejectValue: string }
>(
    'permission/createPermission',
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

            const {data} = await axios.post<Permission>(`/api/permissions`, {name}, config);

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

export const updatePermission = createAsyncThunk<
    Permission,
    { id: number, name: string },
    { state: RootState, rejectValue: string }
>(
    'permission/updatePermission',
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

            const {data} = await axios.patch<Permission>(`/api/permissions/${id}`, {name}, config);

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

export const deletePermission = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'permission/deletePermission',
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

            await axios.delete(`/api/permissions/${id}`, config);

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

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        resetPermissionState: (state) => {
            return initialState;
        },
        clearCurrentPermission: (state) => {
            state.currentPermission = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchPermission
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action: PayloadAction<Permission[]>) => {
                state.loading = false;
                state.permission = action.payload;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchPermissionById
            .addCase(fetchPermissionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissionById.fulfilled, (state, action: PayloadAction<Permission>) => {
                state.loading = false;
                state.currentPermission = action.payload;
            })
            .addCase(fetchPermissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createPermission
            .addCase(createPermission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPermission.fulfilled, (state, action: PayloadAction<Permission>) => {
                state.loading = false;
                state.permission.push(action.payload); // Immer allows this!
                state.success = true;
            })
            .addCase(createPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle updatePermission
            .addCase(updatePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePermission.fulfilled, (state, action: PayloadAction<Permission>) => {
                state.loading = false;
                const index = state.permission.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.permission[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(updatePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deletePermission
            .addCase(deletePermission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deletePermission.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.permission = state.permission.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deletePermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetPermissionState, clearCurrentPermission} = permissionSlice.actions;
export default permissionSlice.reducer;
