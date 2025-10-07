import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
                </thead>
                <tbody>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Tony</span>{" "}
                    <span className="wd-last-name">Stark</span></td>
                    <td className="wd-login-id">001234561S</td>
                    <td className="wd-section">S101</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2020-10-01</td>
                    <td className="wd-total-activity">10:21:32</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Billy</span>{" "}
                    <span className="wd-last-name">Herrington</span></td>
                    <td className="wd-login-id">6767676767</td>
                    <td className="wd-section">S404</td>
                    <td className="wd-role">WRESTLER</td>
                    <td className="wd-last-activity">2022-03-14</td>
                    <td className="wd-total-activity">45:21:02</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Bruce</span>{" "}
                    <span className="wd-last-name">Wayne</span></td>
                    <td className="wd-login-id">0298439021S</td>
                    <td className="wd-section">S102</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2025-12-11</td>
                    <td className="wd-total-activity">21:05:01</td></tr>
                <tr><td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">Billy</span>{" "}
                    <span className="wd-last-name">Lu</span></td>
                    <td className="wd-login-id">034242233G</td>
                    <td className="wd-section">B209</td>
                    <td className="wd-role">TEACHER</td>
                    <td className="wd-last-activity">2025-10-02</td>
                    <td className="wd-total-activity">101:24:57</td></tr>
                </tbody>
            </Table>
        </div> );}