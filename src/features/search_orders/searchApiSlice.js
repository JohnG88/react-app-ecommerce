import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const searchAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});
// const searchAdapter = createEntityAdapter();

const initialState = searchAdapter.getInitialState();

export const searchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSearchOrder: builder.query({
            query: (data) => {
                // console.log("search data", data);
                // console.log("search email", data.email);
                // console.log("search orderNumber", data.orderNumber);
                return `/search-order?email=${data.email}&orderNumber=${data.orderNumber}`;
            },
            transformResponse(response) {
                return searchAdapter.addOne(initialState, response);
            },
        }),
    }),
});

export const { useGetSearchOrderQuery } = searchApiSlice;
