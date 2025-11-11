"use client"
import { useState } from "react";
import Link from "next/link";
import * as db from "../Database";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardImg from "react-bootstrap/CardImg";
import CardBody from "react-bootstrap/CardBody";
import CardTitle from "react-bootstrap/CardTitle";
import CardText from "react-bootstrap/CardText";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { v4 as uuidv4 } from "uuid";
import {FormControl} from "react-bootstrap";

export default function Dashboard() {
  const [courses, setCourses] = useState<any[]>(db.courses);
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const addNewCourse = () => {
    const newCourse = { ...course, _id: uuidv4() };
    setCourses([...courses, newCourse ]);
  };
  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course._id !== courseId));
  };


  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>New Course
        <button className="btn btn-primary float-end"
                id="wd-add-new-course-click"
                onClick={addNewCourse} > Add </button>
      </h5> <br />
      <FormControl value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value }) }/>
      <FormControl value={course.description} rows={3} onChange={(e) => setCourse({ ...course, description: e.target.value }) }/>
      <hr />

      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
        <div id="wd-dashboard-courses">
            <Row xs = {1} md = {5} className="g-4">
                {courses.map((course) => (
                    // eslint-disable-next-line react/jsx-key
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href={`/Courses/${course._id}/Home`}
                                  className="wd-dashboard-course-link text-decoration-none text-dark" >
                                <CardImg src="/images/reactjs.webp" variant="top" width="100%" height={160} />
                                <CardBody className="card-body">
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                        {course.name} </CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        {course.description} </CardText>
                                    <Button variant="primary"> Go </Button>
                                    <button onClick={(event) => {
                                      event.preventDefault();
                                      deleteCourse(course._id);
                                    }} className="btn btn-danger float-end"
                                            id="wd-delete-course-click">
                                      Delete
                                    </button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                ))}

                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/reactjs.webp" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Full Stack software developer</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/cr2000.jpg" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CR2000</CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Fundamentals of Clash Royale</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/pl3000.jpg" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">PL3000</CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Airbus 330 Flying Theory</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/fo4000.webp" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">FO4000 </CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Advanced Formula One Driving</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/vo5000.webp" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">VO5000 </CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Seminar on topics in volleyball</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/mc6000.jpg" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">MC6000 </CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Introduction to Minecraft Speedrunning</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/se7000.jpg" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">SE7000 </CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Speed Eating Theory</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col className="wd-dashboard-course" style={{ width: "300px" }}>*/}
                {/*    <Card>*/}
                {/*        <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">*/}
                {/*            <CardImg variant="top" src="/images/yp8000.jpg" width="100%" height={160} />*/}
                {/*            <CardBody>*/}
                {/*                <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">YP8000 </CardTitle>*/}
                {/*                <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>*/}
                {/*                    Advanced Topics in Yapology</CardText>*/}
                {/*                <Button variant="primary">Go</Button>*/}
                {/*            </CardBody>*/}
                {/*        </Link>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
            </Row>
        </div>
      </div>
    )
}