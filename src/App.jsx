import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
//import Public from "./components/Public";
import RegisterUser from "./features/auth/RegisterUser";
import Login from "./features/auth/Login";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";
import ResetPasswordConfirmPage from "./features/auth/ResetPasswordConfirmPage";
import Welcome from "./features/auth/Welcome";
import RequireAuth from "./features/auth/RequireAuth";
import OrderContainer from "./features/orders/OrderContainer";
import SubmitOrder from "./features/orders/SubmitOrder";
import OrderConfirmed from "./features/orders/OrderConfirmed";
import ProductsList from "./features/products/ProductsList";
import SingleProductPage from "./features/products/SingleProductPage";
import SearchOrder from "./features/search_orders/SearchOrder";
import ReturnSearchOrder from "./features/search_orders/ReturnSearchedOrder";
import ProfilePage from "./features/profile/ProfilePage";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY
);

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<ProductsList />} />

                <Route path="product">
                    <Route path=":Id" element={<SingleProductPage />} />
                </Route>

                <Route path="register" element={<RegisterUser />} />
                <Route path="login" element={<Login />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route
                    path="/reset-password-confirm/:uidb64/:token"
                    element={<ResetPasswordConfirmPage />}
                />
                <Route path="order" element={<OrderContainer />} />
                <Route
                    path="submit-order/:orderId"
                    element={
                        <Elements stripe={stripePromise}>
                            <SubmitOrder />
                        </Elements>
                    }
                />

                <Route path="order-confirmed" element={<OrderConfirmed />} />
                <Route path="search-order" element={<SearchOrder />} />
                <Route
                    path="return-order/:orderId"
                    element={<ReturnSearchOrder />}
                />
                <Route path="profile" element={<ProfilePage />} />

                {/* <Route path="order" >
                    <Route path=":orderId" element={<OrderContainer />} />
                </Route> */}

                {/* protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="welcome" element={<Welcome />} />
                    {/* <Route path="orderslist" element={<OrdersList />} /> */}
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
