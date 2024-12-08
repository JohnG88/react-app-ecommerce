import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const billingShippingAdapter = createEntityAdapter({
    selectId: (entity) => entity.id,
    sortComparer: (a, b) => b.address_type.localeCompare(a.address_type),
});

const initialState = billingShippingAdapter.getInitialState();

export const billingShippingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBillingShipping: builder.query({
            query: () => "/billing-shipping-address",
            transformResponse: (response) => {
                console.log("API response", response);

                const transformedResponse = {
                    ids: [],
                    entities: {},
                };

                const { shipping_address, billing_address } = response;

                if (shipping_address) {
                    transformedResponse.ids.push(shipping_address.id);
                    transformedResponse.entities[shipping_address.id] = {
                        ...shipping_address,
                        address_type: "shipping",
                    };
                }

                if (billing_address) {
                    transformedResponse.ids.push(billing_address.id);
                    transformedResponse.entities[billing_address.id] = {
                        ...billing_address,
                        address_type: "billing",
                    };
                }

                return billingShippingAdapter.setAll(
                    initialState,
                    Object.values(transformedResponse.entities)
                );
            },
            providesTags: (result) => {
                const defaultTags = [{ type: "BillingShipping", id: "LIST" }];
                if (!result || !result.ids || !result.ids.length) {
                    return defaultTags;
                }

                return [
                    ...defaultTags,
                    ...result.ids.map((id) => ({
                        type: "BillingShipping",
                        id,
                    })),
                ];
            },
        }),
        postBillingAddress: builder.mutation({
            query: (data) => {
                return {
                    url: "/create-billing-address",
                    method: "POST",
                    body: {
                        id: data.id,
                        address_type: data.address_type,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        street_address: data.street_address,
                        apt: data.apt,
                        city: data.city,
                        state: data.state,
                        zipcode: data.zipcode,
                    },
                };
            },
        }),
        updateBillingShippingAddress: builder.mutation({
            query: (data) => {
                // The spread operator and conditional checks ensure that only the fields with values are included in the request body. This aligns with the PATCH request's intent of updating only specified fields.
                return {
                    url: "edit-shipping-billing",
                    method: "PATCH",
                    body: {
                        id: data.id,
                        ...(data.address_type && {
                            address_type: data.address_type,
                        }),
                        ...(data.first_name && { first_name: data.first_name }),
                        ...(data.last_name && { last_name: data.last_name }),
                        ...(data.street_address && {
                            street_address: data.street_address,
                        }),
                        ...(data.apt && { apt: data.apt }),
                        ...(data.city && { city: data.city }),
                        ...(data.state && { state: data.state }),
                        ...(data.zipcode && { zipcode: data.zipcode }),
                    },
                };
            },
        }),
    }),
});

export const {
    useGetBillingShippingQuery,
    usePostBillingAddressMutation,
    useUpdateBillingShippingAddressMutation,
} = billingShippingApiSlice;
