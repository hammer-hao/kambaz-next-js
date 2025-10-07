import Link from "next/link";
import AssignmentControls from "@/app/(Kambaz)/Courses/[cid]/Assignments/AssignmentControls";

export default function Assignments() {
    return (
        <div id="wd-assignments">
            <AssignmentControls /> <br />
            <input placeholder="Search for Assignments"
                   id="wd-search-assignment" />
            <button id="wd-add-assignment-group">+ Group</button>
            <button id="wd-add-assignment">+ Assignment</button>

            <h3 id="wd-assignments-title">
                ASSIGNMENTS 40% of Total <button>+</button>
            </h3>
            <ul id="wd-assignment-list">
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/123"
                          className="wd-assignment-link">
                        A1 - ENV + HTML
                    </Link><br/>
                    Multiple Modules | <strong> Not available until </strong> May 6 at 12:00am |
                    <strong> Due </strong> May 13 at 11:59pm | 100pts
                </li>
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/456"
                          className="wd-assignment-link">
                        A2 - CSS + BOOTSTRAP
                    </Link><br/>
                    Multiple Modules | <strong> Not available until </strong> May 13 at 12:00am |
                    <strong> Due </strong> May 20 at 11:59pm | 100pts
                </li>
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/789"
                          className="wd-assignment-link">
                        A3 - JAVASCRIPT + REACT
                    </Link><br/>
                    Multiple Modules | <strong> Not available until </strong> May 20 at 12:00am |
                    <strong> Due </strong> May 27 at 11:59pm | 100pts
                </li>
            </ul>

            <h3 id="wd-quizzes-title">
                QUIZZES 20% of Total <button>+</button>
            </h3>
            <ul id="wd-quiz-list">
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/101"
                          className="wd-assignment-link">
                        Quiz 1 - HTML & CSS
                    </Link><br/>
                    Module 2 | <strong> Available </strong> May 10 at 12:00am |
                    <strong> Due </strong> May 11 at 11:59pm | 50pts
                </li>
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/102"
                          className="wd-assignment-link">
                        Quiz 2 - JavaScript Basics
                    </Link><br/>
                    Module 4 | <strong> Available </strong> May 24 at 12:00am |
                    <strong> Due </strong> May 25 at 11:59pm | 50pts
                </li>
            </ul>

            <h3 id="wd-exams-title">
                EXAMS 40% of Total <button>+</button>
            </h3>
            <ul id="wd-exam-list">
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/201"
                          className="wd-assignment-link">
                        Midterm Exam
                    </Link><br/>
                    Covers Modules 1–4 | <strong> Available </strong> May 27 at 12:00am |
                    <strong> Due </strong> May 28 at 11:59pm | 200pts
                </li>
                <li className="wd-assignment-list-item">
                    <Link href="/Courses/1234/Assignments/202"
                          className="wd-assignment-link">
                        Final Exam
                    </Link><br/>
                    Covers All Modules | <strong> Available </strong> Jun 10 at 12:00am |
                    <strong> Due </strong> Jun 11 at 11:59pm | 300pts
                </li>
            </ul>
        </div>
    );
}