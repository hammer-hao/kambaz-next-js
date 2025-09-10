import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link href="/Courses/1234" className="wd-dashboard-course-link">
                        <Image src="/images/reactjs.webp" width={200} height={150} alt={""} />
                        <div>
                            <h5> CS1234 React JS </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer{" "}
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/2000" className="wd-dashboard-course-link">
                        <Image src="/images/cr2000.jpg" width={200} height={150} alt={""} />
                        <div>
                            <h5> CR2000 </h5>
                            <p className="wd-dashboard-course-title">
                                Fundamentals of Clash Royale
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/3000" className="wd-dashboard-course-link">
                        <Image src="/images/pl3000.jpg" width={200} height={150} alt={""} />
                        <div>
                            <h5> PL3000 </h5>
                            <p className="wd-dashboard-course-title">
                                Airbus 330 Flying Theory
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/4000" className="wd-dashboard-course-link">
                        <Image src="/images/fo4000.webp" width={200} height={150} alt={""} />
                        <div>
                            <h5> FO4000 </h5>
                            <p className="wd-dashboard-course-title">
                                Advanced Formula One Driving
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/5000" className="wd-dashboard-course-link">
                        <Image src="/images/vo5000.webp" width={200} height={150} alt={""} />
                        <div>
                            <h5> VO5000 </h5>
                            <p className="wd-dashboard-course-title">
                                Seminar on topics in volleyball
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/6000" className="wd-dashboard-course-link">
                        <Image src="/images/mc6000.jpg" width={200} height={150} alt={""} />
                        <div>
                            <h5> MC6000 </h5>
                            <p className="wd-dashboard-course-title">
                                Introduction to Minecraft Speedrunning
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/7000" className="wd-dashboard-course-link">
                        <Image src="/images/se7000.jpg" width={200} height={150} alt={""} />
                        <div>
                            <h5> SE7000 </h5>
                            <p className="wd-dashboard-course-title">
                                Speed Eating Theory
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link href="/Courses/8000" className="wd-dashboard-course-link">
                        <Image src="/images/yp8000.jpg" width={200} height={150} alt={""} />
                        <div>
                            <h5> YP8000 </h5>
                            <p className="wd-dashboard-course-title">
                                Advanced Topics in Yapology
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}