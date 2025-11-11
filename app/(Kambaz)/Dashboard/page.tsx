"use client";
import { useState } from "react";
import Link from "next/link";
import * as db from "../Database";
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
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { RootState } from "../store";
import { enroll, unenroll } from "../enrollmentsReducer";

export default function Dashboard() {
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
    const dispatch = useDispatch();

    const [course, setCourse] = useState<any>({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
    });

    const [showAll, setShowAll] = useState(false);

    const isEnrolled = (courseId: string) =>
        enrollments.some((e) => e.user === currentUser._id && e.course === courseId);

    const visibleCourses = showAll
        ? courses
        : courses.filter((c) => isEnrolled(c._id));

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
                    onClick={() => dispatch(addNewCourse(course))}
                >
                    Add
                </button>
                <button
                    className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))}
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
                value={course.description}
                rows={3}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
            />
            <hr />

            <h2 id="wd-dashboard-published">Published Courses ({visibleCourses.length})</h2>
            <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {visibleCourses.map((course) => {
                        const enrolled = isEnrolled(course._id);

                        return (
                            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                                <Card>
                                    <Link
                                        href={
                                            enrolled ? `/Courses/${course._id}/Home` : "/Dashboard"
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

                                            {/* Go Button remains; route guard will also protect (see step 4) */}
                                            <Button variant="primary">Go</Button>

                                            {/* Existing faculty controls remain */}
                                            <button
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    dispatch(deleteCourse(course._id));
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

                                            {/* NEW: Enroll/Unenroll buttons (prevent link navigation on click) */}
                                            <div className="mt-2">
                                                {enrolled ? (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            dispatch(unenroll({ user: currentUser._id, course: course._id }));
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
                                                            dispatch(enroll({ user: currentUser._id, course: course._id }));
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
