import { useSelector } from "react-redux";
import { selectCurrentUsername, selectCurrentAccess } from "./authSlice";
import { Link } from "react-router-dom";

const Welcome = () => {
    const username = useSelector(selectCurrentUsername);
    const token = useSelector(selectCurrentAccess);

    const welcome = username ? `Welcome ${username}!` : "Welcome!";
    const tokenAbbr = `${token.slice(0, 9)}...`;

    const content = (
        <section className="welcome">
            <h1>{welcome}</h1>
            <p>Token: {tokenAbbr}</p>
            <p>
                <Link to="/userslist">Go to the Users List</Link>
            </p>
        </section>
    );

    return content;
};
export default Welcome;
