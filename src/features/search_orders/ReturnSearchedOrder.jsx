import { useState } from "react";
import {
    useGetReturnSearchOrderQuery,
    useSubmitReturnOrderMutation,
} from "../returningOrders/returningOrderApiSlice";
import { useParams } from "react-router-dom";

const ReturnSearchOrder = () => {
    const { orderId } = useParams();
    const [submitReturnOrder] = useSubmitReturnOrderMutation();
    const [returningData, setReturningData] = useState([]);
    // const [availableReturnAmount, setAvailableReturnAmount] = useState(0);

    // console.log("return order page id", orderId);

    const {
        data: order,
        isLoading,
        isSuccess,
        isError,
    } = useGetReturnSearchOrderQuery({ id: orderId });

    // console.log("Order", order);

    const handleAmountChange = (orderItemId, value) => {
        // console.log("handleAmountChange called with: ", orderItemId, value);
        // Check if order item is already in array
        const existingItemIndex = returningData.findIndex(
            (item) => item.order_item_id === orderItemId
        );

        if (value === 0) {
            // Remove the item from returningData if the value is "0"
            if (existingItemIndex !== -1) {
                const updatedItems = [...returningData];
                updatedItems.splice(existingItemIndex, 1);
                setReturningData(updatedItems);
            }
        } else {
            if (existingItemIndex !== -1) {
                const updatedItems = [...returningData];
                updatedItems[existingItemIndex].item_amount_returning = value;
                setReturningData(updatedItems);
            } else {
                // If the item doesn't exist add it to the array
                setReturningData((prevReturningData) => [
                    ...prevReturningData,
                    {
                        order_item_id: orderItemId,
                        item_amount_returning: value,
                    },
                ]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (returningData.length === 0) {
            // console.log(
            //     "No data has been entered. Please fill in the input fields."
            // );
            return;
        }

        let isValidationError = false; // Track if any validation error occurred

        for (const order_item of order.entities[orderId].order_items) {
            const item = returningData.find(
                (item) => item.order_item_id === order_item.id
            );
            const returnQuantity = item
                ? parseInt(item.item_amount_returning)
                : 0;
            const availableQuantity =
                order_item.quantity - order_item.item_amount_returning;

            if (returnQuantity > availableQuantity) {
                isValidationError = true;
            }
        }

        if (!isValidationError) {
            try {
                // console.log("returning data", returningData);
                const response = await submitReturnOrder({
                    // id: order.entities[orderId].id,
                    id: orderId,
                    order_items: returningData,
                }).unwrap();
                // console.log("partial return order data", response);
                // Handle success response here
                resetReturningData();
                // setReturningData("");
            } catch (error) {
                // console.log("Error", error);
                // Handle error response here
            }
        }
        // } else {
        //     console.log(
        //         "Validation error: Amount exceeds the available items you can return."
        //     );
        // }
    };

    // Function to reset the returningData
    const resetReturningData = () => {
        const resetData = returningData.map((item) => ({
            ...item,
            item_amount_returning: "",
        }));
        setReturningData(resetData);
    };

    let content;
    if (isLoading) {
        content = <p>Loading ...</p>;
    } else if (isSuccess) {
        const returningOrder = order.entities[order.ids[0]];
        // console.log("returning order", returningOrder);
        content = (
            <div>
                <div className="main-order-return-form-div">
                    {returningOrder.order_items.map((order_item) => {
                        {
                            /* console.log("Initial order_item.id:", order_item.id);
                        console.log(
                            "Initial order_item.item_amount_returning:",
                            order_item.item_amount_returning
                        ); */
                        }

                        return (
                            <div
                                key={order_item.id}
                                className="order-details-div"
                            >
                                <img
                                    src={order_item.product_detail.image}
                                    className="return-order-img order-details-div-child"
                                    alt={order_item.product_detail.name}
                                />
                                <div className="order-details-div-child">
                                    <h4>{order_item.product_detail.name}</h4>
                                </div>
                                <div className="order-details-div-child">
                                    <h5>Amount ordered </h5>
                                    <p> {order_item.quantity}</p>
                                </div>
                                <div>
                                    <h5>Available to Return</h5>
                                    <p>
                                        {order_item.quantity -
                                            order_item.item_amount_returning}
                                    </p>
                                </div>
                                {order_item.all_items_returned === true ? (
                                    <div className="order-details-div-child">
                                        <button className="btn btn-warning">
                                            All items have been returned.
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="return-input order-details-div-child specific-order-details-div">
                                            <input
                                                className="return-qty-input"
                                                type="number"
                                                placeholder="Qty to Return"
                                                value={
                                                    returningData.find(
                                                        (item) =>
                                                            item.order_item_id ===
                                                            order_item.id
                                                    )?.item_amount_returning ||
                                                    ""
                                                }
                                                max={
                                                    order_item.quantity -
                                                    order_item.item_amount_returning
                                                }
                                                min={0}
                                                onChange={(e) =>
                                                    handleAmountChange(
                                                        order_item.id,
                                                        Math.min(
                                                            e.target.value,
                                                            order_item.quantity -
                                                                order_item.item_amount_returning
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}{" "}
                    {returningOrder.all_order_items_returned === false ? (
                        <div className="return-btn-div">
                            <button
                                className="btn btn-primary return-order-btn"
                                onClick={handleSubmit}
                            >
                                Submit Request
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        );
    } else if (isError) {
        content = <h3>Searched order cannot be found.</h3>;
    }

    return <div>{content}</div>;
};

export default ReturnSearchOrder;
