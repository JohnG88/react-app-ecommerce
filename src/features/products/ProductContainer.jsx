import PropTypes from "prop-types";
import { useGetProductsQuery } from "./productsApiSlice";
import { Link } from "react-router-dom";

const ProductContainer = ({ productId }) => {
    const { product } = useGetProductsQuery("getProducts", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[productId],
        }),
    });

    return (
        <div key={product.id} className="single-product-div">
            <img
                src={product.image}
                className="home-page-product-img"
                alt={product.name}
            />
            <h1>{product.name}</h1>
            <p>{product.price}</p>
            {product.quantity === 0 ? (
                <badge className="bg bg-danger not-available-badge">
                    Not Available.
                </badge>
            ) : (
                <>
                    <Link
                        to={`/product/${product.id}`}
                        className="btn btn-primary"
                    >
                        Details
                    </Link>
                </>
            )}
        </div>
    );
};

ProductContainer.propTypes = {
    productId: PropTypes.number,
};

export default ProductContainer;
