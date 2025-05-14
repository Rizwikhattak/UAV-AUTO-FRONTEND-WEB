import { ApiCommon } from "@/utils/ApiCommon";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addOperator = createAsyncThunk(
  "operator/AddOperator",
  async (data, { rejectWithValue }) => {
    try {
      const operatorData = await ApiCommon(
        "post",
        "form",
        "insert_operator",
        "Error adding operator",
        data
      );
      return operatorData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding operator");
    }
  }
);
export const getAllOperators = createAsyncThunk(
  "operator/GetAllOperators",
  async (data, { rejectWithValue }) => {
    try {
      const operatorData = await ApiCommon(
        "getAll",
        "form",
        "get_all_operators",
        "Error fetching operator",
        data
      );
      return operatorData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error fetching operator");
    }
  }
);

export const updateOperator = createAsyncThunk(
  "operator/UpdateOperator",
  async (data, { rejectWithValue }) => {
    try {
      const operatorData = await ApiCommon(
        "put",
        "form",
        `update_operator_by_id/${data.get("id")}`,
        "Error updating operator",
        data
      );
      return operatorData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error updating operator");
    }
  }
);

export const deleteOperator = createAsyncThunk(
  "operator/DeleteOperator",
  async (id, { rejectWithValue }) => {
    try {
      console.log("IDDD", id);
      const operatorData = await ApiCommon(
        "delete",
        "json",
        `delete_operator_by_id/${id}`,
        "Error deleting operator",
        null
      );
      return operatorData;
    } catch (err) {
      return rejectWithValue(err?.message || "Error deleting operator");
    }
  }
);
