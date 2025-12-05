"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import {
    findQuizById,
    getQuestionsForQuiz,
    getMyAttemptsForQuiz,
    submitQuizAttempt,
} from "../../client";

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

type BackendQuestionType =
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "FILL_IN_BLANK";

interface BackendQuestion {
    _id: string;
    quizId: string;
    type: BackendQuestionType;
    title?: string;
    points?: number;
    text?: string;
    choices?: string[];
    correctChoiceIndexes?: number[];
    correctChoiceIndex?: number; // fallback
    correctBool?: boolean;
    blanks?: string[];
}

interface QuizMeta {
    _id: string;
    course: string;
    title: string;
    totalPoints?: number;
    multipleAttempts?: boolean;
    maxAttempts?: number;
}

// User answer state per question
type UserAnswer =
    | { type: "MULTIPLE_CHOICE"; choiceIndexes: number[] }
    | { type: "TRUE_FALSE"; value: boolean | null }
    | { type: "FILL_IN_BLANK"; text: string };

// Result per question (local)
interface QuestionResult {
    correct: boolean;
    earnedPoints: number;
}

// What the backend returns for the last attempt
interface AttemptAnswer {
    questionId: string;
    type: BackendQuestionType;
    choiceIndexes?: number[];
    value?: boolean;
    text?: string;
    correct: boolean;
    earnedPoints: number;
}

interface QuizAttempt {
    _id: string;
    quizId: string;
    studentId: string;
    submittedAt: string;
    score: number;
    totalPoints: number;
    answers: AttemptAnswer[];
}

interface AttemptsMeta {
    attemptsUsed: number;
    lastAttempt: QuizAttempt | null;
}

