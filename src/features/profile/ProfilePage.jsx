import { useState } from "react";
import { useGetProfileQuery } from "./profileApiSlice";

const ProfilePage = () => {
    const {
        data: profileData,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetProfileQuery();

    // Log profileData to check its structure
    // console.log("profileData", profileData);

    // Extract customer and orders from state
    const customer =
        profileData?.customer?.entities[profileData?.customer?.ids[0]] || null;
    const orders = profileData?.orders?.entities || {};

    const [visibleOrdersCount, setVisibleOrdersCount] = useState(5);

    const handleShowMore = () => {
        setVisibleOrdersCount((prevCount) => prevCount + 5);
    };

    let content;

    if (isLoading) {
        content = <p>Loading ...</p>;
    } else if (isSuccess) {
        const visibleOrders = Object.values(orders).slice(
            0,
            visibleOrdersCount
        );

        content = (
            <div className="profile-page">
                {/* {customer ? (
                    <div className="customer-info">
                        <h2>Customer</h2>
                        <p>
                            <strong>ID:</strong> {customer.id}
                        </p>
                        <p>
                            <strong>Name:</strong> {customer.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {customer.email}
                        </p>
                        <p>
                            <strong>Device:</strong> {customer.device}
                        </p>
                        <p>
                            <strong>User ID:</strong> {customer.user?.id}
                        </p>
                        <p>
                            <strong>Username:</strong> {customer.user?.username}
                        </p>
                        <p>
                            <strong>User Email:</strong> {customer.user?.email}
                        </p>
                    </div>
                ) : (
                    <p className="no-data">No customer data available</p>
                )} */}

                <h2>Order History</h2>
                {visibleOrders.length > 0 ? (
                    <div className="orders-container">
                        {visibleOrders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <h5>Order # {order.id}</h5>
                                    <p>
                                        <strong>Total:</strong> $
                                        {order.get_cart_total}
                                    </p>
                                    <p>
                                        <strong>Shipped To:</strong>{" "}
                                        {order.first_name} {order.last_name}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                            order.date_ordered
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="card-body">
                                    <div className="order-items">
                                        {order.order_items.map((o) => (
                                            <div
                                                key={o.id}
                                                className="profile-order-item"
                                            >
                                                <img
                                                    src={o.product_detail.image}
                                                    alt={o.product_detail.name}
                                                    className="profile-product-image"
                                                />
                                                <div className="profile-product-details">
                                                    <p>
                                                        <strong>
                                                            Product:
                                                        </strong>{" "}
                                                        {o.product_detail.name}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Description:
                                                        </strong>{" "}
                                                        {
                                                            o.product_detail
                                                                .description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No orders available</p>
                )}

                {visibleOrdersCount < Object.values(orders).length && (
                    <button className="show-more-btn" onClick={handleShowMore}>
                        Show More
                    </button>
                )}
            </div>
        );
    } else if (isError) {
        content = <p className="no-data">{JSON.stringify(error)}</p>;
    }

    return <div className="profile-content">{content}</div>;
};

export default ProfilePage;
