import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../services/cartApi";

const isAuthed = (state) => !!state.auth.user;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    if (!isAuthed(getState())) return [];
    try {
      const { data } = await cartApi.getCart();
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState, rejectWithValue }) => {
    if (!isAuthed(getState())) {
      return rejectWithValue("Please login to add items to your cart");
    }
    try {
      const { data } = await cartApi.addToCart(product.id, 1);
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const increaseQty = createAsyncThunk(
  "cart/increaseQty",
  async (id, { getState, rejectWithValue }) => {
    try {
      const item = getState().cart.items.find((i) => i.id === id);
      const { data } = await cartApi.updateQuantity(id, (item?.quantity || 1) + 1);
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const decreaseQty = createAsyncThunk(
  "cart/decreaseQty",
  async (id, { getState, rejectWithValue }) => {
    try {
      const item = getState().cart.items.find((i) => i.id === id);
      const qty = Math.max(1, (item?.quantity || 1) - 1);
      const { data } = await cartApi.updateQuantity(id, qty);
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.removeFromCart(id);
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.clearCart();
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const applyItems = (state, action) => {
      state.items = action.payload;
      state.error = null;
    };
    const reject = (state, action) => {
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, applyItems)
      .addCase(fetchCart.rejected, reject)
      .addCase(addToCart.fulfilled, applyItems)
      .addCase(addToCart.rejected, reject)
      .addCase(increaseQty.fulfilled, applyItems)
      .addCase(increaseQty.rejected, reject)
      .addCase(decreaseQty.fulfilled, applyItems)
      .addCase(decreaseQty.rejected, reject)
      .addCase(removeFromCart.fulfilled, applyItems)
      .addCase(removeFromCart.rejected, reject)
      .addCase(clearCart.fulfilled, applyItems)
      .addCase(clearCart.rejected, reject);
  },
});

export const { resetCartState } = cartSlice.actions;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export default cartSlice.reducer;
