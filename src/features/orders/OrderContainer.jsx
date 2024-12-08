//import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Order from "./Order";
import { useGetOrdersQuery } from "./ordersApiSlice";

const OrderContainer = () => {
    const {
        data: order,
        isLoading,
        isSuccess,
        isError,
    } = useGetOrdersQuery("getOrders");

    // console.log("Order", order);

    // const [deleteOrderItem] = useDeleteOrderItemMutation();

    // const handleDeleteOrderItem = async (deletedItemId) => {
    //     try {
    //         // Perform the optimistic update - send the delete request to the server
    //         await deleteOrderItem({ id: deletedItemId });

    //         // The deletion was successful on the server
    //         // No need to do anything here as the local state has already been updated
    //     } catch (err) {
    //         console.error("Failed to delete the order item", err);
    //         // If there's an error, you may want to handle it, for example, by rolling back the optimistic update
    //         // For simplicity, you can also leave it as is and let the user know there was an issue
    //     }
    // };

    let content;
    if (isLoading) {
        content = <p>Loading ...</p>;
    } else if (isSuccess) {
        const singleOrder = order.entities[order.ids[0]];

        if (singleOrder.complete === true) {
            content = <h3 className="no-orders-found">No items in bag</h3>;
        } else {
            content = (
                <div>
                    <div>
                        {order.ids.map((itemId) => (
                            <Order key={itemId} itemId={itemId} />
                        ))}
                    </div>

                    <footer>
                        <hr />{" "}
                        <Link to={`/submit-order/${order.ids}`}>Checkout</Link>
                        <div className="cart-total">
                            <h4>
                                total <span>${singleOrder.get_cart_total}</span>
                            </h4>
                        </div>
                    </footer>
                </div>
            );
        }
    } else if (isError) {
        content = <h3 className="no-orders-found">No items in bag</h3>;
    }

    return (
        <section className="cart">
            <header>
                <h2>your bag</h2>
                {content}
            </header>
        </section>
    );
};

export default OrderContainer;
