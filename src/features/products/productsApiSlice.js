import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const productsAdapter = createEntityAdapter();
const initialState = productsAdapter.getInitialState();

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
            transformResponse(response) {
                return productsAdapter.setAll(initialState, response);
            },
            providesTags: (result) => [
                { type: "Product", id: "LIST" },
                ...result.ids.map((id) => ({ type: "Product", id })),
            ],

            // providesTags: (result) => {
            //     console.log("result", result);

            //     const productTags = result.ids
            //         ? result.ids.map((id) => ({ type: "Product", id }))
            //         : [];

            //     return [{ type: "Product", id: "LIST" }, ...productTags];
            // },
        }),
        getProductsById: builder.query({
            query: (Id) => {
                return `/product/${Id}`;
            },
            transformResponse: (response) => response,
            providesTags: (result) => {
                console.log("result", result);

                const productTags = result?.id
                    ? [{ type: "Product", id: result.id }]
                    : [];

                return [{ type: "Product", id: "LIST" }, ...productTags];
            },
        }),
        addNewProduct: builder.mutation({
            query: ({ Id, number }) => ({
                url: `/product/${Id}`,
                method: "POST",
                body: {
                    quantity: number,
                },
                transformResponse: (response) => response,
            }),
            invalidatesTags: [{ type: "Order", id: "LIST" }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductsByIdQuery,
    useAddNewProductMutation,
} = productsApiSlice;
