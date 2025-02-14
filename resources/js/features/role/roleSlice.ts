import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

interface Role {
    id: number;
    name: string;
}

interface RoleState {
    role: Role[];
    loading: boolean;
    error: string | null;
    currentRole: Role | null;
    success: boolean;
}

const initialState: RoleState = {
    role: [],
    loading: false,
    error: null,
    currentRole: null,
    success: false,
}

export const fetchRoles = createAsyncThunk<
    Role[],
    void,
    { state: RootState, rejectValue: string }
>(
    'categories/fetchRoles',
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

            const {data} = await axios.get<Role[]>('/api/roles', config);

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

export const fetchRoleById = createAsyncThunk<
    Role,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'categories/fetchRoleById',
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

            const {data} = await axios.get<Role>(`/api/roles/${id}`, config);

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

export const createRole = createAsyncThunk<
    Role,
    { name: string },
    { state: RootState, rejectValue: string }
>(
    'categories/createRole',
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

            const {data} = await axios.post<Role>(`/api/roles`, {name}, config);

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

export const updateRole = createAsyncThunk<
    Role,
    { id: number, name: string, is_admin: number, perms: [] },
    { state: RootState, rejectValue: string }
>(
    'categories/updateRole',
    async ({id, name, is_admin, perms}, thunkAPI) => {
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

            const {data} = await axios.patch<Role>(`/api/roles/${id}`, {name, is_admin, perms}, config);

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

export const deleteRole = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'categories/deleteRole',
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

            await axios.delete(`/api/roles/${id}`, config);

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

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        resetRoleState: (state) => {
            return initialState;
        },
        clearCurrentRole: (state) => {
            state.currentRole = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchRole
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
                state.loading = false;
                state.role = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchRoleById
            .addCase(fetchRoleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoleById.fulfilled, (state, action: PayloadAction<Role>) => {
                state.loading = false;
                state.currentRole = action.payload;
            })
            .addCase(fetchRoleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createRole
            .addCase(createRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
                state.loading = false;
                state.role.push(action.payload); // Immer allows this!
                state.success = true;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle updateRole
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
                state.loading = false;
                const index = state.role.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.role[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deleteRole
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteRole.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.role = state.role.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetRoleState, clearCurrentRole} = roleSlice.actions;
export default roleSlice.reducer;
