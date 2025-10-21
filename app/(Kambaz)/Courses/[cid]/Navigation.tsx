"use client"
import Link from "next/link";
import {useParams, usePathname} from "next/navigation";
import {ListGroupItem} from "react-bootstrap";
import {FaRegCircleUser} from "react-icons/fa6";

export default function CourseNavigation() {
    const { cid } = useParams();
    const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
    const pathname = usePathname();
    const basePath = "/Courses/"+ cid;
    console.log("Basepath", basePath);

    return (
        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">

            {links.map((link) => (
                <Link href={link === "People" ? `${basePath}/People/Table` : `${basePath}/${link}`}
                      id = {`wd-course-${link}-link`}
                      key={link}
                      className={pathname.includes(link)? "list-group-item active border-0": "list-group-item text-danger border-0"}
                >{link}</Link>
            ))}
        </div>
    );}

