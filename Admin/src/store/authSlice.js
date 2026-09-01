import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../services/api";
import { ROLES } from "../config/roles";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem("admin_user") || "null");
  } catch {
    return null;
  }
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login({ email, password });
      const role = data.role === "admin" ? "admin" : "user";
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role,
        roleLabel: (ROLES[role] || ROLES.user).label,
      };
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
