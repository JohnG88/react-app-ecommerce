import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const AddressForm = ({
    formData,
    onFormDataChange,
    updateBillingShippingAddress,
}) => {
    const [editCheck, setEditCheck] = useState(false);
    const firstNameRef = useRef(null);

    const {
        firstName = "",
        lastName = "",
        email = "",
        streetAddress = "",
        apt = "",
        city = "",
        state = "",
        zipcode = "",
        isChecked = true,
    } = formData;

    const handleChange = (e) => {
        onFormDataChange({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        onFormDataChange({ ...formData, isChecked: e.target.checked });
    };

    // const clickEditButton = (e) => {
    //     e.preventDefault();
    //     if (!editCheck) {
    //         setEditCheck(true);
    //     } else {
    //         setEditCheck(false);
    //     }
    // };

    const clickEditButton = (e) => {
        e.preventDefault();
        setEditCheck((prev) => !prev);
    };

    const handleShippingEdit = async (e) => {
        e.preventDefault();

        try {
            await updateBillingShippingAddress({
                id: formData.id,
                address_type: "shipping",
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                street_address: formData.streetAddress,
                apt: formData.apt,
                city: formData.city,
                state: formData.state,
                zipcode: formData.zipcode,
            }).unwrap();
        } catch (err) {
            console.log("Shipping info error", err);
        }
    };

    const handleConfirmEditClick = async (e) => {
        e.preventDefault();
        await handleShippingEdit(e);
        clickEditButton(e);
    };

    useEffect(() => {
        if (editCheck) {
            firstNameRef.current?.focus();
        }
    }, [editCheck]);

    return (
        <section>
            <form className="submit-order-form">
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
                        onChange={handleChange}
                        value={firstName}
                        required
                        // placeholder={content.first_name}
                        // disabled={!formEditable}
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
                        onChange={handleChange}
                        value={lastName}
                        required
                        // disabled={!formEditable}
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
                        onChange={handleChange}
                        value={email}
                        required
                        // disabled={!formEditable}
                    />
                </div>
                <div className="form-group mt-3">
                    <label className="form-label" htmlFor="streetAddress">
                        Street Address
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        name="streetAddress"
                        onChange={handleChange}
                        value={streetAddress}
                        required
                        // disabled={!formEditable}
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
                        onChange={handleChange}
                        value={apt}
                        required
                        // disabled={!formEditable}
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
                        onChange={handleChange}
                        value={city}
                        required
                        // disabled={!formEditable}
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
                        onChange={handleChange}
                        value={state}
                        required
                        // disabled={!formEditable}
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
                        onChange={handleChange}
                        value={zipcode}
                        required
                        // disabled={!formEditable}
                    />
                </div>

                <div>
                    {" "}
                    <span className="billing-span-text">
                        Is Billing the same as Shipping
                    </span>
                </div>
                <div>
                    <label className="checkbox-label-1">
                        <input
                            type="checkbox"
                            name="checkboxBilling"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="large-checkbox"
                        />
                        <span className="checkmark-2"></span>
                    </label>
                </div>

                {editCheck ? (
                    <button
                        className="btn btn-warning"
                        onClick={handleConfirmEditClick}
                    >
                        Confirm Edit
                    </button>
                ) : (
                    <button
                        className="btn btn-warning"
                        onClick={clickEditButton}
                    >
                        Edit Shipping Address
                    </button>
                )}

                {/* <button>Submit Order</button> */}
            </form>
        </section>
    );
};

AddressForm.propTypes = {
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
    updateBillingShippingAddress: PropTypes.func,
};

export default AddressForm;