export default function QuizTakePage() {
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

    const [quiz, setQuiz] = useState<QuizMeta | null>(null);
    const [questions, setQuestions] = useState<BackendQuestion[]>([]);
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<QuestionResult[] | null>(null);

    const [attemptsMeta, setAttemptsMeta] = useState<AttemptsMeta | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isNewQuiz = qid === "new";

    // --- Derived attempts info ---
    const maxAttempts = useMemo(() => {
        if (!quiz) return 1;
        if (!quiz.multipleAttempts) return 1;
        return quiz.maxAttempts && quiz.maxAttempts > 0 ? quiz.maxAttempts : 1;
    }, [quiz]);

    const attemptsUsed = attemptsMeta?.attemptsUsed ?? 0;
    const attemptsLeft = Math.max(0, maxAttempts - attemptsUsed);
    const noMoreAttempts = attemptsLeft <= 0;

    // Total points from questions (fallback)
    const totalPossiblePoints = useMemo(() => {
        if (questions.length === 0) return 0;
        return questions.reduce((sum, q) => sum + (q.points ?? 1), 0);
    }, [questions]);

    // -------- Load quiz, questions, and attempts --------
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const [quizData, questionData, attemptsData] = await Promise.all([
                    findQuizById(qid),
                    getQuestionsForQuiz(qid),
                    getMyAttemptsForQuiz(qid),
                ]);

                const qmeta = quizData as QuizMeta;
                setQuiz(qmeta);
                const qs = (questionData ?? []) as BackendQuestion[];
                setQuestions(qs);

                const attempts = attemptsData as AttemptsMeta;
                setAttemptsMeta(attempts);

                // Build empty answers
                const blankAnswers: UserAnswer[] = qs.map((q) => {
                    if (q.type === "MULTIPLE_CHOICE") {
                        return { type: "MULTIPLE_CHOICE", choiceIndexes: [] };
                    }
                    if (q.type === "TRUE_FALSE") {
                        return { type: "TRUE_FALSE", value: null };
                    }
                    return { type: "FILL_IN_BLANK", text: "" };
                });

                // If they have a last attempt, pre-fill and show results (view only)
                if (attempts.lastAttempt) {
                    const last = attempts.lastAttempt;
                    const mappedAnswers: UserAnswer[] = qs.map((q) => {
                        const a = last.answers.find(
                            (ans) => ans.questionId === q._id
                        );
                        if (!a) {
                            if (q.type === "MULTIPLE_CHOICE") {
                                return { type: "MULTIPLE_CHOICE", choiceIndexes: [] };
                            }
                            if (q.type === "TRUE_FALSE") {
                                return { type: "TRUE_FALSE", value: null };
                            }
                            return { type: "FILL_IN_BLANK", text: "" };
                        }

                        if (q.type === "MULTIPLE_CHOICE") {
                            return {
                                type: "MULTIPLE_CHOICE",
                                choiceIndexes: a.choiceIndexes ?? [],
                            };
                        }
                        if (q.type === "TRUE_FALSE") {
                            return {
                                type: "TRUE_FALSE",
                                value: a.value ?? null,
                            };
                        }
                        return {
                            type: "FILL_IN_BLANK",
                            text: a.text ?? "",
                        };
                    });

                    const mappedResults: QuestionResult[] = qs.map((q) => {
                        const a = last.answers.find(
                            (ans) => ans.questionId === q._id
                        );
                        if (!a) {
                            return { correct: false, earnedPoints: 0 };
                        }
                        return {
                            correct: !!a.correct,
                            earnedPoints: a.earnedPoints ?? 0,
                        };
                    });

                    setAnswers(mappedAnswers);
                    setResults(mappedResults);
                    setSubmitted(true);
                } else {
                    // First time taking quiz
                    setAnswers(blankAnswers);
                    setResults(null);
                    setSubmitted(false);
                }
            } catch (e) {
                console.error(e);
                setError("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        if (!isNewQuiz && qid) {
            load();
        } else {
            setLoading(false);
            setError("You must create and save the quiz before taking it.");
        }
    }, [qid, isNewQuiz]);

    // -------- Answer updating helpers --------
    const updateAnswer = (index: number, newAnswer: UserAnswer) => {
        if (submitted && noMoreAttempts) return; // cannot change when out of attempts
        setAnswers((prev) => {
            const copy = [...prev];
            copy[index] = newAnswer;
            return copy;
        });
    };

    const handleRetake = () => {
        if (noMoreAttempts) return;
        if (!questions.length) return;

        // Fresh blank answers for a new attempt
        const blankAnswers: UserAnswer[] = questions.map((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
                return { type: "MULTIPLE_CHOICE", choiceIndexes: [] };
            }
            if (q.type === "TRUE_FALSE") {
                return { type: "TRUE_FALSE", value: null };
            }
            return { type: "FILL_IN_BLANK", text: "" };
        });

        setAnswers(blankAnswers);
        setResults(null);
        setSubmitted(false);
        setCurrentIndex(0);
    };

    // -------- Local scoring (for immediate feedback) --------
    const scoreLocally = (): QuestionResult[] => {
        return questions.map((q, idx) => {
            const ans = answers[idx];
            const pts = q.points ?? 1;

            if (!ans) {
                return { correct: false, earnedPoints: 0 };
            }

            if (q.type === "MULTIPLE_CHOICE" && ans.type === "MULTIPLE_CHOICE") {
                const correctIndicesRaw =
                    q.correctChoiceIndexes ??
                    (typeof q.correctChoiceIndex === "number"
                        ? [q.correctChoiceIndex]
                        : []);

                const correctSet = new Set(correctIndicesRaw);
                const answerSet = new Set(ans.choiceIndexes ?? []);

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

            if (q.type === "FILL_IN_BLANK" && ans.type === "FILL_IN_BLANK") {
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
    };

    const totalEarned = useMemo(() => {
        if (!results) return 0;
        return results.reduce((sum, r) => sum + r.earnedPoints, 0);
    }, [results]);

    const goToQuestion = (index: number) => {
        if (index < 0 || index >= questions.length) return;
        setCurrentIndex(index);
    };

    const goPrev = () => goToQuestion(currentIndex - 1);
    const goNext = () => goToQuestion(currentIndex + 1);

    // -------- Submit attempt to server --------
    const handleSubmit = async () => {
        if (!questions.length || !quiz) return;
        if (noMoreAttempts) return;

        try {
            setSubmitting(true);
            setError(null);

            // Local scoring for immediate UI feedback
            const newResults = scoreLocally();
            setResults(newResults);
            setSubmitted(true);

            // Map answers into payload for backend
            const payload = {
                answers: questions.map((q, idx) => {
                    const a = answers[idx];
                    if (!a) {
                        return { questionId: q._id, type: q.type };
                    }

                    if (q.type === "MULTIPLE_CHOICE" && a.type === "MULTIPLE_CHOICE") {
                        return {
                            questionId: q._id,
                            type: q.type,
                            choiceIndexes: a.choiceIndexes ?? [],
                        };
                    }

                    if (q.type === "TRUE_FALSE" && a.type === "TRUE_FALSE") {
                        return {
                            questionId: q._id,
                            type: q.type,
                            value: a.value,
                        };
                    }

                    // FILL_IN_BLANK
                    if (q.type === "FILL_IN_BLANK" && a.type === "FILL_IN_BLANK") {
                        return {
                            questionId: q._id,
                            type: q.type,
                            text: a.text,
                        };
                    }

                    return { questionId: q._id, type: q.type };
                }),
            };

            const attempt = (await submitQuizAttempt(qid, payload)) as QuizAttempt;

            // Update attempts meta
            const newAttemptsUsed = attemptsUsed + 1;
            setAttemptsMeta({
                attemptsUsed: newAttemptsUsed,
                lastAttempt: attempt,
            });

            // Use server-graded score if you want:
            // convert attempt.answers -> QuestionResult to keep consistent with backend
            const serverResults: QuestionResult[] = questions.map((q) => {
                const a = attempt.answers.find(
                    (ans) => ans.questionId === q._id
                );
                if (!a) {
                    return { correct: false, earnedPoints: 0 };
                }
                return {
                    correct: !!a.correct,
                    earnedPoints: a.earnedPoints ?? 0,
                };
            });
            setResults(serverResults);
        } catch (e) {
            console.error(e);
            setError("Failed to submit quiz attempt.");
        } finally {
            setSubmitting(false);
        }
    };

    // -------- Guards --------
    if (!currentUser) {
        return (
            <div className="alert alert-warning m-3">
                Please sign in to take this quiz.
            </div>
        );
    }

    if (isFacultyOrAdmin) {
        return (
            <div className="alert alert-warning m-3">
                This page is for students taking the quiz. Use the{" "}
                <Button
                    variant="link"
                    className="p-0 align-baseline"
                    onClick={() =>
                        router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)
                    }
                >
                    Preview
                </Button>{" "}
                page as faculty.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Loading quiz...</span>
            </div>
        );
    }

    if (!quiz || !questions.length) {
        return (
            <div className="alert alert-danger m-3">
                {error || "Quiz has no questions to take."}
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const currentResult = results ? results[currentIndex] : null;

    const questionNumber = currentIndex + 1;
    const questionPoints = currentQuestion.points ?? 1;

    const attemptScore = results ? totalEarned : attemptsMeta?.lastAttempt?.score;
    const attemptTotal =
        quiz.totalPoints ?? totalPossiblePoints ?? attemptsMeta?.lastAttempt?.totalPoints;

    const nowNoMoreAttempts = attemptsLeft <= 0;

    // -------- Render --------
    return (
        <div className="p-3" id="wd-quiz-take">
            {/* Header */}
            <div className="d-flex align-items-center mb-3">
                <div>
                    <h2 className="mb-1">{quiz.title || "Quiz"}</h2>
                    <div className="text-muted">
                        Taking quiz as student.&nbsp;
                        {nowNoMoreAttempts ? (
                            <Badge bg="danger">No Attempts Left</Badge>
                        ) : (
                            <Badge bg="primary">
                                Attempts left: {attemptsLeft} / {maxAttempts}
                            </Badge>
                        )}
                    </div>
                    {attemptScore != null && attemptTotal != null && (
                        <div className="mt-1">
                            <strong>Last Score:</strong> {attemptScore} / {attemptTotal}
                        </div>
                    )}
                </div>

                <div className="ms-auto d-flex gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                    >
                        Back to Details
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            {/* After submit, show summary */}
            {submitted && results && (
                <Alert variant="info">
                    <strong>Your Score:</strong> {totalEarned} / {totalPossiblePoints} points
                    <br />
                    You answered {results.filter((r) => r.correct).length} out of{" "}
                    {questions.length} questions correctly.
                    {nowNoMoreAttempts ? (
                        <div className="mt-2">
                            You have used all your attempts. You can review your last
                            answers but cannot retake this quiz.
                        </div>
                    ) : (
                        <div className="mt-2 d-flex align-items-center gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleRetake}
                                id="wd-quiz-retake-button"
                            >
                                Retake Quiz
                            </Button>
                            <span className="text-muted">
                    This will clear your current answers and start a new attempt.
                </span>
                        </div>
                    )}
                </Alert>
            )}

            <Card className="mb-3">
                <Card.Header>Questions</Card.Header>
                <Card.Body>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                        {questions.map((q, idx) => {
                            const r = results ? results[idx] : null;
                            const isCurrent = idx === currentIndex;

                            let variant:
                                | "outline-secondary"
                                | "outline-success"
                                | "outline-danger" = "outline-secondary";
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

                    {/* Question text */}
                    {currentQuestion.text && (
                        <div
                            className="mb-3"
                            dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                        />
                    )}

                    {renderAnswerControls(
                        currentQuestion,
                        currentAnswer,
                        (ans: UserAnswer) => updateAnswer(currentIndex, ans),
                        submitted
                    )}
                </Card.Body>
            </Card>

            {/* Submit bar */}
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={submitting || noMoreAttempts}
                    id="wd-take-submit-button"
                >
                    {noMoreAttempts
                        ? "No Attempts Left"
                        : submitting
                            ? "Submitting..."
                            : "Submit Quiz"}
                </Button>
            </div>
        </div>
    );
}

// ---------- Render controls for a single question ----------
function renderAnswerControls(
    q: BackendQuestion,
    ans: UserAnswer | undefined,
    onChange: (ans: UserAnswer) => void,
    disabled: boolean,
) {
    if (!ans) return null;

    if (q.type === "MULTIPLE_CHOICE") {
        const choices = q.choices ?? [];
        const selectedIndexes =
            ans.type === "MULTIPLE_CHOICE" ? ans.choiceIndexes : [];

        const toggleIndex = (idx: number) => {
            if (disabled) return;
            if (ans.type !== "MULTIPLE_CHOICE") return;
            const current = ans.choiceIndexes ?? [];
            const exists = current.includes(idx);
            const next = exists
                ? current.filter((i) => i !== idx)
                : [...current, idx];

            onChange({ type: "MULTIPLE_CHOICE", choiceIndexes: next });
        };

        return (
            <Form>
                <Form.Label>Select all that apply:</Form.Label>
                <ListGroup>
                    {choices.map((choiceText, idx) => (
                        <ListGroup.Item key={idx} className="d-flex align-items-center">
                            <Form.Check
                                type="checkbox"
                                className="me-2"
                                disabled={disabled}
                                checked={selectedIndexes.includes(idx)}
                                onChange={() => toggleIndex(idx)}
                            />
                            <div>{choiceText}</div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Form>
        );
    }

    if (q.type === "TRUE_FALSE") {
        const value = ans.type === "TRUE_FALSE" ? ans.value : null;

        const setValue = (val: boolean) => {
            if (disabled) return;
            onChange({ type: "TRUE_FALSE", value: val });
        };

        return (
            <Form>
                <Form.Label>Choose True or False:</Form.Label>
                <div>
                    <Form.Check
                        inline
                        type="radio"
                        id={`take-tf-${q._id}-true`}
                        label="True"
                        disabled={disabled}
                        checked = {(value === true)}
                        onChange={() => setValue(true)}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        id={`take-tf-${q._id}-false`}
                        label="False"
                        disabled={disabled}
                        checked={value === false}
                        onChange={() => setValue(false)}
                    />
                </div>
            </Form>
        );
    }

    const text = ans.type === "FILL_IN_BLANK" ? ans.text : "";

    const handleChange = (newText: string) => {
        if (disabled) return;
        onChange({ type: "FILL_IN_BLANK", text: newText });
    };

    return (
        <Form>
            <Form.Label>Answer:</Form.Label>
            <Form.Control
                type="text"
                value={text}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.value)}
            />
            <Form.Text muted>
                Answer is matched case-insensitively to any of the configured blanks.
            </Form.Text>
        </Form>
    );
}
