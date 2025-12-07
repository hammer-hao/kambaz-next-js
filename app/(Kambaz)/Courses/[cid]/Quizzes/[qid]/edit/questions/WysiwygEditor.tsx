import {useEffect, useRef} from "react";
import {Button, Form} from "react-bootstrap";

export default function WysiwygEditor({
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