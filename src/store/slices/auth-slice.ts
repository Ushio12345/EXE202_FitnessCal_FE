import type { User } from "@/types/auth-type";
import { supabase } from "./../../../supabaseClient";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "@/axios/instance";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Login with Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${import.meta.env.VITE_DOMAIN_URL}/authenticated`,
        },
      });
      if (data) {
      }
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Có lỗi xảy ra khi đăng nhập");
    }
  }
);

//login with discord

export const loginWithDiscord = createAsyncThunk(
  "auth/loginWithDiscord",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${import.meta.env.VITE_DOMAIN_URL}/authenticated`,
        },
      });
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Có lỗi xảy ra khi đăng nhập");
    }
  }
);
//login with email

export const loginWithEmailPassword = createAsyncThunk(
  "auth/loginWithEmailPassword",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
  return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      return rejectWithValue(message);
    }
  }
);
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return rejectWithValue(error.message);
      return data.session?.user || null;
    } catch (err: any) {
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return rejectWithValue(error.message);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message || "Có lỗi xảy ra khi logout");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login with google
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // login with dis
      .addCase(loginWithDiscord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithDiscord.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginWithDiscord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //login with ưmail

      .addCase(loginWithEmailPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmailPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginWithEmailPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // get user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //logout

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
