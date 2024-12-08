import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetProductsByIdQuery,
    useAddNewProductMutation,
} from "./productsApiSlice";

const SingleProductPage = () => {
    const { Id } = useParams();
    const navigate = useNavigate();

    const [number, setNumber] = useState("");
    const [componentError, setComponentError] = useState("");

    const [addNewProduct] = useAddNewProductMutation();

    const {
        data: item,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetProductsByIdQuery(Id);

    const onNumberChange = (e) => setNumber(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const quantity = parseInt(number, 10);
            if (isNaN(quantity) || quantity > item.quantity) {
                setComponentError(
                    `Item quantity cannot exceed ${item.quantity}`
                );
                return;
            }
            await addNewProduct({ Id, number }).unwrap();
            setNumber("");
            navigate("/order");
        } catch (err) {
            // console.log("Failed to save the product", err);
        }
    };

    let content;

    if (isLoading) {
        content = <p>Loading ...</p>;
    } else if (isSuccess) {
        content = (
            <section>
                <div className="detail-page-product-div">
                    <div>
                        <img
                            src={item.image}
                            className="detail-page-img"
                            alt={item.name}
                        />
                    </div>
                    <div className="details-form-div">
                        <h2>{item.name}</h2>
                        <p>${item.price}</p>
                        <p>{item.description}</p>
                        {item.quantity === 0 ? (
                            <badge className="bg bg-danger not-available-badge">
                                Not Available.
                            </badge>
                        ) : (
                            <>
                                <form
                                    onSubmit={handleSubmit}
                                    className="detail-page-qty-form"
                                >
                                    {componentError && (
                                        <div
                                            style={{
                                                color: "red",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            {componentError}
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            onChange={onNumberChange}
                                            min={0}
                                            max={item.quantity}
                                        />
                                    </div>
                                    <div className="detail-qty-btn-div">
                                        <button
                                            className="detail-page-qty-btn btn btn-warning"
                                            type="submit"
                                            // disabled={isButtonDisabled}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content;
};

export default SingleProductPage;
