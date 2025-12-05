import Link from "next/link";
export default function Labs() {
    return (
        <div id="wd-labs">
            <h1>Zihe Hao</h1>
            <h1>Labs</h1>
            <ul>
                <li>
                    <Link href="/Labs/Lab1" id="wd-lab1-link">
                        Lab 1: HTML Examples </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab2" id="wd-lab2-link">
                        Lab 2: CSS Basics </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab3" id="wd-lab3-link">
                        Lab 3: JavaScript Fundamentals </Link>
                </li>
                <li>
                  <Link href="/Labs/Lab4" id="wd-lab4-link">
                    Lab 4: React State </Link>
                </li>
                <li>
                    <Link href="/Labs/Lab5" id="wd-lab5-link">
                        Lab 5: Node Server App </Link>
                </li>
            </ul>
            <h1>Project: Kambaz Quizzes</h1>
            <h2>Group members: Zihe Hao, Tingxun Wang (graduate section 4)</h2>
            <Link href="https://github.com/hammer-hao/kambaz-next-js/tree/quizzes">
                GitHub Repository for front end project </Link>
            <br />
            <Link href="https://github.com/hammer-hao/kambaz-node-server-app/tree/quizzes">
                GitHub Repository for server side project </Link>
        </div>
    );}
