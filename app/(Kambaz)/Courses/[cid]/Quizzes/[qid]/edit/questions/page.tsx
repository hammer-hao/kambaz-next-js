"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import {
    findQuizById,
    updateQuizOnServer,
    getQuestionsForQuiz,
    addQuestionToQuiz,
    updateQuestionOnQuiz,
    deleteQuestionFromQuiz,
} from "../../../client";

import {
    Card,
    Row,
    Col,
    Button,
    Spinner,
    Form,
    Alert,
    ListGroup,
} from "react-bootstrap";

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";

interface BaseQuestion {
    _id?: string;
    type: QuestionType;
    title: string;
    points: number;
    text: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
    type: "MULTIPLE_CHOICE";
    choices: { id: string; text: string }[];
    correctChoiceIds: string[];
}

interface TrueFalseQuestion extends BaseQuestion {
    type: "TRUE_FALSE";
    correct: boolean;
}

interface FillInBlankQuestion extends BaseQuestion {
    type: "FILL_IN_BLANK";
    answers: string[];
}

type AnyQuestion =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | FillInBlankQuestion;

interface BackendQuestion {
    _id: string;
    quizId: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
    title?: string;
    points?: number;
    text?: string;
    choices?: string[];
    correctChoiceIndexes?: number[];
    correctBool?: boolean;
    blanks?: string[];
}

// minimal quiz shape for this page
interface QuizWithQuestionsMeta {
    _id: string;
    course: string;
    title: string;
    totalPoints?: number;
}

