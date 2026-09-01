import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const persistAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      address: data.address,
      role: data.role,
    })
  );
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login({ email, password });
      persistAuth(data);
      return {
        _id: data._id,
        name: data.name,
        email: data.email,
        address: data.address,
        role: data.role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, address }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register({
        name,
        email,
        password,
        address,
      });
      persistAuth(data);
      return {
        _id: data._id,
        name: data.name,
        email: data.email,
        address: data.address,
        role: data.role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch {
    // ignore errors on logout
  }
  clearAuth();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    status: "idle", // idle | loading
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
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
        state.user = null;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "idle";
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
