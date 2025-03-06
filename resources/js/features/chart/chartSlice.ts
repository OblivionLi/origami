import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from 'axios';
import {RootState} from "@/store";

interface OrderStatsResponse {
    orderCount: number;
    userCount: number;
    revenueLastMonth: number;
    revenueLastMonthName: string;
    revenueAllTime: number;
    averageRevenue: number;
    timestamp: string;
}

interface OrderStatsState {
    orderStats: OrderStatsResponse | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: OrderStatsState = {
    orderStats: null,
    loading: false,
    error: null,
    success: false,
}

export const fetchOrderCharts = createAsyncThunk<
    OrderStatsResponse,
    void,
    { state: RootState, rejectValue: string }
>(
    'chart/fetchOrderCharts',
    async (_, thunkAPI) => {
        try {
            const {user: {userInfo}} = thunkAPI.getState();

            if (!userInfo || !userInfo.data || !userInfo.data.access_token) {
                return thunkAPI.rejectWithValue("User not logged in or token missing.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const {data} = await axios.get(`/api/admin/order-charts`, config);
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

const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        resetChartState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchOrderCharts
            .addCase(fetchOrderCharts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchOrderCharts.fulfilled, (state, action: PayloadAction<OrderStatsResponse>) => {
                state.loading = false;
                state.orderStats = action.payload;
                state.success = true;
            })
            .addCase(fetchOrderCharts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload : "Unknown error";
                state.success = false;
            });
    },
});

export const {resetChartState} = chartSlice.actions;
export default chartSlice.reducer;
