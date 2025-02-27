import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";
import {Address} from '@/features/address/addressSlice';
import {Role} from "@/features/role/roleSlice";

export interface User {
    id: number | undefined;
    name: string | undefined;
    email: string | undefined;
    role?: string;
    is_admin?: number;
    data?: {
        access_token?: string;
        message?: string;
        id?: number,
        name?: string,
        email?: string,
        role?: string,
        is_admin?: number,
        address?: Address[],
    }
}

export interface UserList {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
    addresses: Address[];
}

export interface RolesPermissions {
    permissions: string[],
}

interface UserState {
    userInfo: User | null;
    loading: boolean;
    error: string | null;
    users: User[];
    adminUsersList: UserList[];
    currentUser: User | null;
    userPermissions: RolesPermissions | null;
    editUserSuccess: boolean;
    success: boolean;
    registerSuccess: boolean;
    forgotPasswordSuccess: boolean;
    resetPasswordSuccess: boolean;
    updateCredentialsSuccess: boolean;
}

const getUserInfoFromStorage = (): User | null => {
    try {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const parsedUserInfo = JSON.parse(userInfoString);
            if (typeof parsedUserInfo === 'object' && parsedUserInfo !== null) {
                return parsedUserInfo as User;
            }
        }
    } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
        localStorage.removeItem('userInfo');
    }
    return null;
};

const initialState: UserState = {
    userInfo: getUserInfoFromStorage(),
    loading: false,
    error: null,
    users: [],
    userPermissions: null,
    adminUsersList: [],
    currentUser: null,
    editUserSuccess: false,
    success: false,
    registerSuccess: false,
    forgotPasswordSuccess: false,
    resetPasswordSuccess: false,
    updateCredentialsSuccess: false,
};

export const registerUser = createAsyncThunk<
    User,
    { name: string; email: string; password: string; password_confirmation: string; remember_me?: boolean },
    { state: RootState; rejectValue: string }
