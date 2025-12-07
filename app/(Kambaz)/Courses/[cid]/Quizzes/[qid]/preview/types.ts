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

  correctChoiceIndex?: number;

  correctBool?: boolean;
  blanks?: string[];
}


export interface QuizMeta {
  _id: string;
  course: string;
  title: string;
  totalPoints?: number;
}


export type UserAnswer =
  | { type: "MULTIPLE_CHOICE"; choiceIndexes: number[] }  // <— changed
  | { type: "TRUE_FALSE"; value: boolean | null }
  | { type: "FILL_IN_BLANK"; text: string };

export interface QuestionResult {
  correct: boolean;
  earnedPoints: number;
}