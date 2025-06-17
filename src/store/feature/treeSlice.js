import { createSlice } from '@reduxjs/toolkit';

const treeDataSlice = createSlice({
  name: 'treeData',
  initialState: [],
  reducers: {
    setFamilyDataList: (state, action) => {
        // Replace the current state with the new data
        return action.payload;
      },
  },
});
export const { setFamilyDataList } = treeDataSlice.actions;
export default treeDataSlice.reducer;