"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { ListGroup, ListGroupItem, Dropdown, Button } from "react-bootstrap";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";

import { RootState } from "@/app/(Kambaz)/store";
import {
    type Quiz,
    setQuizzes,
    deleteQuiz,
} from "./reducer";
import {
    findQuizzesForCourse,
    deleteQuizById,
    publishQuiz,
    unPublishQuiz,
} from "./client";

export default function Quizzes() {
    const { cid } = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const { quizzes } = useSelector(
        (s: RootState) => s.quizzesReducer
    );

    // ----- currentUser & faculty/admin flag -----
    const account = useSelector((s: RootState) =>
        s.accountReducer
    ) as { currentUser: { role?: string } | null };

    const currentUser = account.currentUser;
    const isFaculty =
        currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    // Load quizzes for this course from the server
    useEffect(() => {
        const load = async () => {
            if (!cid) return;
            const data = await findQuizzesForCourse(cid as string);
            dispatch(setQuizzes(data));
        };
        load();
    }, [cid, dispatch]);

    const thisCourseQuizzes = quizzes.filter((q) =>
        pathname.includes(q.course)
    );

    const sortedQuizzes = [...thisCourseQuizzes].sort((a, b) => {
        const dateA = new Date(
            (a as any).availableFrom ?? (a as any).availableDate ?? 0
        ).getTime();
        const dateB = new Date(
            (b as any).availableFrom ?? (b as any).availableDate ?? 0
        ).getTime();
        return dateA - dateB;
    });

    const onDelete = async (qid: string) => {
        if (!isFaculty) return; // guard: only faculty/admin can delete
        if (window.confirm("Are you sure you want to remove this quiz?")) {
            await deleteQuizById(qid); // backend integration
            dispatch(deleteQuiz(qid)); // update Redux
        }
    };

    const onTogglePublish = async (quiz: Quiz) => {
        if (!isFaculty) return;
        if (!quiz.published) await publishQuiz(quiz._id);
        if (quiz.published) await unPublishQuiz(quiz._id);
        const updated = { ...quiz, published: !quiz.published };
        dispatch(
            setQuizzes(
                quizzes.map((q) => (q._id === quiz._id ? updated : q))
            )
        );
    };

    const onAddQuiz = () => {
        if (!isFaculty) return;
        router.push(`/Courses/${cid}/Quizzes/new/edit`);
    };

    return (
        <div id="wd-quizzes">
            {/* Only faculty/admin see the controls to add a new quiz */}
            {isFaculty && (
                <div className="d-flex justify-content-end mb-3">
                    <Button
                        variant="danger"
                        onClick={onAddQuiz}
                        id="wd-add-quiz-button"
                    >
                        + Quiz
                    </Button>
                </div>
            )}

            <ListGroup className="rounded-0" id="wd-quizzes-list">
                <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
                        <BsGripVertical className="me-2 fs-3" /> Quizzes
                    </div>

                    <ListGroup className="wd-lessons rounded-0">
                        {/* Empty state: show message prompting to click + Quiz */}
                        {sortedQuizzes.length === 0 && (
                            <ListGroupItem className="p-3">
                <span className="text-muted">
                  No quizzes yet.
                    {isFaculty &&
                        " Click the + Quiz button to create the first quiz."}
                </span>
                            </ListGroupItem>
                        )}

                        {sortedQuizzes.map((quiz: Quiz) => (
                            <ListGroupItem
                                key={quiz._id}
                                className="wd-lesson p-3 ps-1 d-flex justify-content-between align-items-center"
                            >
                                <div className="d-flex align-items-center">
                                    <BsGripVertical className="me-2 fs-3" />

                                    <span className="me-2">
                    <i className="bi bi-question-circle" />
                  </span>

                                    <div className="ms-1">
                                        <Link
                                            href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                                            className="fw-semibold text-decoration-none link-dark"
                                            id={`wd-quiz-${quiz._id}`}
                                        >
                                            {quiz.title}
                                        </Link>
                                        <br />
                                        <small className="text-muted">
                                            {quiz.published ? (
                                                <>
                                                    <span className="me-2">Published</span>
                                                    <span className="mx-1">|</span>
                                                </>
                                            ) : (
                                                <>
                          <span className="text-secondary me-2">
                            Not Published
                          </span>
                                                    <span className="mx-1">|</span>
                                                </>
                                            )}
                                            <span className="text-danger fw-semibold">
                        Available from{" "}
                                                {(quiz as any).availableFrom ||
                                                    (quiz as any).availableDate ||
                                                    "—"}
                      </span>
                                            <span className="mx-2">|</span>
                                            <span className="text-danger">
                        Due {(quiz as any).dueDate || "—"}
                      </span>
                                            <span className="mx-2">|</span>
                                            {(quiz as any).points ?? 0} pts
                                        </small>
                                    </div>
                                </div>

                                {/* Faculty/Admin-only controls: symbol + 3-dot menu */}
                                {isFaculty && (
                                    <div className="d-flex align-items-center gap-2">
                                        {/* 🚫 / ✅ toggle symbol */}
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link p-0"
                                            onClick={() => onTogglePublish(quiz)}
                                            aria-label={
                                                quiz.published
                                                    ? "Unpublish quiz"
                                                    : "Publish quiz"
                                            }
                                            id={`wd-quiz-publish-symbol-${quiz._id}`}
                                        >
                                            {quiz.published ? "✅" : "🚫"}
                                        </button>

                                        <Dropdown align="end">
                                            <Dropdown.Toggle
                                                as="button"
                                                className="btn btn-sm btn-outline-secondary border-0"
                                                id={`wd-quiz-menu-${quiz._id}`}
                                            >
                                                <BsThreeDotsVertical />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={() =>
                                                        router.push(
                                                            `/Courses/${cid}/Quizzes/${quiz._id}/edit`
                                                        )
                                                    }
                                                    id={`wd-quiz-edit-${quiz._id}`}
                                                >
                                                    Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => onTogglePublish(quiz)}
                                                    id={`wd-quiz-toggle-publish-${quiz._id}`}
                                                >
                                                    {quiz.published ? "Unpublish" : "Publish"}
                                                </Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item
                                                    className="text-danger"
                                                    onClick={() => onDelete(quiz._id)}
                                                    id={`wd-quiz-delete-${quiz._id}`}
                                                >
                                                    Delete
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                )}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
