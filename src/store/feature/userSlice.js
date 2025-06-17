import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUser } from '../../utils/Api';

const BASE_URL = import.meta.env.VITE_API_URL;

// Initial State
const initialState = {
  user: {},
  comments: [],
  status: 'idle',
  error: null,
};

// Async Thunk for Fetching Data from /post/accept-comment
export const fetchComments = createAsyncThunk('user/fetchComments',
    async (_, { rejectWithValue }) => {
    try {
   

      const res = await getUser()
      // const response = await axios.get(`${BASE_URL}/post/accept-comment`);
      // return response.data; // Assuming API returns an array of comments
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data || 'An error occurred');
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Add additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Update comments in state
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
