export const QUIZZES_API = "http://localhost:4000/api/quizzes";
export const COURSES_API = "http://localhost:4000/api/courses";
export const QUESTIONS_API = "http://localhost:4000/api/questions";

// Fetch all quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
    const response = await fetch(`${COURSES_API}/${courseId}/quizzes`);
    return await response.json();
};

// Create a quiz
export const createQuizForCourse = async (courseId: string, quiz: any) => {
    const response = await fetch(`${COURSES_API}/${courseId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
    });
    return await response.json();
};

export const findQuizById = async (quizId: string) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}`);
    return await response.json();
}

export const deleteQuizById = async (quizId: string) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}`, { method: "DELETE" });
    return await response.json();
}

// Update quiz
export const updateQuizOnServer = async (quizId: string, quiz: any) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
    });
    return await response.json();
};

export const publishQuiz = async (quizId: string) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}/publish`, { method: "POST" });
    return await response.json();
}

export const unPublishQuiz = async (quizId: string) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}/publish`, { method: "DELETE" });
    return await response.json();
}

export const getQuestionsForQuiz = async (quizId: string) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}/questions`);
    return await response.json();
}

export const addQuestionToQuiz = async (quizId: string, question: any) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
    });
    return await response.json();
}

export const updateQuestionOnQuiz = async (quizId: string, questionId: string, question: any) => {
    const response = await fetch(`${QUESTIONS_API}/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
    });
    return await response.json();
}

export const deleteQuestionFromQuiz = async (quizId: string, questionId: string) => {
    const response = await fetch(`${QUESTIONS_API}/${questionId}`, { method: "DELETE" });
    return await response.json();
}


export const getMyAttemptsForQuiz = async (quizId: string) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}/attempts/me`, {
        credentials: "include",
    });
    return await response.json();
};

export const submitQuizAttempt = async (quizId: string, payload: any) => {
    const response = await fetch(`${QUIZZES_API}/${quizId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    return await response.json();
};
