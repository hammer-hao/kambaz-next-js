"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as client from "../Courses/client";
import * as enrollmentsClient from "../Enrollments/client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardImg from "react-bootstrap/CardImg";
import CardBody from "react-bootstrap/CardBody";
import CardTitle from "react-bootstrap/CardTitle";
import CardText from "react-bootstrap/CardText";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FormControl } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { RootState } from "../store";

export default function Dashboard() {
    const { courses } = useSelector((state: RootState) => state.coursesReducer);

    type CurrentUser = { _id: string };

    const account = useSelector((s: RootState) =>
        s.accountReducer
    ) as { currentUser: CurrentUser | null };
    const currentUser = account.currentUser;
    const dispatch = useDispatch();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [course, setCourse] = useState<any>({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
    });
    const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

    const onAddNewCourse = async () => {
        const newCourse = await client.createCourse(course);
        dispatch(setCourses([ ...courses, newCourse ]));
    };

    const onDeleteCourse = async (courseId: string) => {
        const status = await client.deleteCourse(courseId);
        dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
    };

    const onUpdateCourse = async () => {
        await client.updateCourse(course);
        dispatch(setCourses(courses.map((c) => {
            if (c._id === course._id) { return course; }
            else { return c; }
        })));};

    const fetchData = async () => {
        if (!currentUser) return;

        try {
            const allCourses = await client.fetchAllCourses();
            dispatch(setCourses(allCourses));

            // 2) User enrollments
            const coursesForUser = await enrollmentsClient.findUserEnrollments("current");
            console.log("coursesForUser =", coursesForUser);
            const ids = new Set<string>(
                coursesForUser.map((c: { _id: string }) => c._id),
            );
            setEnrolledIds(ids);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser]);


    const [showAll, setShowAll] = useState(false);

    if (!currentUser) {
        redirect("/Account/Signin");
        return null;
    }
    const userId = currentUser._id;

    const onEnroll = async (courseId: string) => {
        await enrollmentsClient.enroll("current", courseId);
        setEnrolledIds((prev) => new Set(prev).add(courseId));
    };

    const onUnenroll = async (courseId: string) => {
        await enrollmentsClient.unenroll("current", courseId);
        setEnrolledIds((prev) => {
            const copy = new Set(prev);
            copy.delete(courseId);
            return copy;
        });
    };

    const visibleCourses = showAll
        ? courses
        : courses.filter((c) => enrolledIds.has(c._id));

    return (
        <div id="wd-dashboard">
            <div className="d-flex align-items-center">
                <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
                <Button
                    className="ms-auto"
                    variant="primary"
                    onClick={() => setShowAll((s) => !s)}
                    id="wd-enrollments-toggle"
                >
                    {showAll ? "Show Enrolled Only" : "Show All Courses"}
                </Button>
            </div>
            <hr />

            <h5>
                New Course
                <button
                    className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={onAddNewCourse}
                >
                    Add
                </button>
                <button
                    className="btn btn-warning float-end me-2"
                    onClick={onUpdateCourse}
                    id="wd-update-course-click"
                >
                    Update
                </button>
            </h5>
            <br />
            <FormControl
                value={course.name}
                className="mb-2"
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
            />
            <FormControl
                as="textarea"
                value={course.description}
                rows={3}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
            />
            <hr />

            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
            <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {visibleCourses.map((course) => {

                        const enrolled = enrolledIds.has(course._id);

                        return (
                            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                                <Card>
                                    <Link
                                        href={
                                            `/Courses/${course._id}/Home`
                                        }
                                        className="wd-dashboard-course-link text-decoration-none text-dark"
                                    >
                                        <CardImg src="/images/reactjs.webp" variant="top" width="100%" height={160} />
                                        <CardBody className="card-body">
                                            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                {course.name}
                                            </CardTitle>
                                            <CardText
                                                className="wd-dashboard-course-description overflow-hidden"
                                                style={{ height: "100px" }}
                                            >
                                                {course.description}
                                            </CardText>

                                            <Button variant="primary">Go</Button>

                                            <button
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    onDeleteCourse(course._id);
                                                }}
                                                className="btn btn-danger float-end"
                                                id="wd-delete-course-click"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                id="wd-edit-course-click"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setCourse(course);
                                                }}
                                                className="btn btn-warning me-2 float-end"
                                            >
                                                Edit
                                            </button>

                                            <div className="mt-2">
                                                {enrolled ? (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            onUnenroll(course._id);
                                                        }}
                                                        id={`wd-unenroll-${course._id}`}
                                                    >
                                                        Unenroll
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            onEnroll(course._id);
                                                        }}
                                                        id={`wd-enroll-${course._id}`}
                                                    >
                                                        Enroll
                                                    </button>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Link>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
}
