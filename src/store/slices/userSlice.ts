import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchQuery: string;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchQuery: '',
};

export const fetchUsersAsync = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page: number; pageSize: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const response = await userAPI.createUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateUser(id, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userAPI.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { setCurrentPage, setSearchQuery, clearError } = userSlice.actions;
export default userSlice.reducer;