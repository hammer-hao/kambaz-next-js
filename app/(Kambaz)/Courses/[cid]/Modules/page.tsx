"use client"
import { addModule, editModule, updateModule, deleteModule }
    from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { useParams } from "next/navigation";
import { useState } from "react";

import ModulesControls from "./ModulesControls";
import {FormControl, ListGroup, ListGroupItem} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const dispatch = useDispatch();
    return (
        <div>
            <ModulesControls setModuleName={setModuleName} moduleName={moduleName} addModule={() => {
                dispatch(addModule({ name: moduleName, course: cid }));
                setModuleName("");
            }}/><br /><br /><br /><br />
            <ListGroup className= "rounded-0" id="wd-modules">
                {modules
                    .filter((module) => module.course === cid)
                    .map((module) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const isEditing = "editing" in module && !!(module as any).editing;

                        return (
                            <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                                <div className="wd-title p-3 ps-2 bg-secondary">
                                    <BsGripVertical className="me-2 fs-3" />
                                    {!isEditing && module.name}
                                    {isEditing && (
                                        <FormControl
                                            className="w-50 d-inline-block"
                                            onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    dispatch(updateModule({ ...module, editing: false }));
                                                }
                                            }}
                                            defaultValue={module.name}
                                        />
                                    )}
                                    <ModuleControlButtons
                                        moduleId={module._id}
                                        deleteModule={(moduleId) => dispatch(deleteModule(moduleId))}
                                        editModule={(moduleId) => dispatch(editModule(moduleId))}
                                    />
                                </div>

                                {module.lessons && (
                                    <ListGroup className="wd-lessons rounded-0">
                                        {module.lessons.map((lesson) => (
                                            <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                                                <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroupItem>
                        );
                    })}
            </ListGroup>


            {/*<ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">*/}
                {/*    <div className="wd-title p-3 ps-2 bg-secondary">*/}
                {/*        <BsGripVertical className="me-2 fs-3" /> Week 1, Lection 1 - Course Introduction, Syllabus, Agenda <ModuleControlButtons />*/}
                {/*    </div>*/}
                {/*    <ListGroup className="wd-lessons rounded-0">*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" />  Introduction to the course <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Learn What is Web Development <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Full Strack Developer - Chapter 1 - Introduction <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Full Strack Developer - Chapter 2 - Creating User interfaces with HTML <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Creating a React Application <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*    </ListGroup>*/}
                {/*</ListGroupItem>*/}
                {/*<ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">*/}
                {/*    <div className="wd-title p-3 ps-2 bg-secondary">*/}
                {/*        <BsGripVertical /> Week 1, Lecture 2- Formatting User Interfaces with HTML <ModuleControlButtons />*/}
                {/*    </div>*/}
                {/*    <ListGroup className="wd-lessons rounded-0">*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Learn how to create user interfaces with HTML <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Deploy the assignment to Netlify <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Introduction to HTML and the DOM <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Formatting Web content with Headings <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*        <ListGroupItem className="wd-lesson p-3 ps-1">*/}
                {/*            <BsGripVertical className="me-2 fs-3" /> Formatting content with lists and Tables <LessonControlButtons />*/}
                {/*        </ListGroupItem>*/}
                {/*    </ListGroup>*/}
                {/*</ListGroupItem>*/}
        </div>
    );}
