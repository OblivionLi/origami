import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

export interface Order {
    id: number;
    user_id: number;
    cart_items?: [];
    products_price?: number;
    shipping_price?: number;
    tax_price?: number;
    total_price?: number;
    products_discount_price?: number;
    order_id: number;
    status: "PENDING" | "PAID" | "DELIVERED" | "FAILED";
    is_paid: number; // 0 or 1
    is_delivered: number; // 0 or 1
    paid_at: string | null;
    delivered_at: string | null;
    created_at: string;
}

interface OrderState {
    order: Order[];
    loading: boolean;
    error: string | null;
    currentOrder: Order | null;
    success: boolean;
}

const initialState: OrderState = {
    order: [],
    loading: false,
    error: null,
    currentOrder: null,
    success: false,
}

export const fetchOrders = createAsyncThunk<
    Order[],
    void,
    { state: RootState, rejectValue: string }
>(
    'order/fetchOrders',
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

            const {data} = await axios.get<Order[]>('/api/orders', config);

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

export const fetchOrderById = createAsyncThunk<
    Order,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'order/fetchOrderById',
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

            const {data} = await axios.get<Order>(`/api/orders/${id}`, config);

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

export const createOrder = createAsyncThunk<
    Order,
    {
        user_id: string;
        cart_items?: [];
        products_price?: number,
        products_discount_price?: number,
        shipping_price?: number,
        tax_price?: number,
        total_price?: number
    }, { state: RootState, rejectValue: string }
>(
    'order/createOrder',
    async ({
               user_id,
               cart_items,
               products_price,
               products_discount_price,
               shipping_price,
               tax_price,
               total_price
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

            const {data} = await axios.post<Order>(`/api/orders`,
                {
                    user_id,
                    cart_items,
                    products_price,
                    products_discount_price,
                    shipping_price,
                    tax_price,
                    total_price,
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

export const payOrder = createAsyncThunk<
    Order,
    {
        id: number;
    },
    { state: RootState, rejectValue: string }
>(
    'order/payOrder',
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

            const {data} = await axios.patch<Order>(`/api/orders/${id}/pay`, {}, config);

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

export const deliverOrder = createAsyncThunk<
    Order,
    {
        id: number;
    },
    { state: RootState, rejectValue: string }
>(
    'order/deliverOrder',
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

            const {data} = await axios.patch<Order>(`/api/orders/${id}/deliver`, {}, config);

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

export const createPDFOrder = createAsyncThunk<
    string,
    {
        id: number;
    },
    { state: RootState, rejectValue: string }
>(
    'order/createPDFOrder',
    async ({id}, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const response = await axios.get(`/api/orders/${id}/pdf`, {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
                responseType: 'blob',
            });

            return window.URL.createObjectURL(new Blob([response.data]));
        } catch (error: any) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteOrder = createAsyncThunk<
    number,
    { id: number },
    { state: RootState, rejectValue: string }
>(
    'order/deleteOrder',
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

            await axios.delete(`/api/orders/${id}`, config);

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

export const listUserOrders = createAsyncThunk<
    Order[],
    void,
    { state: RootState, rejectValue: string }
>(
    'order/listUserOrders',
    async (_, thunkAPI) => {
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

            const {data} = await axios.get<Order[]>('/api/orders/me', config);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            return initialState;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchOrder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle fetchOrderById
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
            })

            // Handle createOrder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                state.order.push(action.payload); // Immer allows this!
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle payOrder
            .addCase(payOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(payOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                const index = state.order.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.order[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deliverOrder
            .addCase(deliverOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deliverOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                const index = state.order.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) {
                    state.order[index] = action.payload; // Immer allows this!
                }
                state.success = true;
            })
            .addCase(deliverOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle createPDFOrder
            .addCase(createPDFOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPDFOrder.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createPDFOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            // Handle deleteOrder
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;

            })
            .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.order = state.order.filter((a) => a.id !== action.payload); // OK with Immer
                state.success = true;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            })

            .addCase(listUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(listUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.order = action.payload;
                state.success = true;
            })
            .addCase(listUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload ? action.payload : "Unknown Error";
                state.order = [];
            });

        // add the remaining reducers
    },
});

export const {resetOrderState, clearCurrentOrder} = orderSlice.actions;
export default orderSlice.reducer;
