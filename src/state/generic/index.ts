import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feature } from "components/FeatureFlag";
import { GenericState } from "../types";

const initialState: GenericState = { features: [] };

export const genericSlice = createSlice({
  name: "Generic",
  initialState,
  reducers: {
    setFeaturesEnabled: (
      state,
      action: PayloadAction<Feature[]>
    ): GenericState => ({ ...state, features: action.payload }),
  },
});

// Actions
export const { setFeaturesEnabled } = genericSlice.actions;

export default genericSlice.reducer;
