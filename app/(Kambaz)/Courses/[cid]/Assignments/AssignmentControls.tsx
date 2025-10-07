import { Button, FormControl } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import InputGroupText from "react-bootstrap/InputGroupText";
import { FaPlus, FaSearch } from "react-icons/fa";

export default function AssignmentControls() {
    return (
        <div
            id="wd-assignment-controls"
            className="text-nowrap d-flex align-items-center"
        >
            <InputGroup className="me-2" style={{ maxWidth: "300px" }}>
                <InputGroupText>
                    <FaSearch />
                </InputGroupText>
                <FormControl placeholder="Search..." />
            </InputGroup>

            <div className="ms-auto d-flex">
                <Button
                    variant="danger"
                    size="lg"
                    className="me-2"
                    id="wd-add-assignment-btn"
                >
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    Assignment
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    id="wd-add-group-btn"
                >
                    <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                    Group
                </Button>
            </div>
        </div>
    );
}