import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetOrdersQuery, ordersApiSlice } from "./ordersApiSlice";
import { useGetBillingShippingQuery } from "../billing-shipping/billingShippingApiSlice";

const OrderConfirmed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const prevLocation = useRef(location.pathname);

    // console.log("location", location);
    // console.log("prevLocation", prevLocation);

    // Fetch orders and billing/shipping data
    const {
        data: order,
        isLoading: ordersLoading,
        isSuccess: ordersSuccess,
        isError: ordersError,
    } = useGetOrdersQuery("getOrders");

    const {
        data: billingShipping,
        isLoading: billingShippingLoading,
        isSuccess: billingShippingSuccess,
        isError: billingShippingError,
    } = useGetBillingShippingQuery();

    // Handle navigation away from the component
    useEffect(() => {
        prevLocation.current = location.pathname;

        return () => {
            if (location.pathname !== prevLocation.current) {
                dispatch(ordersApiSlice.util.resetApiState());
            }
        };
    }, [location.pathname, dispatch]);

    let content;
    if (ordersLoading || billingShippingLoading) {
        content = <p>Loading ...</p>;
    } else if (ordersSuccess && billingShippingSuccess) {
        const singleOrder = order.entities[order.ids[0]];
        // console.log("single order confirmation page", singleOrder);
        // console.log("Billing/Shipping Info:", billingShipping);

        const shippingAddress = Object.values(billingShipping.entities).find(
            (address) => address.address_type === "shipping"
        );
        // console.log("shipping id", shippingAddress.id);

        content = (
            <div>
                <h3>Thank you for your purchase.</h3>
                Your Item(s) will be shipped to {
                    shippingAddress.street_address
                }{" "}
                Apt. {shippingAddress.apt ? `${shippingAddress.apt} ` : ""}
                {shippingAddress.zipcode}
                {singleOrder.order_items.map((item) => (
                    <div key={item.id}>
                        <article className="cart-item">
                            <div className="item-details">
                                <div>
                                    <img
                                        src={item.product_detail.image}
                                        alt={item.product_detail.name}
                                    />
                                    <h4>{item.product_detail.name}</h4>
                                    <h4 className="item-price">
                                        {item.product_detail.price}
                                    </h4>
                                    <h5>{item.quantity}</h5>
                                </div>
                            </div>
                        </article>
                    </div>
                ))}
                <footer>
                    <hr />
                    <div className="cart-total">
                        <h4>
                            total <span>${singleOrder.get_cart_total}</span>
                        </h4>
                    </div>
                </footer>
            </div>
        );
    } else if (ordersError || billingShippingError) {
        content = <h3 className="no-orders-found">No items in bag</h3>;
    }

    return (
        <section className="cart">
            <header>
                <h2>Your Bag</h2>
                {content}
            </header>
        </section>
    );
};

export default OrderConfirmed;
