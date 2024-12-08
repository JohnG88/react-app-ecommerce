import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import { useDispatch } from "react-redux";
// import { setCredentials } from "./authSlice";
import { useRegisterUserMutation } from "./authApiSlice";
import { EyeIcon, EyeOffIcon } from "../../icons";

const RegisterUser = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordTwo, setShowPasswordTwo] = useState(false);
    const [email, setEmail] = useState("");
    const [errMsg, setErrMsg] = useState([]);
    const navigate = useNavigate();

    const [registerUser, { isLoading }] = useRegisterUserMutation();
    // const dispatch = useDispatch();

    // sets focus to userRef
    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, email, password, passwordTwo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordTwo) {
            setErrMsg((prevErrMsg) => [
                ...prevErrMsg,
                "Passwords do not match.",
            ]);
            return;
        }
        try {
            const userData = await registerUser({
                username,
                email,
                password,
            }).unwrap();
            // console.log("credentials", setCredentials({ ...userData }));
            // dispatch(setCredentials({ ...userData, username }));
            setUsername("");
            setPassword("");
            setEmail("");
            setPasswordTwo("");
            navigate("/login");
        } catch (err) {
            // console.error("Failed to register user: ", err.data);
            setErrMsg(err.data);

            // if (!err?.status) {
            //     // isLoading: true until timeout occurs
            //     setErrMsg("No Server Response");
            // } else if (err.status === 400) {
            //     setErrMsg("Missing Username or Password");
            // } else if (err.status === 401) {
            //     setErrMsg("Unauthorized");
            // } else {
            //     setErrMsg("Register Failed");
            // }
            // errRef.current.focus();
        }
    };

    const handleUserInput = (e) => setUsername(e.target.value);
    const handleEmailInput = (e) => setEmail(e.target.value);

    const handlePwdInput = (e) => setPassword(e.target.value);
    const handlePwdTwoInput = (e) => setPasswordTwo(e.target.value);

    // console.log("username", username);
    // console.log("email", email);
    // console.log("password", password);
    // console.log("passwordtwo", passwordTwo);

    const handleDismissError = (index) => {
        setErrMsg((prevErrMsg) => prevErrMsg.filter((_, i) => i !== index));
    };

    const content = isLoading ? (
        // <h1>Loading...</h1>
        <p></p>
    ) : (
        <section className="form-section-container">
            <div className="form-container">
                <h2>Register</h2>
                {/* Error Messages */}
                {errMsg.length > 0 && (
                    <div className="error-message-container">
                        {errMsg.map((error, index) => (
                            <div
                                key={index}
                                ref={errRef}
                                className="error-message"
                                aria-live="assertive"
                            >
                                <span>{error}</span>
                                <button
                                    className="close-error-btn"
                                    onClick={() => handleDismissError(index)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {/* Form */}
                <div className="form-inner">
                    <form
                        className="form"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <label className="form__label" htmlFor="username">
                            Username:
                        </label>
                        <input
                            className="form__input"
                            type="text"
                            id="username"
                            ref={userRef}
                            value={username}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />

                        <label className="form__label" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="form__input"
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailInput}
                            autoComplete="off"
                            required
                        />

                        <label className="form__label" htmlFor="password">
                            Password:
                        </label>
                        <div className="input-wrapper">
                            <input
                                className="form__input"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                onChange={handlePwdInput}
                                value={password}
                                required
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </span>
                        </div>

                        <label className="form__label" htmlFor="password2">
                            Confirm Password:
                        </label>
                        <div className="input-wrapper">
                            <input
                                className="form__input"
                                type={showPasswordTwo ? "text" : "password"}
                                id="password2"
                                onChange={handlePwdTwoInput}
                                value={passwordTwo}
                                required
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() =>
                                    setShowPasswordTwo(!showPasswordTwo)
                                }
                            >
                                {showPasswordTwo ? <EyeOffIcon /> : <EyeIcon />}
                            </span>
                        </div>
                        <button className="form__button">Register</button>
                    </form>
                </div>
            </div>
        </section>
    );

    return content;
};
export default RegisterUser;
