import c from "chalk";
import { Answers, prompt as originalPrompt, Question } from "inquirer";

import { create, LEVEL_INFO, Logger } from "./logger";
import { ensureArray } from "./misc";

export function prompt(
  questions: Question[] | Question,
  logTag: string = c`{green  ? }`,
  level = LEVEL_INFO
): Promise<Answers> {
  const newQuestions = ensureArray(questions).map(question => ({
    prefix: create(logTag).prefix(level),
    ...question
  }));

  return originalPrompt(newQuestions);
}

export interface IBasicCredentials {
  login?: string;
  password?: string;
}

export async function askForCredentials(
  { login, password }: IBasicCredentials,
  website: string,
  log: Logger
) {
  const questions = [];
  log.info(c`Enter your login details for {cyan ${website}}`);

  if (!login) {
    questions.push({
      type: "input",
      name: "login",
      message: "Enter your login:",
      validate: (input = "") =>
        Boolean(input.length) || "Please enter a valid login (non-empty)"
    });
  }

  if (!password) {
    questions.push({
      type: "password",
      name: "password",
      message: "Enter your password:",
      validate: (input = "") =>
        Boolean(input.length) || "Please enter a valid password"
    });
  }

  try {
    const result = await prompt(questions);
    return { login, password, ...result };
  } catch (error) {
    log.e(`Failed to gather login information for ${website}`, error);
    throw error;
  }
}
