import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

export const mystore = configureStore({
    reducer: combineReducers({
        auth: authSlice,
    })
})