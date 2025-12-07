import {Button, Col, Form, Row} from "react-bootstrap";
import WysiwygEditor from "./WysiwygEditor";

import {
  QuestionType,
  BaseQuestion, AnyQuestion
} from "./types"

export default function QuestionEditorForm({
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