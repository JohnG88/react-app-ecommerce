import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        const refresh = api.getState().auth.refresh;
        // send refresh token to get new access token
        const refreshResult = await baseQuery(
            { url: "/refresh", method: "POST", body: { refresh: refresh } },
            api,
            extraOptions
        );
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            const currentRefresh = api.getState().auth.refresh;
            // console.log("Updated token: ", api.getState().auth.token);

            // store the new token
            // credentials is from authSlice.js

            // old api.dispatch below
            //api.dispatch(setCredentials({ ...refreshResult.data, user }));

            // new api.dispatch
            api.dispatch(
                setCredentials({
                    username: user, // Keep existing username
                    access: refreshResult.data.access, // Update access token
                    refresh: currentRefresh, // Keep existing refresh token
                })
            );

            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Order"],
    endpoints: () => ({}),
});
