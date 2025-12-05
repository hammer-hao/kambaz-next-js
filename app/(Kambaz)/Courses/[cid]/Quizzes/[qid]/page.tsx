"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { findQuizById } from "../client";

import { Card, Row, Col, Button, Spinner } from "react-bootstrap";

type QuizType =
    | "GRADED_QUIZ"
    | "PRACTICE_QUIZ"
    | "GRADED_SURVEY"
    | "UNGRADED_SURVEY";

type AssignmentGroup = "Quizzes" | "Exams" | "Assignments" | "Project";

interface Quiz {
    _id: string;
    course: string;
    title: string;
    description?: string;
    published: boolean;

    quizType: QuizType;
    assignmentGroup: AssignmentGroup;

    shuffleAnswers: boolean;
    timeLimit: number; // minutes
    multipleAttempts: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    accessCode: string;
    oneQuestionAtATime: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;

    availableFrom?: string;
    untilDate?: string;
    dueDate?: string;

    totalPoints: number;
    questionCount: number;
}

export default function QuizDetailsPage() {
    const params = useParams();
    const cid = params.cid as string;
    const qid = params.qid as string;
    const router = useRouter();

    const account = useSelector((s: RootState) =>
        s.accountReducer
    ) as { currentUser: { role?: string } | null };

    const currentUser = account.currentUser;
    const isFacultyOrAdmin =
        currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await findQuizById(qid);
                setQuiz(data);
            } catch (e) {
                console.error(e);
                setError("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };
        if (qid) load();
    }, [qid]);

    const formatDate = (value?: string | null) => {
        if (!value) return "—";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "—";
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const quizTypeLabel = (type: QuizType) => {
        switch (type) {
            case "GRADED_QUIZ":
                return "Graded Quiz";
            case "PRACTICE_QUIZ":
                return "Practice Quiz";
            case "GRADED_SURVEY":
                return "Graded Survey";
            case "UNGRADED_SURVEY":
                return "Ungraded Survey";
            default:
                return type;
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Loading quiz...</span>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="alert alert-danger m-3">
                {error || "Quiz not found."}
            </div>
        );
    }

    return (
        <div className="p-3" id="wd-quiz-details">
            {/* Header: title + actions */}
            <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0">{quiz.title || "Untitled Quiz"}</h2>
                <span className="ms-3 badge bg-secondary">
          {quizTypeLabel(quiz.quizType)}
        </span>
                {quiz.published ? (
                    <span className="ms-2 badge bg-success">Published</span>
                ) : (
                    <span className="ms-2 badge bg-danger">Unpublished</span>
                )}

                <div className="ms-auto d-flex gap-2">
                    {isFacultyOrAdmin ? (
                        <>
                            <Button
                                variant="outline-secondary"
                                onClick={() =>
                                    router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)
                                }
                                id="wd-quiz-preview-button"
                            >
                                Preview
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)
                                }
                                id="wd-quiz-edit-button"
                            >
                                Edit
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() =>
                                router.push(`/Courses/${cid}/Quizzes/${qid}/take`)
                            }
                            id="wd-quiz-start-button"
                        >
                            Start Quiz
                        </Button>
                    )}
                </div>
            </div>

            {/* Description */}
            {quiz.description && (
                <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
                    {quiz.description}
                </p>
            )}

            <Card className="mt-3">
                <Card.Header>Quiz Details</Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Quiz Type</strong>
                        </Col>
                        <Col md={8}>{quizTypeLabel(quiz.quizType)}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Assignment Group</strong>
                        </Col>
                        <Col md={8}>{quiz.assignmentGroup}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Points</strong>
                        </Col>
                        <Col md={8}>{quiz.totalPoints} pts</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Number of Questions</strong>
                        </Col>
                        <Col md={8}>{quiz.questionCount}</Col>
                    </Row>

                    <hr />

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Shuffle Answers</strong>
                        </Col>
                        <Col md={8}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Time Limit</strong>
                        </Col>
                        <Col md={8}>
                            {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No time limit"}
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Multiple Attempts</strong>
                        </Col>
                        <Col md={8}>
                            {quiz.multipleAttempts ? "Yes" : "No"}
                            {quiz.multipleAttempts && (
                                <span className="ms-2">
                  (Max {quiz.maxAttempts} attempt
                                    {quiz.maxAttempts === 1 ? "" : "s"})
                </span>
                            )}
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Show Correct Answers</strong>
                        </Col>
                        <Col md={8}>{quiz.showCorrectAnswers ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Access Code</strong>
                        </Col>
                        <Col md={8}>{quiz.accessCode || "None"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>One Question at a Time</strong>
                        </Col>
                        <Col md={8}>{quiz.oneQuestionAtATime ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Webcam Required</strong>
                        </Col>
                        <Col md={8}>{quiz.webcamRequired ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Lock Questions After Answering</strong>
                        </Col>
                        <Col md={8}>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</Col>
                    </Row>

                    <hr />

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Available From</strong>
                        </Col>
                        <Col md={8}>{formatDate(quiz.availableFrom)}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Until</strong>
                        </Col>
                        <Col md={8}>{formatDate(quiz.untilDate)}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4}>
                            <strong>Due Date</strong>
                        </Col>
                        <Col md={8}>{formatDate(quiz.dueDate)}</Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}