import { configureStore } from '@reduxjs/toolkit';
import treeDataSliceReducer from './feature/treeSlice';
import userReducer from './feature/userSlice';

export const store = configureStore({
  reducer: {
    treeData: treeDataSliceReducer,
    user: userReducer,
  },
});