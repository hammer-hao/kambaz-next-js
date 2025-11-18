import EnvironmentVariables from "./EnvironmentVariables";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import WorkingWithObjects from "./workingWithObjects";
import WorkingWithArrays from "./WorkingWithArrays";
import HttpClient from "./HttpClient"
import WorkingWithObjectsAsynchronously from "./WorkingWithObjectsAsynchronously";
import WorkingWithArraysAsynchronously from "./WorkingWithArraysAsynchronously";

export default function Lab5() {
    return (
        <div id="wd-lab5">
            <h2>Lab 5</h2>
            <div className="list-group">
                <a href={`${HTTP_SERVER}/lab5/welcome`}
                   className="list-group-item">
                    Welcome
                </a>
            </div><hr/>
            <EnvironmentVariables/>
            <PathParameters/>
            <QueryParameters/>
            <WorkingWithObjects/>
            <WorkingWithArrays/>
            <HttpClient/>
            <WorkingWithObjectsAsynchronously/>
            <WorkingWithArraysAsynchronously/>
        </div>
    );}
