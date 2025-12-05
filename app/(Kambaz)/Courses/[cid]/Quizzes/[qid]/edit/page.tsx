"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import {
    findQuizById,
    updateQuizOnServer,
    createQuizForCourse,
} from "../../client";

import {
    Card,
    Row,
    Col,
    Button,
    Spinner,
    Form,
    Alert,
} from "react-bootstrap";

type QuizType =
    | "GRADED_QUIZ"
    | "PRACTICE_QUIZ"
    | "GRADED_SURVEY"
    | "UNGRADED_SURVEY";

type AssignmentGroup = "Quizzes" | "Exams" | "Assignments" | "Project";

interface Quiz {
    _id?: string; // optional when creating
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

export default function QuizEditorPage() {
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

    const { quizzes } = useSelector((s: RootState) => s.quizzesReducer);

    const isNew = qid === "new";
    const existing = quizzes.find((q) => q._id === qid);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Convenience derived field for "has time limit"
    const hasTimeLimit = quiz ? quiz.timeLimit > 0 : false;

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1) New quiz: initialize defaults
                if (isNew) {
                    const nowIso = new Date().toISOString();
                    const initial: Quiz = {
                        course: cid,
                        title: "New Quiz",
                        description: "",
                        published: false,

                        quizType: "GRADED_QUIZ",
                        assignmentGroup: "Quizzes",

                        shuffleAnswers: true,
                        timeLimit: 20,
                        multipleAttempts: false,
                        maxAttempts: 1,
                        showCorrectAnswers: false,
                        accessCode: "",
                        oneQuestionAtATime: true,
                        webcamRequired: false,
                        lockQuestionsAfterAnswering: false,

                        availableFrom: nowIso,
                        untilDate: undefined,
                        dueDate: undefined,

                        totalPoints: 0,
                        questionCount: 0,
                    };
                    setQuiz(initial);
                    return;
                }

                // 2) Existing quiz already in Redux
                if (existing) {
                    setQuiz(existing as Quiz);
                    return;
                }

