import { useState, useEffect } from "react";

import { selectCurrentUsername } from "../auth/authSlice";
import { useSelector } from "react-redux";

import {
    useGetOrdersQuery,
    useSubmitOrderMutation,
    useDeleteOrderItemMutation,
} from "./ordersApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import ShippingAddress from "../billing-shipping/ShippingAddress";
import BillingAddressModal from "../billing-shipping/BillingAddressModal";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const SubmitOrder = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const username = useSelector(selectCurrentUsername);

    const [submitOrder, { isLoading }] = useSubmitOrderMutation();
    const [deleteOrderItem] = useDeleteOrderItemMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const [formData, setFormData] = useState({
        id: null,

        firstName: "",
        lastName: "",
        email: "",
        streetAddress: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
        isChecked: true,
    });

    const [billingFormData, setBillingFormData] = useState({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        streetAddress: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
    });

    const {
        id,
        firstName,
        lastName,
        email,
        streetAddress,
        apt,
        city,
        state,
        zipcode,
        isChecked,
    } = formData;

    const {
        billingId,
        billingFirstName,
        billingLastName,
        billingEmail,
        billingStreetAddress,
        billingApt,
        billingCity,
        billingState,
        billingZipcode,
    } = billingFormData;

    useEffect(() => {
        if (!isChecked) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }, [isChecked]);

    const { item } = useGetOrdersQuery("getOrders", {
        selectFromResult: ({ data }) => ({
            item: data?.entities[orderId],
        }),
    });

    if (!item) {
        return (
            <section>
                <h2>Order not found!</h2>
            </section>
        );
    }

    // console.log("formData", formData);

    const handleFormDataChange = (newFormData) => {
        // console.log("New form data:", newFormData);
        // setFormData(newFormData);

        // Ensure id is a number
        const updatedFormData = {
            ...newFormData,
            id:
                newFormData.id !== undefined
                    ? Number(newFormData.id)
                    : formData.id,
        };
        // console.log("New form data:", updatedFormData);
        setFormData(updatedFormData);
    };

    const handleBillingFormDataChange = (newFormData) => {
        setBillingFormData((prevFormData) => ({
            ...prevFormData,
            ...newFormData,
        }));
    };

    const handleSubmitOrder = async () => {
        const card = elements.getElement(CardElement);

        try {
            const { paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: card,
            });
            // console.log("payment id", paymentMethod);
            // console.log("firstName", firstName);
            // console.log("Form data before submitOrder:", formData);
            const inputInfo = await submitOrder({
                payment_method_id: paymentMethod.id,
                id: id,
                address_type: "shipping",
                first_name: firstName,
                last_name: lastName,
                email: email,
                street_address: streetAddress,
                apt: apt,
                city: city,
                state: state,
                zipcode: zipcode,
                is_checked: isChecked,
                total_with_tax: item.get_cart_total,
                orderId: orderId,
            }).unwrap();

            navigate("/order-confirmed");
        } catch (err) {
            // console.log("Error", err);
        }
    };

    return (
        <article>
            <BillingAddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={billingFormData}
                onFormDataChange={handleBillingFormDataChange}
            />
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

            <ShippingAddress
                formData={formData}
                onFormDataChange={handleFormDataChange}
            />

            <div className="form-group pt-3 mb-4">
                <CardElement id="card-element" />
            </div>

            <button className="btn btn-warning" onClick={handleSubmitOrder}>
                Submit Order
            </button>
        </article>
    );
};

export default SubmitOrder;