export default function QuizQuestionsPage() {
    const params = useParams();
    const cid = params.cid as string;
    const qid = params.qid as string;
    const router = useRouter();

    // auth / role
    const account = useSelector((s: RootState) =>
        s.accountReducer
    ) as { currentUser: { role?: string } | null };
    const currentUser = account.currentUser;
    const isFacultyOrAdmin =
        currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const [quiz, setQuiz] = useState<QuizWithQuestionsMeta | null>(null);
    const [questions, setQuestions] = useState<AnyQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // editing state
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState<AnyQuestion | null>(null);

    const isNewQuiz = qid === "new"; // guard: should not be here for "new"

    // total points = sum of question points
    const totalPoints = useMemo(
        () => questions.reduce((sum, q) => sum + (q.points || 0), 0),
        [questions],
    );

    // ---------- backend <-> frontend mapping helpers ----------

    function backendToFrontend(bq: BackendQuestion): AnyQuestion {
        const base: BaseQuestion = {
            _id: bq._id,
            type: "MULTIPLE_CHOICE", // override below
            title: bq.title ?? "",
            points: bq.points ?? 1,
            text: bq.text ?? "",
        };

        if (bq.type === "MULTIPLE_CHOICE") {
            const texts = bq.choices ?? [];
            const choices = texts.map((text, index) => ({
                id: String.fromCharCode("A".charCodeAt(0) + index),
                text,
            }));

            const indices = bq.correctChoiceIndexes ?? [];
            const correctChoiceIds = indices
                .map((idx) => choices[idx]?.id)
                .filter((id): id is string => !!id);

            return {
                ...(base as BaseQuestion),
                type: "MULTIPLE_CHOICE",
                choices,
                correctChoiceIds,
            };
        }

        if (bq.type === "TRUE_FALSE") {
            return {
                ...(base as BaseQuestion),
                type: "TRUE_FALSE",
                correct: bq.correctBool ?? true,
            };
        }

        return {
            ...(base as BaseQuestion),
            type: "FILL_IN_BLANK",
            answers: bq.blanks ?? [""],
        };
    }

    function frontendToBackend(
        q: AnyQuestion,
        quizId: string,
    ): Omit<BackendQuestion, "_id"> {
        if (q.type === "MULTIPLE_CHOICE") {
            const texts = q.choices.map((c) => c.text);

            const correctChoiceIndexes =
                q.correctChoiceIds?.map((id) =>
                    q.choices.findIndex((c) => c.id === id)
                ).filter((idx) => idx >= 0) ?? [];

            return {
                quizId,
                type: "MULTIPLE_CHOICE",
                title: q.title,
                points: q.points,
                text: q.text,
                choices: texts,
                correctChoiceIndexes,
            };
        }

        if (q.type === "TRUE_FALSE") {
            return {
                quizId,
                type: "TRUE_FALSE",
                title: q.title,
                points: q.points,
                text: q.text,
                correctBool: q.correct,
            };
        }

        return {
            quizId,
            type: "FILL_IN_BLANK",
            title: q.title,
            points: q.points,
            text: q.text,
            blanks: q.answers,
        };
    }

    // ---------- load quiz + questions ----------

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const [quizData, questionData] = await Promise.all([
                    findQuizById(qid),
                    getQuestionsForQuiz(qid),
                ]);

                setQuiz(quizData as QuizWithQuestionsMeta);

                const backendQuestions = (questionData ?? []) as BackendQuestion[];
                setQuestions(backendQuestions.map(backendToFrontend));
            } catch (e) {
                console.error(e);
                setError("Failed to load quiz questions.");
            } finally {
                setLoading(false);
            }
        };

        if (!isNewQuiz && qid) {
            load();
        } else {
            setLoading(false);
            setError(
                "You must create and save the quiz in the Details tab before editing questions.",
            );
        }
    }, [qid, isNewQuiz]);

    // ---------- local helpers ----------

    const makeDefaultQuestion = (): MultipleChoiceQuestion => ({
        type: "MULTIPLE_CHOICE",
        title: "New Question",
        points: 1,
        text: "",
        choices: [
            { id: "A", text: "Option 1" },
            { id: "B", text: "Option 2" },
        ],
        correctChoiceIds: ["A"],
    });

    const startNewQuestion = () => {
        const q = makeDefaultQuestion();
        setEditingIndex(questions.length); // new at bottom
        setDraft(q);
        setSuccess(null);
        setError(null);
    };

    const startEditQuestion = (index: number) => {
        const original = questions[index];
        setEditingIndex(index);
        setDraft(JSON.parse(JSON.stringify(original)));
        setSuccess(null);
        setError(null);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setDraft(null);
    };

    // ---------- delete a question (backend + local) ----------

    const handleDeleteQuestion = async (index: number) => {
        const q = questions[index];
        if (
            !window.confirm(
                "Are you sure you want to delete this question? This cannot be undone.",
            )
        ) {
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            // If it has an _id, delete on server; otherwise it's local-only
            if (q._id) {
                await deleteQuestionFromQuiz(qid, q._id);
            }

            const remaining = questions.filter((_, i) => i !== index);
            setQuestions(remaining);

            // Reset editing state if we were editing this question
            if (editingIndex === index) {
                setEditingIndex(null);
                setDraft(null);
            }

            setSuccess("Question deleted.");
        } catch (e) {
            console.error(e);
            setError("Failed to delete question.");
        } finally {
            setSaving(false);
        }
    };

    // ---------- save a single question via question endpoints ----------

    const saveDraftIntoList = async () => {
        if (!draft || editingIndex == null || !qid) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const payload = frontendToBackend(draft, qid);

            if (!draft._id) {
                // NEW QUESTION
                const created = await addQuestionToQuiz(qid, payload);
                const saved = backendToFrontend(created as BackendQuestion);
                setQuestions([...questions, saved]);
            } else {
                // EXISTING QUESTION
                const updated = await updateQuestionOnQuiz(qid, draft._id, payload);
                const saved = backendToFrontend(updated as BackendQuestion);
                const list = questions.map((q, idx) =>
                    idx === editingIndex || q._id === saved._id ? saved : q,
                );
                setQuestions(list);
            }

            setEditingIndex(null);
            setDraft(null);
            setSuccess("Question saved.");
        } catch (e) {
            console.error(e);
            setError("Failed to save question.");
        } finally {
            setSaving(false);
        }
    };

    // ---------- save all (sync totalPoints; does NOT publish quiz) ----------

    const saveAllQuestions = async () => {
        if (!quiz) return;
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            // questions already saved individually; just keep totalPoints in sync
            const updated = await updateQuizOnServer(quiz._id, { totalPoints });
            setQuiz(updated as QuizWithQuestionsMeta);
            setSuccess("Questions and total points saved.");
        } catch (e) {
            console.error(e);
            setError("Failed to save quiz questions.");
        } finally {
            setSaving(false);
        }
    };

    const onCancelScreen = () => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/edit`);
    };

    // ---------- guards / loading ----------

    if (!isFacultyOrAdmin) {
        return (
            <div className="alert alert-warning m-3">
                You do not have permission to edit quiz questions.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status" className="me-2" />
                <span>Loading quiz questions...</span>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="alert alert-danger m-3">
                {error || "Quiz not found."}
            </div>
        );
    }

    // ---------- UI ----------

    return (
        <div className="p-3" id="wd-quiz-questions-editor">
            {/* Tabs header */}
            <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">Edit Quiz</h2>
                <Button
                    variant="link"
                    className="p-0 me-3"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
                >
                    Details
                </Button>
                <Button
                    variant="link"
                    className="p-0 text-decoration-none fw-bold"
                    onClick={() =>
                        router.push(`/Courses/${cid}/Quizzes/${qid}/edit/questions`)
                    }
                    id="wd-quiz-questions-tab"
                >
                    Questions
                </Button>

                <div className="ms-auto">
          <span className="me-3">
            <strong>Total Points: </strong>
              {totalPoints}
          </span>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
                    >
                        View Details
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>Questions</span>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={startNewQuestion}
                        id="wd-new-question-button"
                    >
                        + New Question
                    </Button>
                </Card.Header>

                <Card.Body>
                    {questions.length === 0 && editingIndex === null && (
                        <p className="text-muted mb-0">
                            No questions yet. Click <strong>+ New Question</strong> to add the
                            first question.
                        </p>
                    )}

                    <ListGroup className="mb-3">
                        {questions.map((q, idx) => {
                            const isEditing = editingIndex === idx;

                            if (isEditing && draft) {
                                return (
                                    <ListGroup.Item key={q._id ?? idx} className="mb-2">
                                        <QuestionEditorForm
                                            draft={draft}
                                            setDraft={setDraft}
                                            onCancel={cancelEdit}
                                            onSaveDraft={saveDraftIntoList}
                                            saving={saving}
                                        />
                                    </ListGroup.Item>
                                );
                            }

                            return (
                                <ListGroup.Item
                                    key={q._id ?? idx}
                                    className="d-flex justify-content-between align-items-start mb-2"
                                >
                                    <div>
                                        <div className="fw-semibold">
                                            Q{idx + 1}. {q.title || "(Untitled question)"}
                                        </div>
                                        <small className="text-muted d-block">
                                            Type: {prettyQuestionType(q.type)} |{" "}
                                            {q.points || 0} pts
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => startEditQuestion(idx)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteQuestion(idx)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>

                    {/* New question editor card when editingIndex === questions.length */}
                    {editingIndex !== null &&
                        editingIndex >= questions.length &&
                        draft && (
                            <Card className="mb-3">
                                <Card.Body>
                                    <QuestionEditorForm
                                        draft={draft}
                                        setDraft={setDraft}
                                        onCancel={cancelEdit}
                                        onSaveDraft={saveDraftIntoList}
                                        saving={saving}
                                    />
                                </Card.Body>
                            </Card>
                        )}

                    {/* Screen-level actions */}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                            variant="secondary"
                            onClick={onCancelScreen}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={saveAllQuestions}
                            disabled={saving}
                            id="wd-questions-save-button"
                        >
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

// ---------- Pretty label for question type ----------
function prettyQuestionType(type: QuestionType) {
    switch (type) {
        case "MULTIPLE_CHOICE":
            return "Multiple Choice";
        case "TRUE_FALSE":
            return "True / False";
        case "FILL_IN_BLANK":
            return "Fill in the Blank";
        default:
            return type;
    }
}

function WysiwygEditor({
                           value,
                           onChange,
                       }: {
    value: string;
    onChange: (html: string) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const lastValueRef = useRef<string>("");

    // Only sync DOM when `value` changes from outside (e.g. when loading a question),
    // not on every keystroke.
    useEffect(() => {
        if (!ref.current) return;
        if (lastValueRef.current === value) return; // already in sync

        ref.current.innerHTML = value || "";
        lastValueRef.current = value || "";
    }, [value]);

    const handleInput = () => {
        if (!ref.current) return;
        const html = ref.current.innerHTML;
        lastValueRef.current = html;
        onChange(html);
    };

    const applyCommand = (cmd: string) => {
        if (!ref.current) return;
        // Make sure the editor has focus so the command applies here
        ref.current.focus();
        document.execCommand(cmd, false);
        // Sync back to parent
        const html = ref.current.innerHTML;
        lastValueRef.current = html;
        onChange(html);
    };

    return (
        <div>
            <div className="btn-group btn-group-sm mb-2" role="group">
                <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => applyCommand("bold")}
                >
                    <strong>B</strong>
                </Button>
                <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => applyCommand("italic")}
                >
                    <em>I</em>
                </Button>
                <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => applyCommand("underline")}
                >
                    <u>U</u>
                </Button>
                <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => applyCommand("insertUnorderedList")}
                >
                    • List
                </Button>
                <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => applyCommand("insertOrderedList")}
                >
                    1. List
                </Button>
            </div>

            <div
                ref={ref}
                className="form-control"
                style={{ minHeight: "120px" }}
                contentEditable
                onInput={handleInput}
            />
            <Form.Text muted>
                Basic formatting supported (bold, italic, underline, lists).
            </Form.Text>
        </div>
    );
}

// ---------- Reusable editor form ----------
function QuestionEditorForm({
                                draft,
                                setDraft,
                                onCancel,
                                onSaveDraft,
                                saving,
                            }: {
    draft: AnyQuestion;
    setDraft: (q: AnyQuestion) => void;
    onCancel: () => void;
    onSaveDraft: () => Promise<void> | void;
    saving: boolean;
}) {
    const handleBaseChange = <K extends keyof BaseQuestion>(
        field: K,
        value: BaseQuestion[K],
    ) => {
        setDraft({ ...(draft as AnyQuestion), [field]: value } as AnyQuestion);
    };

    const handleTypeChange = (type: QuestionType) => {
        const base: BaseQuestion = {
            title: draft.title,
            points: draft.points,
            text: draft.text,
            type,
        };

        let newDraft: AnyQuestion;
        if (type === "MULTIPLE_CHOICE") {
            newDraft = {
                ...base,
                type: "MULTIPLE_CHOICE",
                choices: [
                    { id: "A", text: "Option 1" },
                    { id: "B", text: "Option 2" },
                ],
                correctChoiceIds: ["A"],   // default one correct
            };
        } else if (type === "TRUE_FALSE") {
            newDraft = {
                ...base,
                type: "TRUE_FALSE",
                correct: true,
            };
        } else {
            newDraft = {
                ...base,
                type: "FILL_IN_BLANK",
                answers: [""],
            };
        }
        setDraft(newDraft);
    };

    // ---------- MC helpers (multi-correct) ----------
    const updateChoiceText = (choiceId: string, text: string) => {
        if (draft.type !== "MULTIPLE_CHOICE") return;
        const updatedChoices = draft.choices.map((c) =>
            c.id === choiceId ? { ...c, text } : c,
        );
        setDraft({ ...draft, choices: updatedChoices });
    };

    const addChoice = () => {
        if (draft.type !== "MULTIPLE_CHOICE") return;
        const nextIndex = draft.choices.length + 1;
        const nextId = String.fromCharCode("A".charCodeAt(0) + nextIndex - 1);
        setDraft({
            ...draft,
            choices: [...draft.choices, { id: nextId, text: `Option ${nextIndex}` }],
        });
    };

    const removeChoice = (choiceId: string) => {
        if (draft.type !== "MULTIPLE_CHOICE") return;
        if (draft.choices.length <= 2) return;

        const filteredChoices = draft.choices.filter((c) => c.id !== choiceId);

        // Remove that choice from the correct list as well
        const currentCorrect = draft.correctChoiceIds ?? [];
        const nextCorrect = currentCorrect.filter((id) =>
            id !== choiceId && filteredChoices.some((c) => c.id === id),
        );

        setDraft({
            ...draft,
            choices: filteredChoices,
            correctChoiceIds: nextCorrect,
        });
    };

    const toggleCorrectChoice = (choiceId: string) => {
        if (draft.type !== "MULTIPLE_CHOICE") return;

        const current = draft.correctChoiceIds ?? [];
        const exists = current.includes(choiceId);
        const next = exists
            ? current.filter((id) => id !== choiceId)
            : [...current, choiceId];

        setDraft({ ...draft, correctChoiceIds: next });
    };

    // ---------- TF helpers ----------
    const setTrueFalseCorrect = (value: boolean) => {
        if (draft.type !== "TRUE_FALSE") return;
        setDraft({ ...draft, correct: value });
    };

    // ---------- FIB helpers ----------
    const updateAnswer = (index: number, text: string) => {
        if (draft.type !== "FILL_IN_BLANK") return;
        const updated = [...draft.answers];
        updated[index] = text;
        setDraft({ ...draft, answers: updated });
    };

    const addAnswer = () => {
        if (draft.type !== "FILL_IN_BLANK") return;
        setDraft({ ...draft, answers: [...draft.answers, ""] });
    };

    const removeAnswer = (index: number) => {
        if (draft.type !== "FILL_IN_BLANK") return;
        if (draft.answers.length <= 1) return;
        const updated = draft.answers.filter((_, i) => i !== index);
        setDraft({ ...draft, answers: updated });
    };

    return (
        <Form>
            {/* Title + Points + Type */}
            <Form.Group className="mb-3">
                <Form.Label>Question Title</Form.Label>
                <Form.Control
                    type="text"
                    value={draft.title}
                    onChange={(e) => handleBaseChange("title", e.target.value)}
                />
            </Form.Group>

            <Row className="mb-3">
                <Form.Label as={Col} md={3}>
                    Points
                </Form.Label>
                <Col md={3}>
                    <Form.Control
                        type="number"
                        value={draft.points}
                        onChange={(e) =>
                            handleBaseChange("points", Number(e.target.value) || 0)
                        }
                    />
                </Col>
                <Form.Label as={Col} md={3}>
                    Question Type
                </Form.Label>
                <Col md={3}>
                    <Form.Select
                        value={draft.type}
                        onChange={(e) =>
                            handleTypeChange(e.target.value as QuestionType)
                        }
                    >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True / False</option>
                        <option value="FILL_IN_BLANK">Fill in the Blank</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Question text - WYSIWYG */}
            <Form.Group className="mb-3">
                <Form.Label>Question Text</Form.Label>
                <WysiwygEditor
                    value={draft.text}
                    onChange={(html) => handleBaseChange("text", html)}
                />
            </Form.Group>

            {/* Type-specific editors */}
            {draft.type === "MULTIPLE_CHOICE" && (
                <div className="mb-3">
                    <Form.Label>Choices</Form.Label>
                    {draft.choices.map((choice) => (
                        <Row key={choice.id} className="align-items-center mb-2">
                            <Col xs="auto">
                                {/* checkbox for multi-correct */}
                                <Form.Check
                                    type="checkbox"
                                    checked={
                                        draft.correctChoiceIds?.includes(choice.id) ?? false
                                    }
                                    onChange={() => toggleCorrectChoice(choice.id)}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={choice.text}
                                    onChange={(e) =>
                                        updateChoiceText(choice.id, e.target.value)
                                    }
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeChoice(choice.id)}
                                    disabled={draft.choices.length <= 2}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={addChoice}
                    >
                        + Add Option
                    </Button>
                </div>
            )}

            {draft.type === "TRUE_FALSE" && (
                <div className="mb-3">
                    <Form.Label>Correct Answer</Form.Label>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            id="tf-true"
                            label="True"
                            checked={draft.correct === true}
                            onChange={() => setTrueFalseCorrect(true)}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            id="tf-false"
                            label="False"
                            checked={draft.correct === false}
                            onChange={() => setTrueFalseCorrect(false)}
                        />
                    </div>
                </div>
            )}

            {draft.type === "FILL_IN_BLANK" && (
                <div className="mb-3">
                    <Form.Label>Accepted Answers (case-insensitive)</Form.Label>
                    {draft.answers.map((ans, idx) => (
                        <Row key={idx} className="mb-2">
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={ans}
                                    onChange={(e) => updateAnswer(idx, e.target.value)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeAnswer(idx)}
                                    disabled={draft.answers.length <= 1}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={addAnswer}
                    >
                        + Add Accepted Answer
                    </Button>
                </div>
            )}

            {/* Question-level buttons */}
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={onCancel} disabled={saving}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSaveDraft} disabled={saving}>
                    {saving ? "Saving..." : "Save Question"}
                </Button>
            </div>
        </Form>
    );
}

