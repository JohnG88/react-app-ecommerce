// //import { createEntityAdapter } from "@reduxjs/toolkit";
// import { apiSlice } from "../../app/api/apiSlice";

// //const itemInOrderAdapter = createEntityAdapter();

// //const initialState = itemInOrderAdapter.getInitialState();

// export const itemInOrderApiSlice = apiSlice.injectEndpoints({
//     endpoints: (builder) => ({
//         updateItemInOrder: builder.mutation({
//             query: (id, quantity) => ({
//                 url: `/update-order-item/${id}`,
//                 method: "PATCH",
//                 body: {
//                     quantity: quantity,
//                 },
//             }),
//         }),
//     }),
// });

// export const { useUpdateItemInOrderMutation } = itemInOrderApiSlice;
