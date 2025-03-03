import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  frontSide: [],
  backSide: [],
  leftSide: [],
  rightSide: [],
};

const pointerSlice = createSlice({
  name: "pointer",
  initialState,
  reducers: {
    // Update or replace frontSide points
    updateFrontSide: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.frontSide = action.payload; // Replace with new points
      }
    },
    // Update or replace backSide points
    updateBackSide: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.backSide = action.payload; // Replace with new points
      }
    },
    // Update or replace rightSide points
    updateRightSide: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.rightSide = action.payload; // Replace with new points
      }
    },
    // Update or replace leftSide points
    updateLeftSide: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.leftSide = action.payload; // Replace with new points
      }
    },

    // Remove a specific pointer from frontSide
    clearFrontPointer: (state, action) => {
      state.frontSide = state.frontSide.filter(
        (_, index) => index !== action.payload
      );
    },
    // Remove a specific pointer from backSide
    clearBackPointer: (state, action) => {
      state.backSide = state.backSide.filter(
        (_, index) => index !== action.payload
      );
    },
    // Remove a specific pointer from leftSide
    clearLeftPointer: (state, action) => {
      state.leftSide = state.leftSide.filter(
        (_, index) => index !== action.payload
      );
    },
    // Remove a specific pointer from rightSide
    clearRightPointer: (state, action) => {
      state.rightSide = state.rightSide.filter(
        (_, index) => index !== action.payload
      );
    },
  },
});

export const {
  updateFrontSide,
  updateBackSide,
  updateLeftSide,
  updateRightSide,
  clearFrontPointer,
  clearBackPointer,
  clearLeftPointer,
  clearRightPointer,
} = pointerSlice.actions;
export default pointerSlice.reducer;
