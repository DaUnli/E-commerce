import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../services/productApi";

const mapProduct = (p) => ({
  ...p,
  id: p._id,
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getAll();
      return data.map(mapProduct);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    category: "all",
    searchQuery: "",
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.category = "all";
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectVisibleProducts = (state) => {
  const { items, category, searchQuery } = state.products;
  const query = searchQuery.trim().toLowerCase();

  return items.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.description || "").toLowerCase().includes(query) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });
};

export const { setCategory, setSearchQuery, clearFilters } =
  productsSlice.actions;

export default productsSlice.reducer;
