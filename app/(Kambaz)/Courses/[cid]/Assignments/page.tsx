"use client"

import Link from "next/link";
import AssignmentControls from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentControls";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import AssignmentIcon from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentIcon";
import {useParams, usePathname} from "next/navigation";
import { assignments } from "../../../Database"

export default function Assignments() {
    const { cid } = useParams();
    const pathName = usePathname();
    const thisCourseAssignments = assignments.filter(assignment => { return pathName.includes(assignment.course) });
    console.log("Assignments in this course:", thisCourseAssignments);
    return (
        <div id="wd-assignments">
            <AssignmentControls /> <br />

            <ListGroup className= "rounded-0" id="wd-assignments">

                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> Assignments <AssignmentControlButtons text={"40% of Total"}/>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {thisCourseAssignments.map((assignment) => (
                            // eslint-disable-next-line react/jsx-key
                            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <AssignmentIcon />
                                    <div className="ms-2">
                                        <Link
                                            href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                            className="fw-semibold text-decoration-none link-dark"
                                        >
                                            {assignment.title}
                                        </Link> <br />
                                        <small className="text-muted">
                                            <span className="text-danger fw-semibold">Multiple Modules</span>
                                            <span className="mx-2">|</span>
                                            Not available until {assignment.notAvailableUntil}
                                            <br />
                                            <span className="text-danger">Due {assignment.due}</span>
                                            <span className="mx-2">|</span>
                                            100 pts
                                        </small>
                                    </div>
                                </div>
                                <LessonControlButtons />
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                {/*    <ListGroup className="wd-lessons rounded-0">*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        A1*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">Multiple Modules</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Not available until May 6 at 12:00am*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due May 13 at 11:59pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        A2*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">Multiple Modules</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Not available until May 13 at 12:00am*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due May 21 at 11:59pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        A3*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">Multiple Modules</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Not available until May 22 at 12:00am*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due May 30 at 11:59pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*    </ListGroup>*/}
                {/*</ListGroupItem>*/}
                {/*<ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">*/}
                {/*    <div className="wd-title p-3 ps-2 bg-secondary">*/}
                {/*        <BsGripVertical className="me-2 fs-3" /> Quizzes <AssignmentControlButtons text={"20% of Total"}/>*/}
                {/*    </div>*/}
                {/*    <ListGroup className="wd-lessons rounded-0">*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        Quiz 1 - HTML and CSS*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">Module 2</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Not available until May 10 at 12:00am*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due May 31 at 11:59pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        Quiz 2 - JavaScript Basics*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">Module 4</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Not available until May 24 at 12:00am*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due June 5 at 11:59pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*    </ListGroup>*/}
                {/*</ListGroupItem>*/}
                {/*<ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">*/}
                {/*    <div className="wd-title p-3 ps-2 bg-secondary">*/}
                {/*        <BsGripVertical className="me-2 fs-3" /> Exams <AssignmentControlButtons text={"40% of Total"}/>*/}
                {/*    </div>*/}
                {/*    <ListGroup className="wd-lessons rounded-0">*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        Midterm Exam*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">Covers Module 1-4</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Available June 1 at 12:00pm*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due June 1  at 01:00pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center">*/}
                {/*            <div className="d-flex align-items-center">*/}
                {/*                <BsGripVertical className="me-2 fs-3" />*/}
                {/*                <AssignmentIcon />*/}
                {/*                <div className="ms-2">*/}
                {/*                    <Link*/}
                {/*                        href="/Courses/1234/Assignments/123"*/}
                {/*                        className="fw-semibold text-decoration-none link-dark"*/}
                {/*                    >*/}
                {/*                        Final Exam*/}
                {/*                    </Link> <br />*/}
                {/*                    <small className="text-muted">*/}
                {/*                        <span className="text-danger fw-semibold">All Modules</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        Available July 15 at 12:00pm*/}
                {/*                        <br />*/}
                {/*                        <span className="text-danger">Due July 15 at 01:00pm</span>*/}
                {/*                        <span className="mx-2">|</span>*/}
                {/*                        100 pts*/}
                {/*                    </small>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*    </ListGroup>*/}
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}