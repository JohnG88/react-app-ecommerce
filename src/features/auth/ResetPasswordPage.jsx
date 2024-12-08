import { useState } from "react";
import { useResetPasswordMutation } from "./authApiSlice";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [resetPassword, { isLoading, isSuccess, isError }] =
        useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous error message before submission
        setErrorMessage("");

        try {
            await resetPassword(email).unwrap();
            setEmail("");
        } catch (err) {
            // console.error("Failed to reset password: ", err);

            // Extract error message from response
            if (err.status == 400 && err.data && err.data.email) {
                setErrorMessage(err.data.email[0]);
            } else {
                setErrorMessage(
                    "An unexpected error occurred. Please try again."
                );
            }
        }
    };

    // Basic email validation
    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <section className="form-section-container">
            <div className="form-container">
                <div className="form-inner">
                    <form className="form" onSubmit={handleSubmit}>
                        <label htmlFor="email" className="form__label">
                            Enter email to start password reset process:
                        </label>
                        <input
                            className="form__input"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            placeholder="Enter your email"
                            required
                        />

                        <button
                            className="form__button"
                            type="submit"
                            disabled={!isEmailValid(email)} // Disable if email is not valid
                        >
                            {isLoading ? "Sending..." : "Reset Password"}
                        </button>
                        {isSuccess && (
                            <p>
                                Password rest link has been sent to your email.
                            </p>
                        )}
                        {isError && <p>{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordPage;
