import { diffLines } from "diff";

/** 코드를 정규화: 공백/탭/빈줄 통일 */
function normalizeWhitespace(code: string): string {
  return code
    .split("\n")
    .map((line) => line.replace(/\t/g, "    "))
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== "")
    .join("\n")
    .trim();
}

/**
 * 구조적 정규화: 변수명을 추상화하여 로직 비교
 * - 변수명을 등장 순서대로 v0, v1, v2... 로 치환
 * - Python 키워드/빌트인은 보존
 */
const PYTHON_KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await",
  "break", "class", "continue", "def", "del", "elif", "else", "except",
  "finally", "for", "from", "global", "if", "import", "in", "is",
  "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
  "while", "with", "yield",
  // builtins
  "print", "len", "range", "int", "str", "float", "list", "dict", "set",
  "tuple", "bool", "type", "enumerate", "zip", "map", "filter", "sorted",
  "reversed", "min", "max", "sum", "abs", "all", "any", "append", "pop",
  "extend", "insert", "remove", "sort", "keys", "values", "items",
  "get", "update", "copy", "clear",
  "self", "cls", "super", "__init__",
  "deque", "defaultdict", "heapq", "heappush", "heappop", "heapify",
  "collections", "itertools", "math", "bisect",
]);

function normalizeVariableNames(code: string): string {
  const varMap = new Map<string, string>();
  let varCounter = 0;

  // 식별자 추출 (Python 변수명 패턴)
  return code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
    if (PYTHON_KEYWORDS.has(match)) return match;
    // 숫자만으로 된 것은 무시
    if (/^\d+$/.test(match)) return match;

    if (!varMap.has(match)) {
      varMap.set(match, `v${varCounter++}`);
    }
    return varMap.get(match)!;
  });
}

/** 전체 정규화 파이프라인 */
function normalizeForComparison(code: string): string {
  let normalized = normalizeWhitespace(code);
  normalized = normalizeVariableNames(normalized);
  return normalized;
}

/** 두 코드의 유사도를 0~100 사이 값으로 계산 */
export function calculateSimilarity(userCode: string, answerCode: string): number {
  // 1단계: 정확히 같은 코드인지 확인
  const wsUser = normalizeWhitespace(userCode);
  const wsAnswer = normalizeWhitespace(answerCode);
  if (wsUser === wsAnswer) return 100;
  if (!wsUser) return 0;

  // 2단계: 변수명 추상화 후 비교 (로직 동일성 검사)
  const structUser = normalizeForComparison(userCode);
  const structAnswer = normalizeForComparison(answerCode);
  if (structUser === structAnswer) return 100;

  // 3단계: 줄 단위 diff로 유사도 계산 (변수명 추상화 적용)
  const changes = diffLines(structAnswer, structUser, {
    ignoreWhitespace: true,
  });

  const totalLines = structAnswer.split("\n").length;
  let matchedLines = 0;

  for (const change of changes) {
    if (!change.added && !change.removed) {
      matchedLines += change.value.split("\n").filter((l) => l.trim()).length;
    }
  }

  return Math.round((matchedLines / totalLines) * 100);
}

/** 채점 결과를 반환 */
export function gradeSubmission(userCode: string, answerCode: string) {
  const similarity = calculateSimilarity(userCode, answerCode);
  const isCorrect = similarity >= 95;

  let grade: "perfect" | "close" | "partial" | "wrong";
  let message: string;
  let emoji: string;

  if (similarity === 100) {
    grade = "perfect";
    message = "정답입니다! 로직이 동일합니다.";
    emoji = "🎉";
  } else if (similarity >= 90) {
    grade = "close";
    message = "거의 정답입니다! 약간의 차이가 있습니다.";
    emoji = "👍";
  } else if (similarity >= 50) {
    grade = "partial";
    message = "부분적으로 맞았습니다. 정답을 참고해보세요.";
    emoji = "🤔";
  } else {
    grade = "wrong";
    message = "많이 다릅니다. 다시 시도해보세요!";
    emoji = "💪";
  }

  return { similarity, isCorrect, grade, message, emoji };
}

/** diff 결과를 줄 단위로 반환 (UI 표시용 - 원본 코드 기준) */
export function getDiffLines(userCode: string, answerCode: string) {
  const normalizedUser = normalizeWhitespace(userCode);
  const normalizedAnswer = normalizeWhitespace(answerCode);

  return diffLines(normalizedAnswer, normalizedUser, {
    ignoreWhitespace: true,
  });
}
