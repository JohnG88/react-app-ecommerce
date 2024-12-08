import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import {
    useGetBillingShippingQuery,
    useUpdateBillingShippingAddressMutation,
} from "./billingShippingApiSlice";
import AddressForm from "./AddressForm";

const ShippingAddress = ({ formData, onFormDataChange }) => {
    const {
        data: billingShipping,
        isLoading,
        isSuccess,
        isError,
    } = useGetBillingShippingQuery("getBillingShipping");

    const [initialized, setInitialized] = useState(false);

    const [updateBillingShippingAddress] =
        useUpdateBillingShippingAddressMutation();

    // console.log("billingShipping", billingShipping);

    useEffect(() => {
        if (!initialized && isSuccess) {
            if (billingShipping && billingShipping.ids.length > 0) {
                const id = billingShipping.ids[0];
                if (id !== undefined && billingShipping.entities[id]) {
                    const shippingBilling = billingShipping.entities[id];
                    const initialData = {
                        id: shippingBilling.id || "",
                        firstName: shippingBilling.first_name || "",
                        lastName: shippingBilling.last_name || "",
                        email: shippingBilling.customer_detail.email || "",
                        streetAddress: shippingBilling.street_address || "",
                        apt: shippingBilling.apt || "",
                        city: shippingBilling.city || "",
                        state: shippingBilling.state || "",
                        zipcode: shippingBilling.zipcode || "",
                        isChecked: true,
                    };
                    onFormDataChange(initialData);
                } else {
                    // Handle case where the id exists but no entity is found
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
            } else {
                // Handle case where no address data is available
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
            setInitialized(true);
        }
    }, [
        initialized,
        isSuccess,
        billingShipping,
        isLoading,
        isError,
        onFormDataChange,
    ]);

    let content;
    if (isLoading) {
        content = <p>Loading ...</p>;
    } else if (isError) {
        content = <p>Error loading address data. Please try again later.</p>;
    } else {
        content = (
            <AddressForm
                formData={formData}
                onFormDataChange={onFormDataChange}
                updateBillingShippingAddress={updateBillingShippingAddress}
            />
        );
    }

    return <section>{content}</section>;
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
