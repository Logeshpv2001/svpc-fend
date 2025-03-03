import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "../slices/toggleSlice";
import selectedRowReducer from "../slices/selectedRowSlice";
import vasScaleReducer from "../slices/vasScaleSlice";
import pointerReducer from "../slices/pointerSlice";
import appointmentReducer from "../slices/appointmentSlice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    selectedRow: selectedRowReducer,
    vasScale: vasScaleReducer,
    pointer: pointerReducer,
    appointments: appointmentReducer,
  },
});
