import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signin() {
    return (
        <div id="wd-signin-screen">
            <h1>Sign in</h1>
            <FormControl id="wd-username"
                         placeholder="username"
                         className="mb-2"/><br />
            <FormControl id="wd-password"
                         placeholder="password" type="password"
                         className="mb-2"/><br />
            <Link id="wd-signin-btn"
                  href="/Account/Profile"
                  className="btn btn-primary w-100 mb-2">
                Sign in </Link><br />
            <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
        </div> );}