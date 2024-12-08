import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const orderAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = orderAdapter.getInitialState();

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => "/order",
            transformResponse: (response) => {
                const result = orderAdapter.addOne(initialState, response);
                // console.log("order result", result);
                return result;
            },
            providesTags: (result) => {
                const defaultTags = [{ type: "Order", id: "LIST" }];

                if (!result) {
                    return defaultTags;
                }

                const resultIds = result.ids;

                if (
                    !resultIds ||
                    !Array.isArray(resultIds) ||
                    resultIds.length === 0
                ) {
                    return defaultTags;
                }

                return [
                    ...defaultTags,
                    ...resultIds.map((id) => ({ type: "Order", id })),
                ];
            },

            // providesTags: (result) => [
            //     { type: "Order", id: "LIST" },
            //     ...result.ids.map((id) => ({ type: "Order", id })),
            // ],

            // cachePolicy: {
            //     strategy: "cache-and-network",
            //     invalidateTags: [{ type: "Order", id: "List" }],
            // },
            // invalidateTags: [{ type: "Order", id: "List" }],
        }),
        submitOrder: builder.mutation({
            query: (data) => {
                // console.log("payment", data.payment_method_id);
                // console.log("orderApiSLice first_name", data.first_name);

                return {
                    url: "/submit-order",
                    method: "POST",
                    body: {
                        payment_method_id: data.payment_method_id,
                        id: data.id,
                        address_type: data.address_type,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        street_address: data.street_address,
                        apt: data.apt,
                        city: data.city,
                        state: data.state,
                        zipcode: data.zipcode,
                        is_checked: data.is_checked,
                        total_with_tax: data.total_with_tax,
                    },
                };
            },
            async onQueryStarted({ orderId }, { dispatch, queryFulFilled }) {
                const postResult = dispatch(
                    ordersApiSlice.util.updateQueryData(
                        "getOrders",
                        "getOrders",
                        (draft) => {
                            // console.log("submit order id", orderId);
                            const order = draft.entities[orderId];
                            // console.log("slice submit order", order);
                            order.complete = true;
                        }
                    )
                );
                try {
                    await queryFulFilled;
                } catch {
                    postResult.undo();
                }
            },
        }),
        updateOrderItem: builder.mutation({
            query: (data) => {
                return {
                    url: `/update-order-item/${data.id}`,
                    method: "PATCH",
                    body: {
                        quantity: data.quantity,
                    },
                };
            },
            async onQueryStarted(
                { id, quantity, orderId },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    ordersApiSlice.util.updateQueryData(
                        "getOrders",
                        "getOrders",
                        (draft) => {
                            const order = draft.entities[orderId];
                            // if (order) {}
                            const orderItem = order.order_items.find(
                                (item) => item.id === id
                            );

                            orderItem.quantity = quantity;

                            const parseGetCartTotal = parseFloat(
                                order.get_cart_total
                            );

                            const parseGetTotal = parseFloat(
                                orderItem.get_total
                            );

                            const fullOrderDifference =
                                parseGetCartTotal - parseGetTotal;

                            const newOrderItemPrice =
                                orderItem.quantity *
                                parseFloat(orderItem.product_detail.price);

                            order.get_cart_total = (
                                fullOrderDifference +
                                orderItem.quantity *
                                    parseFloat(orderItem.product_detail.price)
                            ).toFixed(2);

                            orderItem.get_total = newOrderItemPrice;
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            // invalidatesTags: (result, error, arg) => [
            //     { type: "Order", id: arg.orderId },
            // ],
        }),
        deleteOrderItem: builder.mutation({
            query: ({ id }) => ({
                url: `/delete-order-item/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(
                { id, orderId },
                { dispatch, queryFulfilled }
            ) {
                const deleteResult = dispatch(
                    ordersApiSlice.util.updateQueryData(
                        "getOrders",
                        "getOrders",
                        (draft) => {
                            const order = draft.entities[orderId];

                            const orderItemRemoved = order.order_items.find(
                                (item) => item.id === id
                            );

                            // console.log(
                            //     "get cart total delete",
                            //     order.get_cart_total
                            // );
                            // console.log(
                            //     "get total delete",
                            //     orderItemRemoved.get_total
                            // );

                            order.get_cart_total = (
                                parseFloat(order.get_cart_total) -
                                parseFloat(orderItemRemoved.get_total)
                            ).toFixed(2);

                            const updatedOrder = order.order_items.filter(
                                (item) => item.id !== id
                            );

                            order.order_items = updatedOrder;
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    deleteResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useSubmitOrderMutation,
    useUpdateOrderItemMutation,
    useDeleteOrderItemMutation,
} = ordersApiSlice;
