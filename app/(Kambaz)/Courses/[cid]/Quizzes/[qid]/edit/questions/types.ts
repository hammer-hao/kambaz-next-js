export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";

export interface BaseQuestion {
  _id?: string;
  type: QuestionType;
  title: string;
  points: number;
  text: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "MULTIPLE_CHOICE";
  choices: { id: string; text: string }[];
  correctChoiceIds: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUE_FALSE";
  correct: boolean;
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: "FILL_IN_BLANK";
  answers: string[];
}

export type AnyQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillInBlankQuestion;

export interface BackendQuestion {
  _id: string;
  quizId: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  title?: string;
  points?: number;
  text?: string;
  choices?: string[];
  correctChoiceIndexes?: number[];
  correctBool?: boolean;
  blanks?: string[];
}

// minimal quiz shape for this page
export interface QuizWithQuestionsMeta {
  _id: string;
  course: string;
  title: string;
  totalPoints?: number;
}