export default function Modules() {
    return (
        <div>
            <button id="wd-collapse-all-btn">Collapse All</button>
            <button id="wd-view-progress-btn">View Progress</button>
            <select id="wd-publish-all">
                <option value="PUBLISHALL">Publish All</option>
            </select>
            <button id="wd-add-module-btn">+ Module</button>
            {/* Implement Collapse All button, View Progress button, etc. */}
            <ul id="wd-modules">
                <li className="wd-module">
                    <div className="wd-title">Week 1, Lection 1 - Course Introduction, Syllabus, Agenda</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to the course</li>
                                <li className="wd-content-item">Learn what is Web Development</li>
                            </ul>
                            <span className="wd-title">READING</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Full Strack Developer - Chapter 1 - Introduction</li>
                                <li className="wd-content-item">Full Strack Developer - Chapter 2 - Creating User interfaces with HTML</li>
                            </ul>
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to Web Development</li>
                                <li className="wd-content-item">Creating an HTTP servers with Node.js</li>
                                <li className="wd-content-item">Creating a React Application</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="wd-module">
                    <div className="wd-title">Week 1, Lecture 2- Formatting User Interfaces with HTML</div>
                    <ul className="wd-lessons">
                        <li className="wd-lesson">
                            <span className="wd-title">LEARNING OBJECTIVES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Learn how to create user interfaces with HTML</li>
                                <li className="wd-content-item">Deploy the assignment to Netlify</li>
                            </ul>
                        </li>
                        <li className="wd-lesson">
                            <span className="wd-title">SLIDES</span>
                            <ul className="wd-content">
                                <li className="wd-content-item">Introduction to HTML and the DOM</li>
                                <li className="wd-content-item">Formatting Web content with Headings</li>
                                <li className="wd-content-item">Formatting content with lists and Tables</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );}
