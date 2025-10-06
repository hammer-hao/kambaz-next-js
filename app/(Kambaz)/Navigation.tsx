import Link from "next/link";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {FaRegCircleUser} from "react-icons/fa6";
import {AiOutlineDashboard} from "react-icons/ai";
import { FaBook } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { HiMiniBeaker } from "react-icons/hi2";
export default function KambazNavigation() {
    return (
        <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 110 }}
                   id="wd-kambaz-navigation">
            <ListGroupItem className="bg-black border-0 text-center" as="a"
                           target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
                <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none">
                    <FaRegCircleUser className="fs-1 text-white" />
                    <br />
                    Account
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-white text-center">
                <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none">
                    <AiOutlineDashboard className="fs-1 text-danger" />
                    <br />
                    Dashboard
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href = "/Dashboard" id="wd-course-link" className="text-white text-decoration-none">
                    <FaBook className="fs-1 text-danger" />
                    <br />
                    Courses
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href = "/Calendar" id="wd-calendar-link" className="text-white text-decoration-none">
                    <FaCalendarAlt className="fs-1 text-danger" />
                    <br />
                    Calendar
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href = "/Inbox" id="wd-inbox-link" className="text-white text-decoration-none">
                    <IoMdMail className="fs-1 text-danger" />
                    <br />
                    Inbox
                </Link>
            </ListGroupItem>
            <ListGroupItem className="border-0 bg-black text-center">
                <Link href = "/Labs" id="wd-labs-link" className="text-white text-decoration-none">
                    <HiMiniBeaker className="fs-1 text-danger" />
                    <br />
                    Labs
                </Link>
            </ListGroupItem>

        </ListGroup>
        // <div id="wd-kambaz-navigation">
        //     <a href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank">Northeastern</a><br/>
        //     <Link href="/Account" id="wd-account-link">Account</Link><br/>
        //     <Link href="/Dashboard" id="wd-dashboard-link">Dashboard</Link><br/>
        //     <Link href="/Dashboard" id="wd-course-link">Courses</Link><br/>
        //     <Link href="/Calendar" id="wd-calendar-link">Calendar</Link><br/>
        //     <Link href="/Inbox" id="wd-inbox-link">Inbox</Link><br/>
        //     <Link href="/Labs" id="wd-labs-link">Labs</Link><br/>
        // </div>
    );}
