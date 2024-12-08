import { apiSlice } from "../../app/api/apiSlice";
// import authSlice from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/token",
                method: "POST",
                body: { ...credentials },
            }),
            transformResponse: (response) => {
                // Log the response to see what is being returned
                // console.log("API Response:", response);
                return response;
            },
        }),
        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: { ...userData },
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/logout-user",
                method: "POST",
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Clear the local cookie after successful logout
                    document.cookie =
                        "my_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    // Optionally, you can clear Redux state here by dispatching the logout action
                    // dispatch(logout());
                } catch (err) {
                    console.error("Logout failed: ", err);
                }
            },
        }),
        resetPassword: builder.mutation({
            query: (email) => ({
                url: "/password-reset",
                method: "POST",
                body: { email },
            }),
        }),
        passwordResetConfirm: builder.mutation({
            query: ({ uidb64, token, new_password }) => ({
                url: "/password-reset-confirm",
                method: "POST",
                body: { uidb64, token, new_password },
            }),
        }),
    }),
});

// console.log("Api slice ", authSlice);

export const {
    useLoginMutation,
    useRegisterUserMutation,
    useLogoutUserMutation,
    useResetPasswordMutation,
    usePasswordResetConfirmMutation,
} = authApiSlice;
