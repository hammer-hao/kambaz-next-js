import GreenCheckmark from "@/app/(Kambaz)/Courses/[cid]/Modules/GreenCheckMark";
import {BsPlus} from "react-icons/bs";
import {IoEllipsisVertical} from "react-icons/io5";

export default function AssignmentControlButtons({text} : {text: string}) {
    return (
        <div className="float-end">
            <span className="fs-6"> {text} </span>
            <BsPlus />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}