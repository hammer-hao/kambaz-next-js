"use client";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { useParams } from "next/navigation";
import { assignments } from "../../../../Database"

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const assignment = assignments.find((a) => a._id === aid)!

    console.log(assignment)

    return (
        <div id="wd-assignments-editor" className="p-3">
            {/* Assignment Name */}
            <Form>
                <Form.Group className="mb-3" controlId="wd-name">
                    <Form.Label className="fw-semibold">Assignment Name</Form.Label>
                    <Form.Control defaultValue={assignment.title} />
                </Form.Group>

                {/* Description panel */}
                <Card className="mb-4 border">
                    <Card.Body>
                        {assignment.description}
                    </Card.Body>
                </Card>

                {/* Points */}
                <Form.Group as={Row} className="mb-3" controlId="wd-points">
                    <Form.Label column md={3} className="fw-semibold text-md-end">
                        Points
                    </Form.Label>
                    <Col md={9}>
                        <Form.Control type="number" defaultValue={assignment.points} />
                    </Col>
                </Form.Group>

                {/* Assignment Group */}
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

                {/* Display Grade as */}
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

                {/* Submission Type + Online Entry Options (card on right) */}
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
                                    <Form.Check type="checkbox" id="wd-text-entry" label="Text Entry" />
                                    <Form.Check type="checkbox" id="wd-website-url" label="Website URL" defaultChecked />
                                    <Form.Check type="checkbox" id="wd-media-recordings" label="Media Recordings" />
                                    <Form.Check type="checkbox" id="wd-student-annotations" label="Student Annotation" />
                                    <Form.Check type="checkbox" id="wd-file-upload" label="File Uploads" />
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                </Form.Group>

                {/* Assign block (card on right) */}
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
                                        <Form.Control type="datetime-local" defaultValue={assignment.due} />
                                    </InputGroup>
                                </Form.Group>

                                <Row className="g-3">
                                    <Col>
                                        <Form.Group controlId="wd-available-from">
                                            <Form.Label className="fw-semibold">Available from</Form.Label>
                                            <Form.Control type="datetime-local" defaultValue={assignment.notAvailableUntil} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="wd-available-until">
                                            <Form.Label className="fw-semibold">Until</Form.Label>
                                            <Form.Control type="datetime-local" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Form.Group>

                {/* Footer actions */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                    <Button variant="light">Cancel</Button>
                    <Button variant="danger">Save</Button>
                </div>
            </Form>
        </div>
    );
}