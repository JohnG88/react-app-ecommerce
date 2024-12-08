import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

import {
    selectCurrentUsername,
    selectCurrentAccess,
} from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const Layout = () => {
    const username = useSelector(selectCurrentUsername);
    const access = useSelector(selectCurrentAccess);
    return (
        <>
            {username ? (
                <Navbar username={username} access={access} />
            ) : (
                <Navbar />
            )}
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;
