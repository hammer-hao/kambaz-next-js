import Link from "next/link";
import {FormControl} from "react-bootstrap";
import FormSelect from "react-bootstrap/FormSelect";
export default function Profile() {
    return (
        <div id="wd-profile-screen">
            <h1>Profile</h1>
            <FormControl className="mb-2" placeholder="username" defaultValue="Alice">
            </FormControl>
            <FormControl className="mb-2" placeholder="password" type="password" defaultValue="123">
            </FormControl>
            <FormControl className="mb-2" placeholder="First Name" defaultValue="Alice">
            </FormControl>
            <FormControl className="mb-2" placeholder="Last Name" defaultValue="Wonderland">
            </FormControl>
            <FormControl type="date" className="mb-2" placeholder="Date of Birth" defaultValue="2000-01-01" />
            <FormControl type="email" className="mb-2" placeholder="Email" defaultValue="alice@wonderland" />
            <FormSelect className="mb-2" defaultValue="FACULTY">
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
            </FormSelect>
            <Link id="wd-signin-btn"
                  href="Signin"
                  className="btn btn-danger w-100 mb-2">
                Sign out </Link><br />
        </div>
    )
}