                // 3) Fallback: fetch from server
                const data = await findQuizById(qid);
                setQuiz(data);
            } catch (e) {
                console.error(e);
                setError("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        if (cid && qid) {
            load();
        }
    }, [cid, qid, isNew, existing]);

    const toInputDate = (value?: string) => {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10); // yyyy-MM-dd
    };

    const handleFieldChange = (
        field:
            | "title"
            | "description"
            | "quizType"
            | "assignmentGroup"
            | "accessCode",
        value: string,
    ) => {
        if (!quiz) return;
        setQuiz({ ...quiz, [field]: value });
    };

    const handleCheckboxChange = (field: keyof Quiz) => {
        if (!quiz) return;
        setQuiz({ ...quiz, [field]: !quiz[field] });
    };

    const handleNumberChange = (field: "timeLimit" | "maxAttempts") => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!quiz) return;
            const value = parseInt(e.target.value, 10);
            setQuiz({ ...quiz, [field]: Number.isNaN(value) ? 0 : value });
        };
    };

    const handleDateChange =
        (field: "availableFrom" | "untilDate" | "dueDate") =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (!quiz) return;
                const value = e.target.value; // yyyy-MM-dd
                setQuiz({
                    ...quiz,
                    [field]: value ? new Date(value).toISOString() : undefined,
                });
            };

    const handleToggleTimeLimit = () => {
        if (!quiz) return;
        if (quiz.timeLimit > 0) {
            setQuiz({ ...quiz, timeLimit: 0 });
        } else {
            setQuiz({ ...quiz, timeLimit: 20 });
        }
    };

    const saveQuiz = async (options?: { publish?: boolean; goToList?: boolean }) => {
        if (!quiz) return;
        try {
            setSaving(true);
            setError(null);

            const payload: Quiz = {
                ...quiz,
                // if we "turn off" time limit, ensure a 0 is sent
                timeLimit: hasTimeLimit ? quiz.timeLimit : 0,
                // Save & Publish can override published flag
                published: options?.publish ? true : quiz.published,
            };

            if (isNew) {
                // CREATE
                const { _id, ...createBody } = payload;
                const created = await createQuizForCourse(cid, createBody);

                if (options?.goToList) {
                    router.push(`/Courses/${cid}/Quizzes`);
                } else {
                    router.push(`/Courses/${cid}/Quizzes/${created._id}`);
                }
            } else {
                // UPDATE
                const updated = await updateQuizOnServer(qid, payload);
                setQuiz(updated);

                if (options?.goToList) {
                    router.push(`/Courses/${cid}/Quizzes`);
                } else {
                    router.push(`/Courses/${cid}/Quizzes/${qid}`);
                }
            }
        } catch (e) {
            console.error(e);
            setError("Failed to save quiz.");
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        router.push(`/Courses/${cid}/Quizzes`);
    };

    if (!isFacultyOrAdmin) {
        return (
            <div className="alert alert-warning m-3">
                You do not have permission to edit this quiz.
            </div>
        );
    }

    if (loading || !quiz) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Loading quiz editor...</span>
            </div>
        );
    }

    return (
        <div className="p-3" id="wd-quiz-editor">
            {/* Tabs header */}
            <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">
                    {isNew ? "Create Quiz" : "Edit Quiz"}
                </h2>
                <Button
                    variant="link"
                    className="p-0 me-3"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
                >
                    Details
                </Button>
                {!isNew && (
                    <Button
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() =>
                            router.push(`/Courses/${cid}/Quizzes/${qid}/edit/questions`)
                        }
                        id="wd-quiz-questions-tab"
                    >
                        Questions
                    </Button>
                )}

                {!isNew && (
                    <div className="ms-auto">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                                router.push(`/Courses/${cid}/Quizzes/${qid}`)
                            }
                        >
                            View Details
                        </Button>
                    </div>
                )}
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Header>Quiz Details</Card.Header>
                <Card.Body>
                    <Form>
                        {/* Title */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Title
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    type="text"
                                    value={quiz.title}
                                    onChange={(e) => handleFieldChange("title", e.target.value)}
                                    id="wd-quiz-title-input"
                                />
                            </Col>
                        </Form.Group>

                        {/* Description */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Description
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={quiz.description || ""}
                                    onChange={(e) =>
                                        handleFieldChange("description", e.target.value)
                                    }
                                    id="wd-quiz-description-input"
                                />
                            </Col>
                        </Form.Group>

                        {/* Quiz Type */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Quiz Type
                            </Form.Label>
                            <Col md={9}>
                                <Form.Select
                                    value={quiz.quizType}
                                    onChange={(e) =>
                                        handleFieldChange("quizType", e.target.value)
                                    }
                                    id="wd-quiz-type-select"
                                >
                                    <option value="GRADED_QUIZ">Graded Quiz</option>
                                    <option value="PRACTICE_QUIZ">Practice Quiz</option>
                                    <option value="GRADED_SURVEY">Graded Survey</option>
                                    <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* Assignment Group */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Assignment Group
                            </Form.Label>
                            <Col md={9}>
                                <Form.Select
                                    value={quiz.assignmentGroup}
                                    onChange={(e) =>
                                        handleFieldChange("assignmentGroup", e.target.value)
                                    }
                                    id="wd-assignment-group-select"
                                >
                                    <option value="Quizzes">Quizzes</option>
                                    <option value="Exams">Exams</option>
                                    <option value="Assignments">Assignments</option>
                                    <option value="Project">Project</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* Points */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Points
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    type="number"
                                    value={quiz.totalPoints}
                                    onChange={(e) =>
                                        setQuiz({
                                            ...quiz,
                                            totalPoints: Number(e.target.value) || 0,
                                        })
                                    }
                                    id="wd-quiz-points-input"
                                />
                            </Col>
                        </Form.Group>

                        <hr />

                        {/* Shuffle Answers */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Shuffle Answers
                            </Form.Label>
                            <Col md={9} className="d-flex align-items-center">
                                <Form.Check
                                    type="switch"
                                    id="wd-shuffle-answers-switch"
                                    label={quiz.shuffleAnswers ? "Yes" : "No"}
                                    checked={quiz.shuffleAnswers}
                                    onChange={() => handleCheckboxChange("shuffleAnswers")}
                                />
                            </Col>
                        </Form.Group>

                        {/* Time Limit */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Time Limit
                            </Form.Label>
                            <Col md={9}>
                                <div className="d-flex align-items-center gap-3">
                                    <Form.Check
                                        type="switch"
                                        id="wd-time-limit-switch"
                                        label={hasTimeLimit ? "Enabled" : "No time limit"}
                                        checked={hasTimeLimit}
                                        onChange={handleToggleTimeLimit}
                                    />
                                    <Form.Control
                                        type="number"
                                        style={{ maxWidth: "120px" }}
                                        value={quiz.timeLimit}
                                        disabled={!hasTimeLimit}
                                        onChange={handleNumberChange("timeLimit")}
                                        id="wd-time-limit-input"
                                    />
                                    <span>minutes</span>
                                </div>
                            </Col>
                        </Form.Group>

                        {/* Multiple Attempts + How Many */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Multiple Attempts
                            </Form.Label>
                            <Col md={9}>
                                <div className="d-flex align-items-center gap-3">
                                    <Form.Check
                                        type="switch"
                                        id="wd-multiple-attempts-switch"
                                        label={quiz.multipleAttempts ? "Yes" : "No"}
                                        checked={quiz.multipleAttempts}
                                        onChange={() =>
                                            handleCheckboxChange("multipleAttempts")
                                        }
                                    />
                                    <span>Max attempts:</span>
                                    <Form.Control
                                        type="number"
                                        style={{ maxWidth: "120px" }}
                                        value={quiz.maxAttempts}
                                        disabled={!quiz.multipleAttempts}
                                        onChange={handleNumberChange("maxAttempts")}
                                        id="wd-max-attempts-input"
                                    />
                                </div>
                            </Col>
                        </Form.Group>

                        {/* Show Correct Answers */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Show Correct Answers
                            </Form.Label>
                            <Col md={9}>
                                <Form.Check
                                    type="switch"
                                    id="wd-show-correct-answers-switch"
                                    label={quiz.showCorrectAnswers ? "Yes" : "No"}
                                    checked={quiz.showCorrectAnswers}
                                    onChange={() =>
                                        handleCheckboxChange("showCorrectAnswers")
                                    }
                                />
                            </Col>
                        </Form.Group>

                        {/* Access Code */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Access Code
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    type="text"
                                    value={quiz.accessCode || ""}
                                    onChange={(e) =>
                                        handleFieldChange("accessCode", e.target.value)
                                    }
                                    id="wd-access-code-input"
                                />
                                <Form.Text muted>
                                    Leave blank if no access code is required.
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        {/* One Question at a Time */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                One Question at a Time
                            </Form.Label>
                            <Col md={9}>
                                <Form.Check
                                    type="switch"
                                    id="wd-one-question-switch"
                                    label={quiz.oneQuestionAtATime ? "Yes" : "No"}
                                    checked={quiz.oneQuestionAtATime}
                                    onChange={() =>
                                        handleCheckboxChange("oneQuestionAtATime")
                                    }
                                />
                            </Col>
                        </Form.Group>

                        {/* Webcam Required */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Webcam Required
                            </Form.Label>
                            <Col md={9}>
                                <Form.Check
                                    type="switch"
                                    id="wd-webcam-required-switch"
                                    label={quiz.webcamRequired ? "Yes" : "No"}
                                    checked={quiz.webcamRequired}
                                    onChange={() =>
                                        handleCheckboxChange("webcamRequired")
                                    }
                                />
                            </Col>
                        </Form.Group>

                        {/* Lock Questions After Answering */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Lock Questions After Answering
                            </Form.Label>
                            <Col md={9}>
                                <Form.Check
                                    type="switch"
                                    id="wd-lock-questions-switch"
                                    label={quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
                                    checked={quiz.lockQuestionsAfterAnswering}
                                    onChange={() =>
                                        handleCheckboxChange("lockQuestionsAfterAnswering")
                                    }
                                />
                            </Col>
                        </Form.Group>

                        <hr />

                        {/* Dates */}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Available From
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    type="date"
                                    value={toInputDate(quiz.availableFrom)}
                                    onChange={handleDateChange("availableFrom")}
                                    id="wd-available-from-input"
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column md={3}>
                                Until
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    type="date"
                                    value={toInputDate(quiz.untilDate)}
                                    onChange={handleDateChange("untilDate")}
                                    id="wd-until-date-input"
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-4">
                            <Form.Label column md={3}>
                                Due Date
                            </Form.Label>
                            <Col md={9}>
                                <Form.Control
                                    type="date"
                                    value={toInputDate(quiz.dueDate)}
                                    onChange={handleDateChange("dueDate")}
                                    id="wd-due-date-input"
                                />
                            </Col>
                        </Form.Group>

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={onCancel}
                                disabled={saving}
                                id="wd-quiz-cancel-button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => saveQuiz({ publish: false })}
                                disabled={saving}
                                id="wd-quiz-save-button"
                            >
                                {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => saveQuiz({ publish: true, goToList: true })}
                                disabled={saving}
                                id="wd-quiz-save-publish-button"
                            >
                                {saving ? "Saving..." : "Save & Publish"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
