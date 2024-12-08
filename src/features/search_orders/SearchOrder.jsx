import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetSearchOrderQuery } from "./searchApiSlice";

const SearchOrder = () => {
    const [formData, setFormData] = useState({
        email: "",
        orderNumber: "",
    });
    // const [order, setOrder] = useState();

    const { email, orderNumber } = formData;

    const [skip, setSkip] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const {
        data: searchOrder,
        isLoading,
        isSuccess,
        isError,
        error,
        // refetch,
    } = useGetSearchOrderQuery(formData, { skip: skip });

    console.log("searchOrder", searchOrder);

    console.log("email", email);
    console.log("orderNumber", orderNumber);

    const handleChange = (e) => {
        console.log("handleChange triggered");
        console.log("target name:", e.target.name);
        console.log("target value:", e.target.value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));

        if (formSubmitted) {
            setSkip(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("email", email);
        console.log("orderNumber", orderNumber);

        setFormSubmitted(true);
        setSkip(false);

        // refetch();

        // await getSearchOrder({
        //     email: email,
        //     orderNumber: orderNumber,
        // }).unwrap();
    };

    let content;
    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        const singleSearchedOrder = searchOrder.entities[searchOrder.ids[0]];
        console.log("single searched order", singleSearchedOrder);
        content = (
            <div>
                <div className="found-order-main-section">
                    <div>
                        <div className="found-order-main-div">
                            <div className="order-number-text-div">
                                <h2 className="order-number-text">
                                    Order Number {singleSearchedOrder.id}
                                </h2>
                            </div>
                            {singleSearchedOrder.order_items.map(
                                (order_item) => {
                                    return (
                                        <div
                                            key={order_item.id}
                                            className="found-order-loop-div"
                                        >
                                            <div className="found-order-header">
                                                <div className="header-order-details">
                                                    <div className="single-header-detail">
                                                        <div>
                                                            <span>
                                                                Ordered Placed
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                Date placed
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="single-header-detail">
                                                        <div>
                                                            <span>Total</span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                $
                                                                {(
                                                                    order_item.quantity *
                                                                    order_item
                                                                        .product_detail
                                                                        .price
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="single-header-detail">
                                                        <div>
                                                            <span>Ship To</span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {
                                                                    singleSearchedOrder.first_name
                                                                }{" "}
                                                                {
                                                                    singleSearchedOrder.last_name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="found-order-num-div">
                                                    <div className="single-header-detail">
                                                        <span>
                                                            Item Order Number
                                                        </span>
                                                    </div>
                                                    <div className="single-header-detail">
                                                        <span>
                                                            {order_item.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="found-order-details"
                                                key={order_item.id}
                                            >
                                                <img
                                                    className="order-found-img found-order-details-child"
                                                    src={
                                                        order_item
                                                            .product_detail
                                                            .image
                                                    }
                                                    alt={order_item.name}
                                                />
                                                <div className="found-order-details-child">
                                                    <h5>
                                                        {
                                                            order_item
                                                                .product_detail
                                                                .name
                                                        }
                                                    </h5>
                                                </div>
                                                <div className="found-order-details-child">
                                                    <h6>
                                                        {
                                                            order_item
                                                                .product_detail
                                                                .description
                                                        }
                                                    </h6>
                                                </div>
                                                <div className="found-order-details-child">
                                                    <h6>
                                                        Amount ordered:{" "}
                                                        {order_item.quantity}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                    {singleSearchedOrder.all_order_items_returned === true ? (
                        <>
                            <h5>All Items have been returned</h5>
                        </>
                    ) : (
                        <>
                            <Link
                                to={`/return-order/${singleSearchedOrder.id}`}
                            >
                                <button className="btn btn-primary">
                                    Return Order
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        );
    } else if (isError) {
        content = <h3>Searched order cannot be found.</h3>;
    }

    return (
        <>
            <div className="return-order-main-div">
                <h2>Search for Order to Return</h2>

                {/* {error ? (
                    <>Oh no, there was an error</>
                ) : isUninitialized ? (
                    <div>No Data yet</div>
                ) : isLoading ? (
                    <>loading...</>
                ) : searchOrder ? (
                    <>
                        <div>
                            <h3>{searchOrder.id}</h3>
                        </div>
                    </>
                ) : null} */}

                <div className="return-order-form-div">
                    <form
                        className="mt-5 return-order-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={email}
                                required
                            />
                        </div>
                        <div className="form-group search-order-number-div mt-3">
                            <label className="form-label" htmlFor="orderNumber">
                                Order Number
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="orderNumber"
                                onChange={handleChange}
                                value={orderNumber}
                                required
                            />
                        </div>
                        <div className="return-order-btn-div">
                            <button className="btn btn-primary">
                                Search for Order
                            </button>
                        </div>
                    </form>
                </div>
                {content}
            </div>
        </>
    );
};

export default SearchOrder;
