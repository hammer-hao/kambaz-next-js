"use client";

import Link from "next/link";
import AssignmentControls from "./AssignmentControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import AssignmentIcon from "./AssignmentIcon";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import {
    deleteAssignment,
    type Assignment,
    setAssignments,
} from "./reducer";
import { useEffect } from "react";
import {
    findAssignmentsForCourse,
    deleteAssignmentOnServer,
} from "./client";

export default function Assignments() {
    const { cid } = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector(
        (s: RootState) => s.assignmentsReducer
    );

    // Load assignments for this course from the server
    useEffect(() => {
        const load = async () => {
            if (!cid) return;
            const data = await findAssignmentsForCourse(cid as string);
            dispatch(setAssignments(data));
        };
        load();
    }, [cid, dispatch]);

    // If your server already filters by course, you can just use `assignments`
    const thisCourseAssignments = assignments.filter((a) =>
        pathname.includes(a.course)
    );

    const isFaculty = true;

    const onDelete = async (aid: string) => {
        if (!isFaculty) return;
        if (window.confirm("Are you sure you want to remove this assignment?")) {
            await deleteAssignmentOnServer(aid);
            dispatch(deleteAssignment(aid));
        }
    };

    return (
        <div id="wd-assignments">
            <AssignmentControls
                onAdd={() => router.push(`/Courses/${cid}/Assignments/new`)}
            />
            <br />

            <ListGroup className="rounded-0" id="wd-assignments">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                        <BsGripVertical className="me-2 fs-3" /> Assignments
                        <div className="ms-auto">
                            <AssignmentControlButtons text={"40% of Total"} />
                        </div>
                    </div>

                    <ListGroup className="wd-lessons rounded-0">
                        {thisCourseAssignments.map((assignment: Assignment) => (
                            <ListGroupItem
                                key={assignment._id}
                                className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center"
                            >
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />
                                    <AssignmentIcon />
                                    <div className="ms-2">
                                        <Link
                                            href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                            className="fw-semibold text-decoration-none link-dark"
                                            id={`wd-assignment-${assignment._id}`}
                                        >
                                            {assignment.title}
                                        </Link>
                                        <br />
                                        <small className="text-muted">
                      <span className="text-danger fw-semibold">
                        Multiple Modules
                      </span>
                                            <span className="mx-2">|</span>
                                            Not available until{" "}
                                            {assignment.notAvailableUntil || "—"}
                                            <br />
                                            <span className="text-danger">
                        Due {assignment.due || "—"}
                      </span>
                                            <span className="mx-2">|</span>
                                            {assignment.points ?? 0} pts
                                        </small>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <LessonControlButtons />
                                    {isFaculty && (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => onDelete(assignment._id)}
                                            id={`wd-delete-assignment-${assignment._id}`}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
