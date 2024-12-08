import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { username: null, token: null, refresh: null },
    reducers: {
        setCredentials: (state, action) => {
            // console.log("action.payload", action.payload);
            const { username, access, refresh } = action.payload;
            state.username = username || state.username;
            state.token = access || state.token;
            state.refresh = refresh || state.refresh;
        },
        logout: (state) => {
            state.username = null;
            state.token = null;
            state.refresh = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUsername = (state) => state.auth.username;
export const selectCurrentAccess = (state) => state.auth.token;
export const selectCurrentRefresh = (state) => state.auth.refresh;
