import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

export interface Address {
    id: number;
    user_id: number;
    name: string;
    surname: string;
    country: string;
    city: string;
    address: string;
    postal_code: string;
    phone_number: string;
}

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
    currentAddress: Address | null;
    success: boolean;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
    currentAddress: null,
    success: false,
}

export const fetchAddresses = createAsyncThunk<
    Address[],
    void,
    { state: RootState; rejectValue: string }>
(
    'address/fetchAddresses',
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

            const {data} = await axios.get<Address[]>('/api/address', config);

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

export const fetchOrderAddressById = createAsyncThunk<
    Address,
    { id: number },
    { state: RootState; rejectValue: string }>
(
    'address/fetchOrderAddressById',
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

            const {data} = await axios.get(`/api/address/${id}/order`, config);
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

export const createAddress = createAsyncThunk<
    Address,
    {
        user_id: number;
        name: string;
        surname: string;
        country: string;
        city: string;
        address: string;
        postal_code: string;
        phone_number: string;
    },
    { state: RootState; rejectValue: string }>
(
    'address/createAddress',
    async ({
               user_id,
               name,
               surname,
               country,
               city,
               address,
               postal_code,
               phone_number
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

            const {data} = await axios.post<Address>(`/api/address`,
                {
                    user_id,
                    name,
                    surname,
                    country,
                    city,
                    address,
                    postal_code,
                    phone_number
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

export const updateAddress = createAsyncThunk<
    Address,
    {
        id?: number;
        user_id: number;
        name: string;
        surname: string;
        country: string;
        city: string;
        address: string;
        postal_code: string;
        phone_number: string;
    },
    { state: RootState; rejectValue: string }>
(
    'address/updateAddress',
    async ({
               id,
               user_id,
               name,
               surname,
               country,
               city,
               address,
               postal_code,
               phone_number
           }, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!id) {
                return thunkAPI.rejectWithValue("User address missing.");
            }

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                }
            };

            const {data} = await axios.patch<Address>(`/api/address/${id}`,
                {
                    user_id,
                    name,
                    surname,
                    country,
                    city,
                    address,
                    postal_code,
                    phone_number
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

export const deleteAddress = createAsyncThunk<
    number,
    {
        id: number;
    },
    { state: RootState; rejectValue: string }>
(
    'address/deleteAddress',
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

            const {data} = await axios.delete(`/api/address/${id}`, config);

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

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        resetAddressState: (state) => {
            return initialState;
        },
        clearCurrentAddress: (state) => {
            state.currentAddress = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchAddresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })
            // Handle fetchOrderAddressById
            .addCase(fetchOrderAddressById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderAddressById.fulfilled, (state, action: PayloadAction<Address>) => {
                state.loading = false;
                state.currentAddress = action.payload;
            })
            .addCase(fetchOrderAddressById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createAddress
            .addCase(createAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                state.loading = false;
                state.addresses.push(action.payload); // Immer allows this!
                state.success = true;
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle updateAddress
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                state.loading = false;
                const index = state.addresses.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deleteAddress
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.addresses = state.addresses.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;

            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetAddressState, clearCurrentAddress} = addressSlice.actions;
export default addressSlice.reducer;
