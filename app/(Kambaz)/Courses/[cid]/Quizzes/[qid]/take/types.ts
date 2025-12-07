export type BackendQuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "FILL_IN_BLANK";

export interface BackendQuestion {
  _id: string;
  quizId: string;
  type: BackendQuestionType;
  title?: string;
  points?: number;
  text?: string;
  choices?: string[];
  correctChoiceIndexes?: number[];
  correctChoiceIndex?: number; // fallback
  correctBool?: boolean;
  blanks?: string[];
}

export interface QuizMeta {
  _id: string;
  course: string;
  title: string;
  totalPoints?: number;
  multipleAttempts?: boolean;
  maxAttempts?: number;
}

export type UserAnswer =
  | { type: "MULTIPLE_CHOICE"; choiceIndexes: number[] }
  | { type: "TRUE_FALSE"; value: boolean | null }
  | { type: "FILL_IN_BLANK"; text: string };

export interface QuestionResult {
  correct: boolean;
  earnedPoints: number;
}

export interface AttemptAnswer {
  questionId: string;
  type: BackendQuestionType;
  choiceIndexes?: number[];
  value?: boolean;
  text?: string;
  correct: boolean;
  earnedPoints: number;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  studentId: string;
  submittedAt: string;
  score: number;
  totalPoints: number;
  answers: AttemptAnswer[];
}

export interface AttemptsMeta {
  attemptsUsed: number;
  lastAttempt: QuizAttempt | null;
}