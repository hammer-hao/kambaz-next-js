export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name">Assignment Name</label> <br />
            <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
            <textarea
                id="wd-description"
                defaultValue="Submit a link to the landing page of your Web application running on Vercel. The landing page should be the Kambaz application with a link to the Lab exercises. The Kambaz application should include a link to navigate back to the landing page."
                rows="10"
                cols="50"
            />
            <br />
            <table>
                <tbody>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" defaultValue={100} />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-group" defaultValue="ASSIGNMENTS">
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECTS">PROJECTS</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td>
                        <select id="wd-display-grade-as" defaultValue="Percentage">
                            <option value="Percentage">Percentage</option>
                            <option value="Points">Points</option>
                            <option value="Letter">Letter</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-submission-type" defaultValue="Online">
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                        <br />
                        <span>Online Entry Options</span>
                        <br />
                        <input type="checkbox" id="wd-text-entry" />
                        <label htmlFor="wd-text-entry">Text Entry</label> <br />
                        <input type="checkbox" id="wd-website-url" />
                        <label htmlFor="wd-website-url">Website URL</label> <br />
                        <input type="checkbox" id="wd-media-recordings"></input>
                        <label htmlFor="wd-media-recordings">Media Recordings</label> <br />
                        <input type="checkbox" id="wd-student-annotations"></input>
                        <label htmlFor="wd-student-annotations">Student Annotations</label> <br />
                        <input type="checkbox" id="wd-file-upload"></input>
                        <label htmlFor="wd-file-upload">File Upload</label> <br />
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <label>Assign</label>
                    </td>
                    <td>
                        <label htmlFor="wd-assign-to"></label> Assign to <br/>
                        <input id="wd-assign-to" defaultValue="Everyone"></input> <br/>
                        <label htmlFor="wd-due-date"></label> Due <br/>
                        <input id="wd-due-date" type="date" defaultValue="2025-09-01"></input> <br/>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="wd-available-from">Available From</label> <br/>
                                    <input id="wd-available-from" type="date" defaultValue="2025-09-01"></input> <br/>
                                </td>
                                <td>
                                    <label htmlFor="wd-available-until"></label> Until <br/>
                                    <input id="wd-available-until" type="date" defaultValue="2025-10-01"></input> <br/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
                {/* Complete on your own */}
            </table>
        </div>
    );}
