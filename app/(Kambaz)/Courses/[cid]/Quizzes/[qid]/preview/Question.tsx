import {BackendQuestion, UserAnswer} from "./types";
import {Form, ListGroup} from "react-bootstrap";

export default function Question(
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

    return (
      <Form>
        <Form.Label>Choose True or False:</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id={`preview-tf-${q._id}-true`}
            label="True"
            disabled={disabled}
            checked={value === true}
            onChange={() =>
              onChange({ type: "TRUE_FALSE", value: true })
            }
          />
          <Form.Check
            inline
            type="radio"
            id={`preview-tf-${q._id}-false`}
            label="False"
            disabled={disabled}
            checked={value === false}
            onChange={() =>
              onChange({ type: "TRUE_FALSE", value: false })
            }
          />
        </div>
      </Form>
    );
  }

  // FILL_BLANK / FILL_IN_BLANK
  const text = ans.type === "FILL_IN_BLANK" ? ans.text : "";

  return (
    <Form>
      <Form.Label>Answer:</Form.Label>
      <Form.Control
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) =>
          onChange({ type: "FILL_IN_BLANK", text: e.target.value })
        }
      />
      <Form.Text muted>
        Answer is matched case-insensitively to any of the configured blanks.
      </Form.Text>
    </Form>
  );
}