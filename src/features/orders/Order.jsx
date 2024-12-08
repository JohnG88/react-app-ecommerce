import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import {
    useGetOrdersQuery,
    useDeleteOrderItemMutation,
} from "./ordersApiSlice";

const Order = ({ itemId }) => {
    const [deleteOrderItem] = useDeleteOrderItemMutation();

    const { item } = useGetOrdersQuery("getOrders", {
        selectFromResult: ({ data }) => ({
            item: data?.entities[itemId],
        }),
    });

    // useGetOrdersQuery("getOrderItems")

    // if (isLoading) return <p>Loading ...</p>;

    if (!item) {
        return (
            <section>
                <h2>Order not found!</h2>
            </section>
        );
    }

    // let content;
    // if (isLoading) {
    //     content = <p>Loading ...</p>;
    // } else if (isSuccess) {
    //     content = (
    //         <article>
    //             {item.order_items.map((item) => (
    //                 <OrderItem key={item.id} item={item} />
    //             ))}
    //         </article>
    //     );
    // } else if (isError) {
    //     content = <p>{JSON.stringify(error)}</p>;
    // }

    // return content;

    return (
        <article>
            {item.order_items && item.order_items.length > 0 ? (
                item.order_items.map((orderItem) => (
                    <OrderItem
                        key={orderItem.id}
                        item={orderItem}
                        deleteOrderItem={deleteOrderItem}
                    />
                ))
            ) : (
                <h3 className="no-orders-found">No items in you bag.</h3>
            )}
            <h5>{item.get_cart_total}</h5>
        </article>
    );

    // return (
    //     <article>
    //         {item.order_items.map((item) => (
    //             <OrderItem
    //                 key={item.id}
    //                 item={item}
    //                 deleteOrderItem={deleteOrderItem}
    //             />
    //         ))}
    //     </article>
    // );
};

Order.propTypes = {
    itemId: PropTypes.number,
};

export default Order;
