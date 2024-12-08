import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePasswordResetConfirmMutation } from "./authApiSlice";
import { EyeIcon, EyeOffIcon } from "../../icons";

const ResetPasswordConfirmPage = () => {
    // State for password input
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [disableButton, setDisableButton] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    // Get the uidb64 and token from URL
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    // Mutation hook for password reset confirmation
    const [resetPasswordConfirm, { isLoading }] =
        usePasswordResetConfirmMutation();

    // const toggleShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };

    const isButtonDisabled = () => {
        return newPassword !== confirmPassword;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple password !== confirmPassword
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Call the mutation function to reset password.
            await resetPasswordConfirm({
                uidb64,
                token,
                new_password: newPassword,
            }).unwrap();
            navigate("/login");
        } catch (err) {
            // console.log("Password reset failed: ", err);

            // Extract error message from response
            if (err.status == 400 && err.data && err.data.non_field_errors) {
                setError(err.data.non_field_errors[0]);
            } else {
                setError("Failed to reset password. Please try again.");
            }
        }
    };

    return (
        <section className="form-section-container">
            <div className="form-container">
                <h2>Reset Your Password</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="form-inner">
                    <form className="form" onSubmit={handleSubmit}>
                        <div>
                            <label
                                className="form__label"
                                htmlFor="newPassword"
                            >
                                New Password
                            </label>
                            <div className="input-wrapper">
                                <input
                                    className="form__input"
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                >
                                    {showNewPassword ? (
                                        <EyeOffIcon />
                                    ) : (
                                        <EyeIcon />
                                    )}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label
                                className="form__label"
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                            </label>
                            <div className="input-wrapper">
                                <input
                                    className="form__input"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="password-toggle-icon"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOffIcon />
                                    ) : (
                                        <EyeIcon />
                                    )}
                                </span>
                            </div>
                        </div>
                        <button
                            className="form__button"
                            type="submit"
                            disabled={isButtonDisabled()}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordConfirmPage;
