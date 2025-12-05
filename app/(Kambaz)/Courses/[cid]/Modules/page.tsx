"use client";
import { setModules, addModule, editModule, updateModule, deleteModule }
    from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as client from "../../client";

import ModulesControls from "./ModulesControls";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/LessonControlButtons";
import ModuleControlButtons from "@/app/(Kambaz)/Courses/[cid]/Modules/ModuleControlButtons";

export default function Modules() {
    const { cid } = useParams<{ cid: string }>();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const dispatch = useDispatch();

    const account = useSelector((s: RootState) =>
        s.accountReducer
    ) as { currentUser: { role?: string } | null };

    const currentUser = account.currentUser;
    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const fetchModules = async () => {
        if (!cid) return;
        const modules = await client.findModulesForCourse(cid as string);
        dispatch(setModules(modules));
    };

    const onCreateModuleForCourse = async () => {
        if (!cid || !isFaculty) return; // only faculty can create
        const newModule = { name: moduleName, course: cid };
        const modul = await client.createModuleForCourse(cid, newModule);
        dispatch(setModules([...modules, modul]));
    };

    const onRemoveModule = async (moduleId: string) => {
        if (!cid || !isFaculty) return; // only faculty can delete
        await client.deleteModule(cid, moduleId);
        dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    };

    const onUpdateModule = async (module: any) => {
        if (!cid || !isFaculty) return; // only faculty can update
        await client.updateModule(cid, module);
        const newModules = modules.map((m: any) =>
            m._id === module._id ? module : m
        );
        dispatch(setModules(newModules));
    };

    useEffect(() => {
        fetchModules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cid]);

    return (
        <div>
            {/* Only faculty can see the controls for adding modules */}
            {isFaculty && (
                <>
                    <ModulesControls
                        setModuleName={setModuleName}
                        moduleName={moduleName}
                        addModule={onCreateModuleForCourse}
                    />
                    <br /><br /><br /><br />
                </>
            )}

            <ListGroup className="rounded-0" id="wd-modules">
                {modules.map((module) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const isEditing = "editing" in module && !!(module as any).editing;

                    return (
                        <ListGroupItem
                            key={module._id}
                            className="wd-module p-0 mb-5 fs-5 border-gray"
                        >
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 fs-3" />

                                {!isEditing && module.name}

                                {isEditing && isFaculty && (
                                    <FormControl
                                        className="w-50 d-inline-block"
                                        onChange={(e) =>
                                            dispatch(
                                                updateModule({
                                                    ...module,
                                                    name: e.target.value,
                                                }),
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                onUpdateModule({
                                                    ...module,
                                                    editing: false,
                                                });
                                            }
                                        }}
                                        defaultValue={module.name}
                                    />
                                )}

                                {/* Only faculty see the module edit/delete controls */}
                                {isFaculty && (
                                    <ModuleControlButtons
                                        moduleId={module._id}
                                        deleteModule={(moduleId) => onRemoveModule(moduleId)}
                                        editModule={(moduleId) =>
                                            dispatch(editModule(moduleId))
                                        }
                                    />
                                )}
                            </div>

                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {module.lessons.map((lesson) => (
                                        <ListGroupItem
                                            key={lesson._id}
                                            className="wd-lesson p-3 ps-1"
                                        >
                                            <BsGripVertical className="me-2 fs-3" />{" "}
                                            {lesson.name} <LessonControlButtons />
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
        </div>
    );
}
