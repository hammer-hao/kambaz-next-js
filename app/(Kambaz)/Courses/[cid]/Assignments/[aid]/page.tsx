"use client";

import { useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import {
    addAssignment,
    updateAssignment,
    type Assignment,
} from "../reducer";
import {
    createAssignment,
    updateAssignmentOnServer,
    findAssignmentById,
} from "../client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector(
        (s: RootState) => s.assignmentsReducer
    );

    const isNew = aid === "new";
    const existing = assignments.find((a) => a._id === aid);

    const [title, setTitle] = useState(existing?.title ?? "");
    const [description, setDescription] = useState(existing?.description ?? "");
    const [points, setPoints] = useState<number>(existing?.points ?? 100);
    const [due, setDue] = useState(existing?.due ?? "");
    const [from, setFrom] = useState(existing?.notAvailableUntil ?? "");
    const [until, setUntil] = useState(existing?.availableUntil ?? "");

    const coursePath = useMemo(() => `/Courses/${cid}`, [cid]);

    // If user refreshes on edit page, `existing` may be undefined — fetch from server
    useEffect(() => {
        if (isNew || existing) return;

        const load = async () => {
            try {
                const data = await findAssignmentById(aid as string);
                setTitle(data.title ?? "");
                setDescription(data.description ?? "");
                setPoints(data.points ?? 0);
                setDue(data.due ?? "");
                setFrom(data.notAvailableUntil ?? "");
                setUntil(data.availableUntil ?? "");
            } catch {
                router.push(`/Courses/${cid}/Assignments`);
            }
        };
        load();
    }, [isNew, existing, aid, cid, router]);

    const makeId = () =>
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;

    const onSave = async () => {
        const base: Assignment = {
            _id: isNew ? makeId() : (existing!._id as string),
            title: title.trim() || "Untitled Assignment",
            description,
            points: Number(points) || 0,
            due,
            notAvailableUntil: from,
            availableUntil: until,
            course: cid as string,
        };

        if (isNew) {
            const created = await createAssignment(cid as string, base);
            dispatch(addAssignment(created));
        } else {
            const updated = await updateAssignmentOnServer(base);
            dispatch(updateAssignment(updated));
        }

        router.push(`/Courses/${cid}/Assignments`);
    };

    const onCancel = () => {
        router.push(`/Courses/${cid}/Assignments`);
    };

    return (
        <div id="wd-assignments-editor" className="p-3">
            <Form>
                <Form.Group className="mb-3" controlId="wd-name">
                    <Form.Label className="fw-semibold">Assignment Name</Form.Label>
                    <Form.Control
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Card className="mb-4 border">
                    <Card.Body>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Card.Body>
                </Card>

                <Form.Group as={Row} className="mb-3" controlId="wd-points">
                    <Form.Label column md={3} className="fw-semibold text-md-end">
                        Points
                    </Form.Label>
                    <Col md={9}>
                        <Form.Control
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                        />
                    </Col>
                </Form.Group>

                {/* (rest of your form is unchanged) */}

                <Form.Group as={Row} className="mb-3" controlId="wd-group">
                    <Form.Label column md={3} className="fw-semibold text-md-end">
                        Assignment Group
                    </Form.Label>
                    <Col md={9}>
                        <Form.Select defaultValue="ASSIGNMENTS">
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECTS">PROJECTS</option>
                            <option value="OTHER">OTHER</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="wd-display-grade-as">
                    <Form.Label column md={3} className="fw-semibold text-md-end">
                        Display Grade as
                    </Form.Label>
                    <Col md={9}>
                        <Form.Select defaultValue="Percentage">
                            <option value="Percentage">Percentage</option>
                            <option value="Points">Points</option>
                            <option value="Letter">Letter</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-4" controlId="wd-submission-type">
                    <Form.Label column md={3} className="fw-semibold text-md-end">
                        Submission Type
                    </Form.Label>
                    <Col md={9}>
                        <Form.Select className="mb-3" defaultValue="Online">
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </Form.Select>

                        <Card className="border">
                            <Card.Body>
                                <div className="fw-semibold mb-2">Online Entry Options</div>
                                <Stack gap={2}>
                                    <Form.Check
                                        type="checkbox"
                                        id="wd-text-entry"
                                        label="Text Entry"
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="wd-website-url"
                                        label="Website URL"
                                        defaultChecked
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="wd-media-recordings"
                                        label="Media Recordings"
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="wd-student-annotations"
                                        label="Student Annotation"
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="wd-file-upload"
                                        label="File Uploads"
                                    />
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-4">
                    <Form.Label column md={3} className="fw-semibold text-md-end">
                        Assign
                    </Form.Label>
                    <Col md={9}>
                        <Card className="border">
                            <Card.Body>
                                <Form.Group className="mb-3" controlId="wd-assign-to">
                                    <Form.Label className="fw-semibold">Assign to</Form.Label>
                                    <Form.Control defaultValue="Everyone" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="wd-due-date">
                                    <Form.Label className="fw-semibold">Due</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="datetime-local"
                                            value={due}
                                            onChange={(e) => setDue(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Row className="g-3">
                                    <Col>
                                        <Form.Group controlId="wd-available-from">
                                            <Form.Label className="fw-semibold">
                                                Available from
                                            </Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={from}
                                                onChange={(e) => setFrom(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="wd-available-until">
                                            <Form.Label className="fw-semibold">
                                                Until
                                            </Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={until}
                                                onChange={(e) => setUntil(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                    <Button variant="light" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onSave}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
}