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
    Button,
    Spinner,
    Alert,
    ListGroup,
} from "react-bootstrap";

import {
  BaseQuestion,
  BackendQuestion,
  QuizWithQuestionsMeta,
  AnyQuestion,
  MultipleChoiceQuestion
} from "./types"

import { prettyQuestionType } from "./utils";

import QuestionEditorForm from "./QuestionEditor";

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

