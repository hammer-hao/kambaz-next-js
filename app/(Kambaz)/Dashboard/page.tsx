import Link from "next/link";
import Image from "next/image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardImg from "react-bootstrap/CardImg";
import CardBody from "react-bootstrap/CardBody";
import CardTitle from "react-bootstrap/CardTitle";
import CardText from "react-bootstrap/CardText";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs = {1} md = {5} className="g-4">
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/reactjs.webp" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Full Stack software developer</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/cr2000.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CR2000</CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Fundamentals of Clash Royale</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/pl3000.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">PL3000</CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Airbus 330 Flying Theory</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/fo4000.webp" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">FO4000 </CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Advanced Formula One Driving</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/vo5000.webp" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">VO5000 </CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Seminar on topics in volleyball</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/mc6000.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">MC6000 </CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Introduction to Minecraft Speedrunning</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/se7000.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">SE7000 </CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Speed Eating Theory</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234" className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/yp8000.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">YP8000 </CardTitle>
                                    <CardText  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Advanced Topics in Yapology</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}