>(
    'user/register',
    async ({name, email, password, password_confirmation, remember_me}, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            };

            const {data} = await axios.post<User>(
                '/api/register',
                {name, email, password, password_confirmation, remember_me},
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const loginUser = createAsyncThunk<
    User,
    { email: string; password: string; remember_me?: boolean },
    { state: RootState; rejectValue: string }
>(
    'user/login',
    async ({email, password, remember_me}, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            };

            const {data} = await axios.post<User>(
                '/api/login',
                {email, password, remember_me},
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logoutUser = createAsyncThunk<
    void,
    void,
    { state: RootState, rejectValue: string }
>(
    'user/logout',
    async (_, thunkAPI) => {
        const userInfo = getUserInfoFromStorage();

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: `Bearer ${userInfo?.data?.access_token}`,
                },
            };

            await axios.get('/api/logout', config);

            localStorage.removeItem('userInfo');
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const forgotPassword = createAsyncThunk<
    any,
    { email: string },
    { state: RootState; rejectValue: string }
>(
    'user/forgotPassword',
    async ({email}, thunkAPI) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            };

            const {data} = await axios.post('/api/forgot-password', {email}, config);
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const resetPassword = createAsyncThunk<
    any,
    { email: string; password: string; password_confirmation: string },
    { state: RootState; rejectValue: string }
>(
    'user/resetPassword',
    async ({email, password, password_confirmation}, thunkAPI) => {
        try {
            const {data} = await axios.patch(`/api/reset-password/${email}`, {
                password,
                password_confirmation,
            });

            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getTokenResetPassword = createAsyncThunk<
    any,
    string,
    { state: RootState; rejectValue: string }
>(
    'user/getTokenResetPassword',
    async (id, thunkAPI) => {
        try {
            const {data} = await axios.get(`/api/reset-password/${id}`);
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCredentials = createAsyncThunk<
    User,
    { id?: number; name?: string; email?: string; password?: string },
    { state: RootState; rejectValue: string }
>(
    'user/updateCredentials',
    async ({id, name, email, password}, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            const {data} = await axios.patch<User>(
                `/api/users/update-credentials/${id}`,
                {name, email, password},
                config
            );

            const updatedUserInfo: User = {
                ...userInfo,
                id: data?.data?.id,
                name: data?.data?.name,
                email: data?.data?.email,
                data: {
                    ...(userInfo?.data ?? {}),
                    name: data?.data?.name,
                    email: data?.data?.email,
                }
            };

            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
            return updatedUserInfo;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getUsersList = createAsyncThunk<
    UserList[],
    void,
    { state: RootState; rejectValue: string }
>(
    'user/getUsersList',
    async (_, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            const {data} = await axios.get('/api/admin/users', config);
            return data.data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getUser = createAsyncThunk<
    User,
    number | undefined,
    { state: RootState; rejectValue: string }
>(
    'user/getUser',
    async (id, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            const {data} = await axios.get<User>(`/api/users/${id}`, config);
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getUserRolesPermissions = createAsyncThunk<
    RolesPermissions,
    { id: number | undefined },
    { state: RootState; rejectValue: string }
>(
    'user/getUserRolesPermissions',
    async ({id}, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            const {data} = await axios.get(`/api/admin/users/${id}/permissions`, config);
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getUserAddress = createAsyncThunk<
    User,
    number | undefined,
    { state: RootState; rejectValue: string }
>(
    'user/getUserAddress',
    async (id, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            const {data} = await axios.get<User>(`/api/users/${id}/address`, config);
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const editUser = createAsyncThunk<
    User,
    { id: number | undefined; name: string | undefined; email: string | undefined; roles: number[] | undefined },
    { state: RootState; rejectValue: string }
>(
    'user/editUser',
    async ({id, name, email, roles}, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            const {data} = await axios.patch<User>(
                `/api/admin/users/${id}`,
                {name, email, roles},
                config
            );
            return data;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteUser = createAsyncThunk<
    string,
    string,
    { state: RootState; rejectValue: string }
>(
    'user/deleteUser',
    async (id, thunkAPI) => {
        try {
            const {userInfo} = thunkAPI.getState().user;

            if (!userInfo?.data?.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };
            await axios.delete(`/api/users/${id}`, config);
            return id;
        } catch (error: any) {
            const message =
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUserState: (state) => {
            return initialState;
        },
        clearUserError: (state) => {
            state.error = null;
        },
        clearUserSuccess: (state) => {
            state.success = false;
        },
        clearAddressSuccess: (state) => {
            state.success = false;
        },
        resetEditUserSuccess: (state) => {
            state.editUserSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle user Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.registerSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : 'Unknown error';
                state.registerSuccess = false;
            })

            // Handle user Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.userInfo = null;
            })

            // Handle Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.forgotPasswordSuccess = true;

            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.forgotPasswordSuccess = false;
            })

            // Handle Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.resetPasswordSuccess = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.resetPasswordSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.resetPasswordSuccess = false;
            })

            // Handle Get Token Reset Password
            .addCase(getTokenResetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTokenResetPassword.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getTokenResetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle Update Credentials
            .addCase(updateCredentials.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateCredentialsSuccess = false;
            })
            .addCase(updateCredentials.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.userInfo = action.payload; // Update userInfo
                state.updateCredentialsSuccess = true;
            })
            .addCase(updateCredentials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.updateCredentialsSuccess = false;

            })

            // Handle Get Users List
            .addCase(getUsersList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersList.fulfilled, (state, action: PayloadAction<UserList[]>) => {
                state.loading = false;
                state.adminUsersList = action.payload;
            })
            .addCase(getUsersList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle Get Users Permissions
            .addCase(getUserRolesPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserRolesPermissions.fulfilled, (state, action: PayloadAction<RolesPermissions>) => {
                state.loading = false;
                state.userPermissions = action.payload;
            })
            .addCase(getUserRolesPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })

            // Handle Get User
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle Get User Address
            .addCase(getUserAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserAddress.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(getUserAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle Edit User
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editUserSuccess = false;
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.editUserSuccess = true;
                if (state.users) {
                    const index = state.users.findIndex((u) => u.id === action.payload.id);
                    if (index !== -1) {
                        state.users[index] = action.payload;
                    }
                }
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                if (state.users) {
                    state.users = state.users.filter((u) => u.id !== parseInt(action.payload));
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            });
    }
});

export const {resetUserState, clearUserError, clearUserSuccess, clearAddressSuccess, resetEditUserSuccess} = userSlice.actions;
export default userSlice.reducer;
