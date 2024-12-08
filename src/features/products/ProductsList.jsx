import ProductContainer from "./ProductContainer";
import { useGetProductsQuery } from "./productsApiSlice";

const ProductsList = () => {
    const {
        data: products,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetProductsQuery("getProducts");

    let content;
    if (isLoading) {
        content = <p>Loading ...</p>;
    } else if (isSuccess) {
        content = (
            <div className="home-page-div">
                <section className="all-product-div">
                    {products.ids.map((productId) => (
                        <ProductContainer
                            key={productId}
                            productId={productId}
                        />
                    ))}
                </section>
            </div>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }
    return content;
};

export default ProductsList;
