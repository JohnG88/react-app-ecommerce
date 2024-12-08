import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const returnOrderAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localCompare(a.date),
});

const initialState = returnOrderAdapter.getInitialState();

export const returnSearchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReturnSearchOrder: builder.query({
            query: (data) => {
                console.log("return data id", data.id);
                return `return-partial-order/${data.id}`;
            },
            transformResponse(response) {
                return returnOrderAdapter.addOne(initialState, response);
            },
        }),
        submitReturnOrder: builder.mutation({
            query: (data) => {
                return {
                    url: `return-partial-order/${data.id}`,
                    method: "PATCH",
                    body: { order_items: data.order_items },
                };
            },
            async onQueryStarted(
                { id, order_items },
                { dispatch, queryFulfilled }
            ) {
                // console.log("Order ID:", id);
                // console.log("Order Items:", order_items);
                // Iterate through the order_items array and log each order_item_id
                // order_items.forEach((item, index) => {
                //     console.log(`Order Item ${index} Id:`, item.order_item_id);
                // });
                // console.log("Before dispatching updateQueryData");

                const returnedOrderResult = dispatch(
                    returnSearchApiSlice.util.updateQueryData(
                        "getReturnSearchOrder",
                        { id }, // Passing the argument needed for the cache update
                        (draft) => {
                            // Log at the start of the updateQueryData callback
                            // console.log("Inside updateQueryData callback");

                            const order = draft.entities[id];
                            // console.log("Splice submit order", order);

                            if (!order) {
                                // console.log("Order not found in draft");
                                return;
                            }

                            // Iterate through the order_items array
                            order_items.forEach((item) => {
                                const orderItem = order.order_items.find(
                                    (orderItem) =>
                                        orderItem.id === item.order_item_id
                                );
                                // console.log(
                                //     "Splice submit order item",
                                //     orderItem
                                // );

                                orderItem.item_amount_returning =
                                    orderItem.item_amount_returning +
                                    item.item_amount_returning;

                                // orderItem.item_amount_returning =
                                //     orderItem.quantity -
                                //     item.item_amount_returning;

                                if (
                                    orderItem &&
                                    orderItem.item_amount_returning ===
                                        orderItem.quantity
                                ) {
                                    orderItem.all_items_returned = true;
                                }
                                // } else {
                                //     console.log(
                                //         `Order item with id ${item.order_item_id} not found`
                                //     );
                                // }
                            });
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    returnedOrderResult.undo();
                }
            },
        }),
    }),
});

export const { useGetReturnSearchOrderQuery, useSubmitReturnOrderMutation } =
    returnSearchApiSlice;
