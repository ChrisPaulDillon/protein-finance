import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import farmsReducer from "./farms";
import poolsReducer from "./pools";
import blockReducer from "./block";
import genericReducer from "./generic";

//swap reducers
import application from "./swap/application/reducer";
import { updateVersion } from "./swap/global/actions";
import user from "./swap/user/reducer";
import transactions from "./swap/transactions/reducer";
import swap from "./swap/swap/reducer";
import mint from "./swap/mint/reducer";
import lists from "./swap/lists/reducer";
import burn from "./swap/burn/reducer";
import multicall from "./swap/multicall/reducer";

import { save, load } from "redux-localstorage-simple";

type MergedState = {
  user: {
    [key: string]: any;
  };
  transactions: {
    [key: string]: any;
  };
};
const PERSISTED_KEYS: string[] = ["user", "transactions"];
const loadedState = load({ states: PERSISTED_KEYS }) as MergedState;

const rootReducer = {
  block: blockReducer,
  farms: farmsReducer,
  pools: poolsReducer,
  generic: genericReducer,
  application,
  user,
  swap,
  mint,
  lists,
  burn,
  multicall,
};

const reducer = combineReducers({ ...rootReducer });

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer,
});

store.dispatch(updateVersion());

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // Export a hook that can be reused to resolve types

export default store;
