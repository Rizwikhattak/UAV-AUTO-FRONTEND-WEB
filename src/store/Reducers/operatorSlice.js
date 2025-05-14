import {
  addOperator,
  deleteOperator,
  getAllOperators,
  updateOperator,
} from "@/Store/Actions/operatorActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  data: [],
  loading: false,
  error: false,
};
const operatorSlice = createSlice({
  name: "operator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOperator.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOperator.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("Operator added");
        toast.success("Operator Added");
      })
      .addCase(addOperator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Error Adding Operator");
        toast.error("Error Adding Operator");
      })
      .addCase(getAllOperators.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOperators.fulfilled, (state, action) => {
        // JSON.parse() to convert json into a normal dict
        state.data = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllOperators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Error Fetching Operators");
      })
      .addCase(updateOperator.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOperator.fulfilled, (state, action) => {
        // state.data = action.payload.data;
        const index = state.data.findIndex(
          (op) => op.id === action.payload.data.id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data;
        }
        state.loading = false;
        state.error = null;
        toast.success("Operator Updated");
      })
      .addCase(updateOperator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Error updating Operator");
      })
      .addCase(deleteOperator.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOperator.fulfilled, (state, action) => {
        // state.data = action.payload.data;
        state.data = state.data.filter(
          (op) => op.id !== action.payload.data.id
        );
        state.loading = false;
        state.error = null;
        toast.success("Operator Deleted");
      })
      .addCase(deleteOperator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Error deleting Operator");
      });
  },
});

export default operatorSlice.reducer;
