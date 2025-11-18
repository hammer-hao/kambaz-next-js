// app/(Kambaz)/Courses/[cid]/People/Table.tsx
"use client";

import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import * as client from "../../../client"; //

type User = {
    _id: string;
    firstName: string;
    lastName: string;
    loginId: string;
    section: string;
    role: string;
    lastActivity: string;
    totalActivity: string;
};

export default function PeopleTable() {
    const params = useParams();
    const cid = params.cid as string;

    const [people, setPeople] = useState<User[]>([]);

    useEffect(() => {
        const fetchPeople = async () => {
            if (!cid) return;
            try {
                const data = await client.findUsersForCourse(cid);
                setPeople(data);
            } catch (e) {
                console.error("Failed to fetch users for course", e);
            }
        };
        fetchPeople();
    }, [cid]);

    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Login ID</th>
                    <th>Section</th>
                    <th>Role</th>
                    <th>Last Activity</th>
                    <th>Total Activity</th>
                </tr>
                </thead>
                <tbody>
                {people.map((user) => (
                    <tr key={user._id}>
                        <td className="wd-full-name text-nowrap">
                            <FaUserCircle className="me-2 fs-1 text-secondary" />
                            <span className="wd-first-name">{user.firstName}</span>{" "}
                            <span className="wd-last-name">{user.lastName}</span>
                        </td>
                        <td className="wd-login-id">{user.loginId}</td>
                        <td className="wd-section">{user.section}</td>
                        <td className="wd-role">{user.role}</td>
                        <td className="wd-last-activity">{user.lastActivity}</td>
                        <td className="wd-total-activity">{user.totalActivity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}
