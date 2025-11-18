"use client"
import React, { useState } from "react";
import {FormControl} from "react-bootstrap";
export default function WorkingWithObjects() {
    const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
    const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
    const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

    const [assignment, setAssignment] = useState({
        id: 1,
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10",
        completed: false,
        score: 0,
    });

    const [moduleObj, setModuleObj] = useState({
        id: "M101",
        name: "Intro to React",
        description: "Learn React fundamentals",
        course: "CS4550",
    });

    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>

            {/* RETRIEVE MODULE */}
            <h4>Module</h4>
            <a className="btn btn-primary"
               id="wd-get-module"
               href={`${MODULE_API_URL}`}>
                Get Module
            </a>

            <a className="btn btn-secondary ms-2"
               id="wd-get-module-name"
               href={`${MODULE_API_URL}/name`}>
                Get Module Name
            </a>
            <hr/>

            {/* EDIT MODULE NAME */}
            <h4>Modify Module Name</h4>
            <a className="btn btn-primary float-end"
               id="wd-update-module-name"
               href={`${MODULE_API_URL}/name/${moduleObj.name}`}>
                Update Module Name
            </a>
            <FormControl
                className="w-75"
                id="wd-module-name"
                defaultValue={moduleObj.name}
                onChange={(e) =>
                    setModuleObj({ ...moduleObj, name: e.target.value })
                }
            />
            <hr/>

            {/* EDIT MODULE DESCRIPTION */}
            <h4>Modify Module Description</h4>
            <a className="btn btn-primary float-end"
               id="wd-update-module-description"
               href={`${MODULE_API_URL}/description/${moduleObj.description}`}>
                Update Description
            </a>
            <FormControl
                className="w-75"
                id="wd-module-description"
                defaultValue={moduleObj.description}
                onChange={(e) =>
                    setModuleObj({ ...moduleObj, description: e.target.value })
                }
            />
            <hr/>

            {/* MODIFY ASSIGNMENT SCORE */}
            <h4>Modify Assignment Score</h4>
            <a className="btn btn-primary float-end"
               id="wd-update-assignment-score"
               href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                Update Score
            </a>
            <FormControl
                type="number"
                className="w-25"
                id="wd-assignment-score"
                defaultValue={assignment.score}
                onChange={(e) =>
                    setAssignment({ ...assignment, score: Number(e.target.value) })
                }
            />
            <hr/>

            {/* MODIFY ASSIGNMENT COMPLETED */}
            <h4>Modify Assignment Completed</h4>
            <a className="btn btn-primary float-end"
               id="wd-update-assignment-completed"
               href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                Update Completed
            </a>

            <input
                type="checkbox"
                id="wd-assignment-completed"
                className="form-check-input"
                checked={assignment.completed}
                onChange={(e) =>
                    setAssignment({ ...assignment, completed: e.target.checked })
                }
            />
            <label className="ms-2">Completed</label>
            <hr/>
        </div>
    );
}