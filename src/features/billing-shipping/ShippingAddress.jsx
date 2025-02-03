import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUsername } from "../auth/authSlice"; // Import selector
import {
    useGetBillingShippingQuery,
    useUpdateBillingShippingAddressMutation,
} from "./billingShippingApiSlice";
import AddressForm from "./AddressForm";

const ShippingAddress = ({ formData, onFormDataChange }) => {
    const username = useSelector(selectCurrentUsername); // Get username from Redux
    const isAuthenticated = !!username; // Check if user is logged in

    const {
        data: billingShipping,
        isLoading,
        isSuccess,
        isError,
    } = useGetBillingShippingQuery("getBillingShipping", {
        skip: !isAuthenticated,
    }); // Skip if not authenticated

    const [updateBillingShippingAddress] =
        useUpdateBillingShippingAddressMutation();

    console.log("Updated shipping formData", formData);

    useEffect(() => {
        if (isAuthenticated && isSuccess && billingShipping?.ids?.length > 0) {
            const id = billingShipping.ids[0];
            if (id !== undefined && billingShipping.entities[id]) {
                const shippingBilling = billingShipping.entities[id];
                const initialData = {
                    id: shippingBilling.id || "",
                    firstName: shippingBilling.first_name || "",
                    lastName: shippingBilling.last_name || "",
                    email: shippingBilling.customer_detail?.email || "",
                    streetAddress: shippingBilling.street_address || "",
                    apt: shippingBilling.apt || "",
                    city: shippingBilling.city || "",
                    state: shippingBilling.state || "",
                    zipcode: shippingBilling.zipcode || "",
                    isChecked: true,
                };
                onFormDataChange(initialData);
            } else {
                onFormDataChange({
                    id: "",
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
            }
        }
    }, [isAuthenticated, isSuccess, billingShipping, onFormDataChange]);

    // if (!isAuthenticated) {
    //     return <p>Please enter your shipping address.</p>; // Prevent API call for anonymous users
    // }

    return (
        <section>
            {isLoading ? (
                <p>Loading ...</p>
            ) : isError ? (
                <p>Error loading address data. Please try again later.</p>
            ) : (
                <>
                    {" "}
                    <h3>Shipping Address</h3>
                    <AddressForm
                        formData={formData}
                        onFormDataChange={onFormDataChange}
                        updateBillingShippingAddress={
                            updateBillingShippingAddress
                        }
                    />
                </>
            )}
        </section>
    );
};

ShippingAddress.propTypes = {
    formData: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        streetAddress: PropTypes.string,
        apt: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zipcode: PropTypes.string,
        isChecked: PropTypes.bool,
    }),
    onFormDataChange: PropTypes.func,
};

export default ShippingAddress;
