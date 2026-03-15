import { runPython } from "./pyodide-runner";
import type { TestCaseConfig, TestResult } from "./types";

export interface RunResult {
  passed: boolean;
  testResults: TestResult[];
  passedCount: number;
  totalCount: number;
  error?: string;
}

export async function runTestCases(
  userCode: string,
  config: TestCaseConfig
): Promise<RunResult> {
  const testResults: TestResult[] = [];

  for (const tc of config.test_cases) {
    let callCode: string;

    if (config.call_type === "script") {
      // 스크립트형: 전체 코드 실행 후 print 출력 비교
      callCode = `${userCode}\n${tc.input}`;
    } else if (config.call_type === "class") {
      // 클래스형: 유저 코드 정의 후 테스트 시퀀스 실행
      callCode = `${userCode}\n${tc.input}`;
    } else {
      // 함수형: 유저 코드 정의 후 함수 호출
      callCode = `${userCode}\nprint(repr(${config.function_name}(${tc.input})))`;
    }

    const result = await runPython(callCode, 10000);

    if (result.error) {
      testResults.push({
        input: tc.input,
        expected: tc.expected,
        actual: `Error: ${result.error}`,
        passed: false,
        error: result.error,
      });
      continue;
    }

    const actual = result.stdout.trim();
    const expected = tc.expected.trim();
    const passed = normalizeOutput(actual) === normalizeOutput(expected);

    testResults.push({
      input: tc.input,
      expected,
      actual,
      passed,
    });
  }

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;

  return {
    passed: passedCount === totalCount,
    testResults,
    passedCount,
    totalCount,
  };
}

/** 출력 비교 정규화: 공백/따옴표 차이 무시 */
function normalizeOutput(output: string): string {
  return output
    .replace(/'/g, '"') // Python repr은 작은따옴표를 쓰므로 통일
    .replace(/\s+/g, " ") // 연속 공백 통일
    .trim();
}

/** 단순 코드 실행 (채점 없이 stdout 확인용) */
export async function executeCode(
  code: string
): Promise<{ stdout: string; stderr: string; error: string | null }> {
  return runPython(code, 10000);
}
