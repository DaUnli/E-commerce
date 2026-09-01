import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "../services/orderApi";

const mapOrder = (o) => ({
  ...o,
  id: o._id,
  items: (o.items || []).map((i) => ({ ...i, id: i.product || i._id })),
  status: o.status || "Pending",
});

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.createOrder(order);
      return mapOrder(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "orders/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.getMyOrders();
      return data.map(mapOrder);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.updateOrderStatus(orderId, status);
      return mapOrder(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.cancelOrder(orderId);
      return mapOrder(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        const exists = state.items.some((o) => o.id === action.payload.id);
        if (!exists) {
          state.items.unshift(action.payload);
        } else {
          state.items = state.items.map((o) =>
            o.id === action.payload.id ? action.payload : o
          );
        }
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.items = state.items.map((o) =>
          o.id === action.payload.id ? action.payload : o
        );
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.items = state.items.map((o) =>
          o.id === action.payload.id ? action.payload : o
        );
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectMyOrders = (state) => state.orders.items;

export default ordersSlice.reducer;
