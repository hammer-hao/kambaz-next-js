"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { findQuizById, getQuestionsForQuiz } from "../../client";

import {
    Card,
    Row,
    Col,
    Button,
    Spinner,
    Alert,
    ListGroup,
    Form,
    Badge,
} from "react-bootstrap";

import { BackendQuestion, QuestionResult, UserAnswer, QuizMeta } from "./types"
import Question from "./Question"

export default function QuizPreviewPage() {
    const params = useParams();
    const cid = params.cid as string;
    const qid = params.qid as string;
    const router = useRouter();

    // Auth / role: only faculty/admin should realistically see Preview
    const account = useSelector((s: RootState) =>
        s.accountReducer
    ) as { currentUser: { role?: string } | null };
    const currentUser = account.currentUser;
    const isFacultyOrAdmin =
        currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const [quiz, setQuiz] = useState<QuizMeta | null>(null);
    const [questions, setQuestions] = useState<BackendQuestion[]>([]);
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<QuestionResult[] | null>(null);

    const isNewQuiz = qid === "new";

    // Total points from questions
    const totalPossiblePoints = useMemo(() => {
        if (questions.length === 0) return 0;
        return questions.reduce(
            (sum, q) => sum + (q.points ?? 1),
            0
        );
    }, [questions]);

    // -------- Load quiz and questions --------
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const [quizData, questionData] = await Promise.all([
                    findQuizById(qid),
                    getQuestionsForQuiz(qid),
                ]);

                setQuiz(quizData as QuizMeta);

                const qs = (questionData ?? []) as BackendQuestion[];
                setQuestions(qs);

                // Initialize empty answers
                const initialAnswers: UserAnswer[] = qs.map((q) => {
                    if (q.type === "MULTIPLE_CHOICE") {
                        return { type: "MULTIPLE_CHOICE", choiceIndexes: [] }; // <— was choiceIndex: null
                    }
                    if (q.type === "TRUE_FALSE") {
                        return { type: "TRUE_FALSE", value: null };
                    }
                    return { type: "FILL_IN_BLANK", text: "" };
                });
                setAnswers(initialAnswers);
            } catch (e) {
                console.error(e);
                setError("Failed to load quiz preview.");
            } finally {
                setLoading(false);
            }
        };

        if (!isNewQuiz && qid) {
            load();
        } else {
            setLoading(false);
            setError("You must create and save the quiz before previewing it.");
        }
    }, [qid, isNewQuiz]);

    // Update answers when user changes them
    const updateAnswer = (index: number, newAnswer: UserAnswer) => {
        setAnswers((prev) => {
            const copy = [...prev];
            copy[index] = newAnswer;
            return copy;
        });
    };

    // Scores submission on the client side as we don't need to score previews
    const handleSubmit = () => {
        if (!questions.length) return;

        const newResults: QuestionResult[] = questions.map((q, idx) => {
            const ans = answers[idx];
            const pts = q.points ?? 1;

            if (!ans) {
                return { correct: false, earnedPoints: 0 };
            }

            if (q.type === "MULTIPLE_CHOICE" && ans.type === "MULTIPLE_CHOICE") {
                const pts = q.points ?? 1;

                // multiple choice only correct if all correct choices are selected
                const correctIndicesRaw =
                    q.correctChoiceIndexes ??
                    (typeof q.correctChoiceIndex === "number"
                        ? [q.correctChoiceIndex]
                        : []);

                const correctSet = new Set(correctIndicesRaw);
                const answerSet = new Set(ans.choiceIndexes ?? []);

                // Full credit only if sets match exactly and non-empty
                const correct =
                    correctSet.size > 0 &&
                    answerSet.size === correctSet.size &&
                    [...correctSet].every((idx) => answerSet.has(idx));

                return {
                    correct,
                    earnedPoints: correct ? pts : 0,
                };
            }

            if (q.type === "TRUE_FALSE" && ans.type === "TRUE_FALSE") {
                const correctBool = q.correctBool ?? true;
                const correct = ans.value === correctBool;
                return {
                    correct,
                    earnedPoints: correct ? pts : 0,
                };
            }

            // For fill in blank answers, check if the answers match any of the options
            if (
                q.type === "FILL_IN_BLANK" &&
                ans.type === "FILL_IN_BLANK"
            ) {
                const userText = (ans.text ?? "").trim().toLowerCase();
                const correctAnswers = (q.blanks ?? []).map((b) =>
                    b.trim().toLowerCase()
                );
                const correct =
                    userText.length > 0 &&
                    correctAnswers.some((c) => c === userText);
                return {
                    correct,
                    earnedPoints: correct ? pts : 0,
                };
            }

            return { correct: false, earnedPoints: 0 };
        });

        setResults(newResults);
        setSubmitted(true);
    };

    const totalEarned = useMemo(() => {
        if (!results) return 0;
        return results.reduce((sum, r) => sum + r.earnedPoints, 0);
    }, [results]);

    const resetPreview = () => {
        // Clear answers & results to let faculty preview again
        const initialAnswers: UserAnswer[] = questions.map((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
                return { type: "MULTIPLE_CHOICE", choiceIndexes: [] };
            }
            if (q.type === "TRUE_FALSE") {
                return { type: "TRUE_FALSE", value: null };
            }
            return { type: "FILL_IN_BLANK", text: "" };
        });
        setAnswers(initialAnswers);
        setResults(null);
        setSubmitted(false);
        setCurrentIndex(0);
    };

    const goToQuestion = (index: number) => {
        if (index < 0 || index >= questions.length) return;
        setCurrentIndex(index);
    };

    const goPrev = () => goToQuestion(currentIndex - 1);
    const goNext = () => goToQuestion(currentIndex + 1);

    // -------- Guards / loading --------
    if (!isFacultyOrAdmin) {
        return (
            <div className="alert alert-warning m-3">
                Only faculty can use Quiz Preview. Students should take the quiz instead.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Loading quiz preview...</span>
            </div>
        );
    }

    if (!quiz || !questions.length) {
        return (
            <div className="alert alert-danger m-3">
                {error || "Quiz has no questions to preview."}
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const currentResult = results ? results[currentIndex] : null;

    const questionNumber = currentIndex + 1;
    const questionPoints = currentQuestion.points ?? 1;

    // -------- Render --------
    return (
        <div className="p-3" id="wd-quiz-preview">
            {/* Header */}
            <div className="d-flex align-items-center mb-3">
                <div>
                    <h2 className="mb-1">{quiz.title || "Quiz Preview"}</h2>
                    <div className="text-muted">
                        Previewing quiz as a student.&nbsp;
                        <Badge bg="secondary">Preview Mode</Badge>
                    </div>
                </div>

                <div className="ms-auto d-flex gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                            router.push(`/Courses/${cid}/Quizzes/${qid}/edit/questions`)
                        }
                    >
                        Edit Quiz
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                    >
                        Back to Details
                    </Button>
                </div>
            </div>

            {/* Score summary after submit */}
            {submitted && results && (
                <Alert variant="info">
                    <strong>Preview Score:</strong> {totalEarned} /{" "}
                    {totalPossiblePoints} points
                    <br />
                    You answered{" "}
                    {
                        results.filter((r) => r.correct).length
                    }{" "}
                    out of {questions.length} questions correctly.
                    <div className="mt-2">
                        <Button variant="outline-danger" size="sm" onClick={resetPreview}>
                            Retake Preview
                        </Button>
                    </div>
                </Alert>
            )}

            {/* Question navigation */}
            <Card className="mb-3">
                <Card.Header>Questions</Card.Header>
                <Card.Body>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                        {questions.map((q, idx) => {
                            const r = results ? results[idx] : null;
                            const isCurrent = idx === currentIndex;

                            let variant: "outline-secondary" | "outline-success" | "outline-danger" =
                                "outline-secondary";
                            if (submitted && r) {
                                variant = r.correct ? "outline-success" : "outline-danger";
                            }

                            return (
                                <Button
                                    key={q._id}
                                    variant={variant}
                                    size="sm"
                                    onClick={() => goToQuestion(idx)}
                                    className={isCurrent ? "fw-bold" : ""}
                                >
                                    {idx + 1}
                                </Button>
                            );
                        })}
                    </div>
                    <div className="d-flex justify-content-between">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={goNext}
                            disabled={currentIndex === questions.length - 1}
                        >
                            Next
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Current question */}
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>
                            Question {questionNumber} of {questions.length}
                        </strong>
                        <span className="ms-2 text-muted">
              ({questionPoints} pts)
            </span>
                    </div>
                    {submitted && currentResult && (
                        <span>
              {currentResult.correct ? (
                  <Badge bg="success">Correct</Badge>
              ) : (
                  <Badge bg="danger">Incorrect</Badge>
              )}
            </span>
                    )}
                </Card.Header>
                <Card.Body>
                    {/* Title */}
                    {currentQuestion.title && (
                        <h5 className="mb-2">{currentQuestion.title}</h5>
                    )}

                    {/* Question text (HTML from WYSIWYG) */}
                    {currentQuestion.text && (
                        <div
                            className="mb-3"
                            dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                        />
                    )}

                    {Question(
                        currentQuestion,
                        currentAnswer,
                        (ans: UserAnswer) => updateAnswer(currentIndex, ans),
                        submitted,
                    )}
                </Card.Body>
            </Card>

            {/* Submit bar */}
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                    variant="outline-secondary"
                    onClick={resetPreview}
                    disabled={loading}
                >
                    Reset
                </Button>
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={submitted || loading}
                    id="wd-preview-submit-button"
                >
                    {submitted ? "Submitted" : "Submit Preview"}
                </Button>
            </div>
        </div>
    );
}
