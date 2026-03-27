import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔥 LOGIN API CALL
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (form: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message ||   "Login failed");
      }

      // ✅ TOKEN SAVE (IMPORTANT)
      const token = data.token || data?.data?.token;

      if (typeof window !== "undefined" && token) {
        localStorage.setItem("token", token);
      }

      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Server error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  } as any,

  reducers: {
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;