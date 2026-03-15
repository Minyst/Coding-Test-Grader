export interface Problem {
  id: string;
  title: string;
  topicId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  constraints: string[];
  examples: ProblemExample[];
  testCases: TestCase[];
  hints: string[];
  solution: ProblemSolution;
  starterCode: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ProblemSolution {
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface SubmissionResult {
  problemId: string;
  isCorrect: boolean;
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  output: string;
  error?: string;
}
