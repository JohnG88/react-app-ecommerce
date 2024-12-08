import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create an adapter for customer (which includes user)
const customerAdapter = createEntityAdapter();
const ordersAdapter = createEntityAdapter();

// Define initial state
const initialCustomerState = customerAdapter.getInitialState();
const initialOrdersState = ordersAdapter.getInitialState();

export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => "/user",
            transformResponse(response) {
                // Log the entire response to inspect its structure
                // console.log("Full API Response:", response);

                // Log specific parts of the response
                // console.log("Customer Data:", response.customer);

                // Ensure response contains customer
                if (!response.customer && !response.orders) {
                    // console.error("API response is missing customer data");
                    return {
                        customer: initialCustomerState,
                        orders: initialOrdersState,
                    };
                }

                // Normalize state for customer and orders
                const customerState = customerAdapter.setOne(
                    initialCustomerState,
                    response.customer
                );
                const ordersState = ordersAdapter.setAll(
                    initialOrdersState,
                    response.orders
                );

                // Return normalized state for customer, which includes user data
                return { customer: customerState, orders: ordersState };
            },
        }),
    }),
});

export const { useGetProfileQuery } = profileApiSlice;
