import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { EyeIcon, EyeOffIcon } from "../../icons";

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState([]);
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    // sets focus to userRef
    // useEffect(() => {
    //     setUsername("");
    //     setPassword("");
    //     // userRef.current.focus();
    // }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await login({ email, password }).unwrap();
            // if (!userData) {
            //     throw new Error("Login failed: No Data returned");
            // }
            // console.log("login", userData);
            // console.log("credentials", setCredentials({ ...userData }));
            dispatch(setCredentials({ ...userData, email }));
            // setUsername("");
            // setPassword("");
            navigate("/");
        } catch (err) {
            if (err?.status === 401) {
                setErrMsg("Email or password do not match.");
            } else {
                setErrMsg("Login failed. Please try again.");
            }

            // if (!err?.status) {
            //     // isLoading: true until timeout occurs
            //     setErrMsg("No Server Response");
            // } else if (err.status === 400) {
            //     setErrMsg("Missing Username or Password");
            // } else if (err.status === 401) {
            //     setErrMsg("Unauthorized");
            // } else {
            //     setErrMsg("Login Failed");
            // }
            errRef.current.focus();
        }
    };

    const handleUserInput = (e) => setEmail(e.target.value);

    const handlePwdInput = (e) => setPassword(e.target.value);

    // console.log("username", username);
    // console.log("password", password);

    // const content = isLoading ? (
    //     // <h1>Loading...</h1>
    //     <p></p>
    // ) : (
    //     <section className="form-section-container">
    //         <div className="form-container">
    //             <p
    //                 ref={errRef}
    //                 className={errMsg ? "errmsg" : "offscreen"}
    //                 aria-live="assertive"
    //             >
    //                 {errMsg}
    //             </p>

    //             <h2>Auth Site Login</h2>
    //             <div className="form-inner">
    //                 <form className="form" onSubmit={handleSubmit}>
    //                     <label className="form__label" htmlFor="username">
    //                         Username:
    //                     </label>
    //                     <input
    //                         className="form__input"
    //                         type="email"
    //                         id="username"
    //                         ref={userRef}
    //                         value={username}
    //                         onChange={handleUserInput}
    //                         autoComplete="off"
    //                         required
    //                     />

    //                     <label className="form__label" htmlFor="password">
    //                         Password:
    //                     </label>
    //                     <div className="input-wrapper">
    //                         <input
    //                             className="form__input"
    //                             type={showPassword ? "text" : "password"}
    //                             id="password"
    //                             onChange={handlePwdInput}
    //                             value={password}
    //                             required
    //                         />
    //                         <span
    //                             className="password-toggle-icon"
    //                             onClick={() => setShowPassword(!showPassword)}
    //                         >
    //                             {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    //                         </span>
    //                     </div>
    //                     <button className="form__button" type="submit">
    //                         Sign In
    //                     </button>
    //                 </form>
    //             </div>
    //             <Link to="/reset-password">
    //                 <p>Forgot password?</p>
    //             </Link>
    //         </div>
    //     </section>
    // );

    // return content;

    return (
        <section className="form-section-container">
            <div className="form-container">
                <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>

                <h2>Auth Site Login</h2>
                <div className="form-inner">
                    <form className="form" onSubmit={handleSubmit}>
                        <label className="form__label" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="form__input"
                            type="email"
                            id="email"
                            ref={userRef}
                            value={email}
                            onChange={handleUserInput}
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
                        <button
                            className="form__button"
                            type="submit"
                            disabled={isLoading}
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <Link to="/reset-password">
                    <p>Forgot password?</p>
                </Link>
            </div>
        </section>
    );
};
export default Login;
