"use client"
import { useParams } from "next/navigation";
import * as db from "../../../Database";

import ModulesControls from "./ModulesControls";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";

export default function Modules() {
    const { cid } = useParams();
    const modules = db.modules;

    return (
        <div>
            <ModulesControls /><br /><br /><br /><br />
            <ListGroup className= "rounded-0" id="wd-modules">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 fs-3" /> {module.name} <ModuleControlButtons /> </div>
                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson: any) => (
                                        <ListGroupItem className="wd-lesson p-3 ps-1">
                                            <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons /> </ListGroupItem>
                                    ))}</ListGroup>)}</ListGroupItem>))}
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
