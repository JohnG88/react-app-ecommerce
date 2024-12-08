// import { useState } from "react";
import PropTypes from "prop-types";
import { useUpdateOrderItemMutation } from "./ordersApiSlice";
//import { ChevronDown, ChevronUp } from "../../icons";

const OrderItem = ({ item, deleteOrderItem }) => {
    // const [number, setNumber] = useState(item.quantity);

    const [updateOrderItem] = useUpdateOrderItemMutation();
    // const { refetch: refetchOrders } = useGetOrdersQuery();

    const quantityOptions = Array.from(
        { length: item.product_detail.quantity + 1 },
        (_, index) => index
    );

    // const onDeleteOrderItemClicked = async () => {
    //     try {
    //         await deleteOrderItem({ id: item.id }).unwrap();
    //         // Notify the parent component that an order item has been deleted
    //         onDeleteOrderItem(item.id);
    //     } catch (err) {
    //         console.error("Failed to delete the order item", err);
    //     }
    // };

    const handleNumberClick = async (quantity) => {
        try {
            const result = await updateOrderItem({
                id: item.id,
                quantity: quantity,
                orderId: item.order,
            }).unwrap();
            // setNumber(quantity);
        } catch (err) {
            // console.error("Failed to save the post", err);
        }
    };

    const onDeleteOrderItemClicked = async () => {
        try {
            await deleteOrderItem({
                id: item.id,
                orderId: item.order,
            }).unwrap();
        } catch (err) {
            // console.error("Failed to delete the post", err);
        }
    };

    //console.log("Number", number);

    // if (isLoading) return <p>Loading...</p>;

    // if (!item) {
    //     return (
    //         <section>
    //             <h2>Post not found!</h2>
    //         </section>
    //     );
    // }

    const dropDown = (
        <div className="dropdown">
            <button
                className="btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Quantity
            </button>
            <ul className="dropdown-menu compact-dropdown">
                {quantityOptions.map((quantity, index) => (
                    <li key={index}>
                        <p
                            className="dropdown-item"
                            onClick={() => {
                                console.log("quantity", quantity);
                                handleNumberClick(quantity);
                            }}
                        >
                            {quantity}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <article className="cart-item">
            <div className="item-details">
                <div>
                    <img
                        src={item.product_detail.image}
                        alt={item.product_detail.name}
                    />

                    <h4>{item.product_detail.name}</h4>

                    <h4 className="item-price">{item.product_detail.price}</h4>
                    <h5>{item.quantity}</h5>
                </div>

                <div>{dropDown}</div>
                <div>
                    <button
                        className="btn btn-danger"
                        onClick={onDeleteOrderItemClicked}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
};

OrderItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        product_detail: PropTypes.shape({
            image: PropTypes.string,
            name: PropTypes.string,
            price: PropTypes.string,
            quantity: PropTypes.number,
        }),
        order: PropTypes.number,
        quantity: PropTypes.number,
    }),
    deleteOrderItem: PropTypes.func,
};

export default OrderItem;
