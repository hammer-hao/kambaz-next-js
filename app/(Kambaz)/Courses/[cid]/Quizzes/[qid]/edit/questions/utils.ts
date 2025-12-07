import { QuestionType } from "./types"

export function prettyQuestionType(type: QuestionType) {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return "Multiple Choice";
    case "TRUE_FALSE":
      return "True / False";
    case "FILL_IN_BLANK":
      return "Fill in the Blank";
    default:
      return type;
  }
}