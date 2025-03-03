import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";
import {Permission} from "@/features/permission/permissionSlice";

export interface Role {
    id: number;
    name: string;
    is_admin: number;
    users_count: number;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

interface RoleState {
    roles: Role[];
    loading: boolean;
    error: string | null;
    currentRole: Role | null;
    success: boolean;
    editRoleSuccess: boolean;
    addRoleSuccess: boolean;
}

const initialState: RoleState = {
    roles: [],
    loading: false,
    error: null,
    currentRole: null,
    success: false,
    editRoleSuccess: false,
    addRoleSuccess: false,
}

export const fetchRoles = createAsyncThunk<
    Role[],
    void,
    { state: RootState, rejectValue: string }
>(
    'role/fetchRoles',
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

            const {data} = await axios.get('/api/admin/roles', config);
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

export const fetchRoleById = createAsyncThunk<
    Role,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'role/fetchRoleById',
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
    { name: string | undefined },
    { state: RootState, rejectValue: string }
>(
    'role/createRole',
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

            const {data} = await axios.post<Role>(`/api/admin/roles`, {name}, config);

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
    { id: number | undefined, name: string | undefined, is_admin: number | undefined, perms: number[] | undefined },
    { state: RootState, rejectValue: string }
>(
    'role/updateRole',
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

            const {data} = await axios.patch<Role>(`/api/admin/roles/${id}`,
                {
                    name,
                    is_admin,
                    perms
                },
                config
            );

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
    'role/deleteRole',
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

            await axios.delete(`/api/admin/roles/${id}`, config);

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
        },
        resetEditRoleSuccess: (state) => {
            state.editRoleSuccess = false;
        },
        resetAddRoleSuccess: (state) => {
            state.addRoleSuccess = false;
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
                state.roles = action.payload;
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
                state.addRoleSuccess = false;
            })
            .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
                state.loading = false;
                state.roles.push(action.payload);
                state.addRoleSuccess = true;
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.addRoleSuccess = false;
            })

            // Handle updateRole
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editRoleSuccess = false;
            })
            .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
                state.loading = false;
                const index = state.roles.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
                state.editRoleSuccess = true;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.editRoleSuccess = false;
            })

            // Handle deleteRole
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteRole.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.roles = state.roles.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetRoleState, clearCurrentRole, resetEditRoleSuccess, resetAddRoleSuccess} = roleSlice.actions;
export default roleSlice.reducer;
