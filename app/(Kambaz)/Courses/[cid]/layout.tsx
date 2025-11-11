"use client"
import {ReactNode, useState} from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    const { cid } = useParams();
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const course = courses.find((course: any) => course._id === cid);

    const [navOpen, setNavOpen] = useState(true);

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1" onClick={() => setNavOpen(o => !o)}/>
                {course?.name}
            </h2>
            <hr />
            <div className="d-flex">
                {navOpen && (
                    <div className="me-4">
                        <CourseNavigation />
                    </div>
                )}
                <div className="flex-fill">
                    {children}
                </div>
            </div>
        </div>
    );}