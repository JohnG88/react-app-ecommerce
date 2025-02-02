import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import {
    useGetBillingShippingQuery,
    usePostBillingAddressMutation,
    useUpdateBillingShippingAddressMutation,
} from "./billingShippingApiSlice";

const BillingAddressModal = ({
    isOpen,
    onClose,
    formData,
    onFormDataChange,
}) => {
    const {
        data: billingShipping,
        isLoading,
        isSuccess,
        isError,
    } = useGetBillingShippingQuery("getBillingShipping");

    const [postBillingAddress] = usePostBillingAddressMutation();
    const [updateBillingShippingAddress] =
        useUpdateBillingShippingAddressMutation();

    const [initialized, setInitialized] = useState(false);
    const [editCheck, setEditCheck] = useState(false);

    const firstNameRef = useRef(null);

    console.log("billingAddress formData", formData);

    useEffect(() => {
        console.log("Updated formData", formData);
    }, [formData]);

    useEffect(() => {
        if (editCheck) {
            firstNameRef.current?.focus();
        }
    }, [editCheck]);

    useEffect(() => {
        console.log("Billing address");

        if (!initialized && isSuccess) {
            if (
                billingShipping &&
                Object.values(billingShipping.entities).length > 0
            ) {
                const billingAddress = Object.values(
                    billingShipping.entities
                ).find((address) => address.address_type === "billing");
                if (billingAddress) {
                    const initialData = {
                        id: billingAddress.id || "",
                        firstName: billingAddress.first_name || "",
                        lastName: billingAddress.last_name || "",
                        email: billingAddress.customer_detail.email || "",
                        streetAddress: billingAddress.street_address || "",
                        apt: billingAddress.apt || "",
                        city: billingAddress.city || "",
                        state: billingAddress.state || "",
                        zipcode: billingAddress.zipcode || "",
                    };
                    onFormDataChange(initialData);
                } else {
                    // Handle case where billingAddress is not found
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
                    });
                }
            } else {
                // Handle case where no billing address data is available
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
                });
            }
            setInitialized(true);
        }
    }, [initialized, isSuccess, billingShipping, onFormDataChange]);

    if (!isOpen) return null;

    const clickEditButton = (e) => {
        e.preventDefault();
        setEditCheck((prev) => !prev);
    };

    const handleBillingEdit = async (e) => {
        e.preventDefault();

        try {
            updateBillingShippingAddress({
                id: formData.id,
                address_type: "billing",
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                street_address: formData.streetAddress,
                apt: formData.apt,
                city: formData.city,
                state: formData.state,
                zipcode: formData.zipcode,
            }).unwrap();
            onClose();
        } catch (err) {
            console.log("Billing info error", err);
        }
    };

    const handleSubmitBillingAddress = async (e) => {
        e.preventDefault();
        try {
            const billingInfo = await postBillingAddress({
                id: formData.id,
                address_type: "billing",
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                street_address: formData.streetAddress,
                apt: formData.apt,
                city: formData.city,
                state: formData.state,
                zipcode: formData.zipcode,
            }).unwrap();
            // console.log("Billing address updated successfully", billingInfo);
            onClose();
        } catch (err) {
            // console.error("Error updating billing address:", err);
        }
    };

    // const isFormDataEmpty = Object.values(formData).every(
    //     (value) => value === ""
    // );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    X
                </button>
                <section>
                    <form
                        className="submit-order-form"
                        onSubmit={handleSubmitBillingAddress}
                    >
                        <div className="form-group">
                            <label className="form-label" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                className="form-control"
                                type="text"
                                name="firstName"
                                ref={firstNameRef}
                                value={formData.firstName}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        firstName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        lastName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label
                                className="form-label"
                                htmlFor="streetAddress"
                            >
                                Street Address
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        streetAddress: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="apt">
                                Apt
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="apt"
                                value={formData.apt}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        apt: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="city">
                                City
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        city: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label" htmlFor="state">
                                State
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        state: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="form-group mt-3 mb-4">
                            <label className="form-label" htmlFor="zipcode">
                                Zipcode
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={(e) =>
                                    onFormDataChange({
                                        ...formData,
                                        zipcode: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        {!formData.id ? (
                            <button className="btn btn-warning" type="submit">
                                Submit Billing Address
                            </button>
                        ) : editCheck ? (
                            <button
                                className="btn btn-warning"
                                onClick={handleBillingEdit}
                            >
                                Confirm Edit
                            </button>
                        ) : (
                            <button
                                className="btn btn-warning"
                                onClick={clickEditButton}
                            >
                                Edit Billing Address
                            </button>
                        )}
                    </form>
                </section>
            </div>
        </div>
    );
};

BillingAddressModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
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
    }).isRequired,
    onFormDataChange: PropTypes.func.isRequired,
};

export default BillingAddressModal;
