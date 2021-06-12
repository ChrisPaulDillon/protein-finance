import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import farmsReducer from "./farms";
import poolsReducer from "./pools";
import blockReducer from "./block";
import genericReducer from "./generic";

const rootReducer = {
  block: blockReducer,
  farms: farmsReducer,
  pools: poolsReducer,
  generic: genericReducer,
};

const reducer = combineReducers({ ...rootReducer });

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer,
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // Export a hook that can be reused to resolve types

export default store;
