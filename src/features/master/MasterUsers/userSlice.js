import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("user");
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async (newUser, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post("user", newUser);
      dispatch(getUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedUser, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`user/${updatedUser.id}`, updatedUser);
      dispatch(getUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`user/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  users: [],
  status: "idle",
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || "Failed to fetch users.";
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || "Failed to add user.";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || "Failed to update user.";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || "Failed to delete user.";
      });
  },
});

export default userSlice.reducer;
