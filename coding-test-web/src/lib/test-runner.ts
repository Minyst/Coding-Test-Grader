import { runPython } from "./pyodide-runner";
import type { TestCaseConfig, TestResult } from "./types";

/** Python 헬퍼 코드: TreeNode, ListNode 등 자동 직렬화 */
const PYTHON_HELPERS = `
# === 자료구조 헬퍼 ===
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# 리스트 → 트리 변환
def list_to_tree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# 트리 → 리스트 변환
def tree_to_list(root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result

# 리스트 → 연결리스트 변환
def list_to_linked(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

# 연결리스트 → 리스트 변환
def linked_to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

# 결과 자동 직렬화
def __smart_repr(obj):
    if obj is None:
        return repr(obj)
    if isinstance(obj, TreeNode):
        return repr(tree_to_list(obj))
    if isinstance(obj, ListNode):
        return repr(linked_to_list(obj))
    if isinstance(obj, list):
        return repr([__smart_repr_inner(x) for x in obj])
    return repr(obj)

def __smart_repr_inner(obj):
    if isinstance(obj, TreeNode):
        return tree_to_list(obj)
    if isinstance(obj, ListNode):
        return linked_to_list(obj)
    return obj
`;

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
      callCode = `${PYTHON_HELPERS}\n${userCode}\n${tc.input}`;
    } else if (config.call_type === "class") {
      // 클래스형: 유저 코드 정의 후 테스트 시퀀스 실행
      callCode = `${PYTHON_HELPERS}\n${userCode}\n${tc.input}`;
    } else {
      // 함수형: 유저 코드 정의 후 함수 호출 → 결과 자동 직렬화
      callCode = `${PYTHON_HELPERS}\n${userCode}\n__result = ${config.function_name}(${tc.input})\nprint(__smart_repr(__result))`;
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

/** 출력 비교 정규화: 출력값이 동일하면 정답 (공백, 포맷 차이 무시) */
function normalizeOutput(output: string): string {
  return output
    .replace(/'/g, '"')
    .replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/\s*,\s*/g, ",")       // 콤마 주변 공백 제거
    .replace(/\s*:\s*/g, ":")       // 콜론 주변 공백 제거
    .replace(/\[\s+/g, "[")        // 괄호 안쪽 공백 제거
    .replace(/\s+\]/g, "]")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\{\s+/g, "{")
    .replace(/\s+\}/g, "}")
    .replace(/\s+/g, " ")          // 연속 공백 통일
    .trim();
}

/** 단순 코드 실행 (채점 없이 stdout 확인용) */
export async function executeCode(
  code: string
): Promise<{ stdout: string; stderr: string; error: string | null }> {
  // 실행 시에도 헬퍼 코드 포함 (TreeNode 등 사용 가능하도록)
  return runPython(`${PYTHON_HELPERS}\n${code}`, 10000);
}
