import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "../../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    // // Needed for rtk query to cache different results
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(apiSlice.middleware),
    // devTools: true,
    // Combine default middleware with the apiSlice middleware
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    "api.queries.getOrders.originalArgs.selectFromResult",
                ],
            },
        }).concat(apiSlice.middleware);
    },
    devTools: true,
});
