import React from "react";
// import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useLogoutUserMutation } from "../features/auth/authApiSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Navbar = ({ access, username }) => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // document.cookie =
        //     "my_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        logoutUser();
        dispatch(logout());
        navigate("/login");
    };

    const authLinks = (
        <React.Fragment>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#!" onClick={handleLogout}>
                        Logout
                    </a>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">
                        {username}
                    </NavLink>
                </li>
            </ul>
        </React.Fragment>
    );

    const guestLinks = (
        <div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                        Register
                    </NavLink>
                </li>
            </ul>
        </div>
    );

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Auth Site
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>

                        <NavLink className="nav-link" to="/order">
                            Cart
                        </NavLink>
                        <NavLink className="nav-link" to="/search-order">
                            Search for Order
                        </NavLink>
                        {/* <li className="nav-item">
                            <NavLink className="nav-link" to="/refresh">
                                Refresh
                            </NavLink>
                        </li> */}
                    </ul>

                    <div className="ms-auto">
                        {access ? authLinks : guestLinks}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Navbar.propTypes = {
//     access: PropTypes.string.isRequired,
//     username: PropTypes.string.isRequired,
// };

export default Navbar;
