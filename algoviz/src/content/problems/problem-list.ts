import type { Problem } from '@/types/problem';

export const problems: Problem[] = [
  // ===== 배열 =====
  {
    id: 'two-sum',
    title: '두 수의 합',
    topicId: 'array',
    difficulty: 1,
    description:
      '정수 배열 nums와 정수 target이 주어집니다.\nnums에서 두 수를 골라 합이 target이 되는 두 인덱스를 출력하세요.\n답은 항상 하나만 존재합니다.',
    constraints: ['2 ≤ len(nums) ≤ 10^4', '-10^9 ≤ nums[i] ≤ 10^9'],
    examples: [
      { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0]+nums[1]=2+7=9' },
      { input: '3\n3 2 4\n6', output: '1 2' },
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: false },
      { input: '2\n3 3\n6', expectedOutput: '0 1', isHidden: true },
      { input: '5\n1 5 3 7 2\n8', expectedOutput: '1 2', isHidden: true },
    ],
    hints: [
      '이중 반복문으로 모든 쌍을 확인하면 O(n²)입니다.',
      '딕셔너리(해시맵)를 사용하면 O(n)으로 풀 수 있습니다.',
    ],
    solution: {
      code: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(seen[complement], i)
        break
    seen[num] = i`,
      explanation:
        '딕셔너리에 이미 본 숫자와 인덱스를 저장하고, 현재 숫자의 보수(target-num)가 딕셔너리에 있으면 답입니다.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    starterCode: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# 여기에 코드를 작성하세요
`,
  },
  {
    id: 'max-subarray',
    title: '최대 부분 배열 합',
    topicId: 'array',
    difficulty: 2,
    description:
      '정수 배열이 주어질 때, 연속된 부분 배열의 합 중 최댓값을 구하세요.',
    constraints: ['1 ≤ len(nums) ≤ 10^5', '-10^4 ≤ nums[i] ≤ 10^4'],
    examples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: '부분 배열 [4,-1,2,1]의 합이 6' },
    ],
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { input: '1\n1', expectedOutput: '1', isHidden: false },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: true },
      { input: '3\n-1 -2 -3', expectedOutput: '-1', isHidden: true },
    ],
    hints: [
      'Kadane 알고리즘을 사용해보세요.',
      '현재까지의 합이 음수면 버리고 새로 시작합니다.',
    ],
    solution: {
      code: `n = int(input())
nums = list(map(int, input().split()))

max_sum = nums[0]
current = nums[0]
for i in range(1, n):
    current = max(nums[i], current + nums[i])
    max_sum = max(max_sum, current)
print(max_sum)`,
      explanation: 'Kadane 알고리즘: 현재 합이 음수면 버리고 현재 원소부터 새로 시작합니다.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    starterCode: `n = int(input())
nums = list(map(int, input().split()))

# 여기에 코드를 작성하세요
`,
  },

  // ===== 스택 =====
  {
    id: 'valid-parentheses',
    title: '괄호 검사',
    topicId: 'stack',
    difficulty: 1,
    description:
      '괄호 문자열이 주어질 때, 올바른 괄호 문자열인지 판단하세요.\n올바르면 YES, 아니면 NO를 출력하세요.\n괄호는 (), [], {} 세 종류입니다.',
    constraints: ['1 ≤ len(s) ≤ 10^4'],
    examples: [
      { input: '()[]{}'  , output: 'YES' },
      { input: '(]', output: 'NO' },
      { input: '{[]}', output: 'YES' },
    ],
    testCases: [
      { input: '()[]{}', expectedOutput: 'YES', isHidden: false },
      { input: '(]', expectedOutput: 'NO', isHidden: false },
      { input: '{[]}', expectedOutput: 'YES', isHidden: false },
      { input: '((()))', expectedOutput: 'YES', isHidden: true },
      { input: '([)]', expectedOutput: 'NO', isHidden: true },
      { input: '', expectedOutput: 'YES', isHidden: true },
    ],
    hints: [
      '여는 괄호는 스택에 push, 닫는 괄호가 나오면 스택 top과 비교합니다.',
      '마지막에 스택이 비어있어야 올바른 괄호입니다.',
    ],
    solution: {
      code: `s = input()
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
for c in s:
    if c in '([{':
        stack.append(c)
    elif c in ')]}':
        if not stack or stack[-1] != pairs[c]:
            print("NO")
            exit()
        stack.pop()
print("YES" if not stack else "NO")`,
      explanation: '스택을 사용하여 여는 괄호를 push, 닫는 괄호가 나오면 짝이 맞는지 확인합니다.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    starterCode: `s = input()

# 여기에 코드를 작성하세요
`,
  },

  // ===== 큐 =====
  {
    id: 'josephus',
    title: '요세푸스 문제',
    topicId: 'queue',
    difficulty: 2,
    description:
      'N명이 원형으로 앉아 있을 때, K번째 사람을 순서대로 제거합니다.\n제거되는 순서를 출력하세요.',
    constraints: ['1 ≤ K ≤ N ≤ 1000'],
    examples: [
      { input: '7 3', output: '3 6 2 7 5 1 4', explanation: '3번째마다 제거: 3,6,2,7,5,1,4 순' },
    ],
    testCases: [
      { input: '7 3', expectedOutput: '3 6 2 7 5 1 4', isHidden: false },
      { input: '5 2', expectedOutput: '2 4 1 5 3', isHidden: false },
      { input: '6 1', expectedOutput: '1 2 3 4 5 6', isHidden: true },
    ],
    hints: [
      'collections.deque를 사용하면 앞에서 빼고 뒤로 넣는 연산이 O(1)입니다.',
      'K-1번 앞에서 빼서 뒤로 넣고, K번째를 제거합니다.',
    ],
    solution: {
      code: `from collections import deque
n, k = map(int, input().split())
q = deque(range(1, n + 1))
result = []
while q:
    for _ in range(k - 1):
        q.append(q.popleft())
    result.append(str(q.popleft()))
print(' '.join(result))`,
      explanation: '큐에서 K-1번 순환시키고 K번째를 제거하는 시뮬레이션입니다.',
      timeComplexity: 'O(NK)',
      spaceComplexity: 'O(N)',
    },
    starterCode: `from collections import deque
n, k = map(int, input().split())

# 여기에 코드를 작성하세요
`,
  },

  // ===== 정렬 =====
  {
    id: 'sort-basic',
    title: '수 정렬하기',
    topicId: 'sorting',
    difficulty: 1,
    description: 'N개의 수가 주어졌을 때, 오름차순으로 정렬하여 출력하세요.',
    constraints: ['1 ≤ N ≤ 1000', '-10^6 ≤ 수 ≤ 10^6'],
    examples: [
      { input: '5\n5 2 3 4 1', output: '1 2 3 4 5' },
    ],
    testCases: [
      { input: '5\n5 2 3 4 1', expectedOutput: '1 2 3 4 5', isHidden: false },
      { input: '3\n3 1 2', expectedOutput: '1 2 3', isHidden: false },
      { input: '1\n42', expectedOutput: '42', isHidden: true },
      { input: '4\n-3 0 5 -1', expectedOutput: '-3 -1 0 5', isHidden: true },
    ],
    hints: [
      'Python의 sorted() 또는 .sort()를 사용해보세요.',
      '직접 구현하고 싶다면 버블정렬부터 시도해보세요.',
    ],
    solution: {
      code: `n = int(input())
nums = list(map(int, input().split()))
nums.sort()
print(' '.join(map(str, nums)))`,
      explanation: 'Python 내장 정렬은 Timsort로 O(n log n) 시간복잡도를 가집니다.',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
    },
    starterCode: `n = int(input())
nums = list(map(int, input().split()))

# 여기에 코드를 작성하세요
`,
  },
  {
    id: 'k-th-number',
    title: 'K번째 수',
    topicId: 'sorting',
    difficulty: 2,
    description:
      '배열을 i번째부터 j번째까지 자른 후 정렬했을 때 k번째 수를 구하세요.\n여러 쿼리가 주어집니다.',
    constraints: ['1 ≤ len(array) ≤ 100', '1 ≤ 쿼리 수 ≤ 50'],
    examples: [
      { input: '6\n1 5 2 6 3 7\n3\n2 5 3\n4 4 1\n1 6 6', output: '5\n6\n7' },
    ],
    testCases: [
      { input: '6\n1 5 2 6 3 7\n3\n2 5 3\n4 4 1\n1 6 6', expectedOutput: '5\n6\n7', isHidden: false },
      { input: '3\n3 1 2\n1\n1 3 2', expectedOutput: '2', isHidden: true },
    ],
    hints: [
      '리스트 슬라이싱 array[i-1:j]를 사용하세요.',
      '슬라이싱 후 정렬하고 k-1번째 인덱스를 가져옵니다.',
    ],
    solution: {
      code: `n = int(input())
arr = list(map(int, input().split()))
q = int(input())
for _ in range(q):
    i, j, k = map(int, input().split())
    sliced = sorted(arr[i-1:j])
    print(sliced[k-1])`,
      explanation: '각 쿼리마다 배열을 슬라이싱하고 정렬하여 k번째 원소를 출력합니다.',
      timeComplexity: 'O(Q * N log N)',
      spaceComplexity: 'O(N)',
    },
    starterCode: `n = int(input())
arr = list(map(int, input().split()))
q = int(input())

# 여기에 코드를 작성하세요
`,
  },

  // ===== 이진 탐색 =====
  {
    id: 'binary-search-basic',
    title: '수 찾기',
    topicId: 'binary-search',
    difficulty: 2,
    description:
      'N개의 정수가 주어졌을 때, 이 안에 X가 존재하는지 판단하세요.\n존재하면 1, 아니면 0을 출력합니다.',
    constraints: ['1 ≤ N ≤ 100,000'],
    examples: [
      { input: '5\n4 1 5 2 3\n5\n1 3 7 9 5', output: '1\n1\n0\n0\n1' },
    ],
    testCases: [
      { input: '5\n4 1 5 2 3\n5\n1 3 7 9 5', expectedOutput: '1\n1\n0\n0\n1', isHidden: false },
      { input: '3\n1 2 3\n3\n1 2 4', expectedOutput: '1\n1\n0', isHidden: true },
    ],
    hints: [
      '정렬 후 이진 탐색을 사용하면 각 쿼리가 O(log N)입니다.',
      'Python의 set을 사용하면 더 간단하지만, 이진 탐색 연습을 위해 직접 구현해보세요.',
    ],
    solution: {
      code: `import bisect

n = int(input())
arr = sorted(list(map(int, input().split())))
m = int(input())
queries = list(map(int, input().split()))

for x in queries:
    idx = bisect.bisect_left(arr, x)
    if idx < n and arr[idx] == x:
        print(1)
    else:
        print(0)`,
      explanation: 'bisect_left로 삽입 위치를 찾고, 해당 위치의 값이 x와 같으면 존재합니다.',
      timeComplexity: 'O((N+M) log N)',
      spaceComplexity: 'O(N)',
    },
    starterCode: `n = int(input())
arr = list(map(int, input().split()))
m = int(input())
queries = list(map(int, input().split()))

# 여기에 코드를 작성하세요
`,
  },
  {
    id: 'lower-bound',
    title: '랜선 자르기',
    topicId: 'binary-search',
    difficulty: 3,
    description:
      'K개의 랜선을 가지고 있을 때, N개 이상의 같은 길이의 랜선을 만들 수 있는 최대 길이를 구하세요.',
    constraints: ['1 ≤ K ≤ 10,000', '1 ≤ N ≤ 1,000,000', '랜선 길이 ≤ 2^31 - 1'],
    examples: [
      { input: '4 11\n802 743 457 539', output: '200', explanation: '200cm로 자르면 4+3+2+2=11개' },
    ],
    testCases: [
      { input: '4 11\n802 743 457 539', expectedOutput: '200', isHidden: false },
      { input: '1 1\n5', expectedOutput: '5', isHidden: true },
      { input: '2 4\n10 10', expectedOutput: '5', isHidden: true },
    ],
    hints: [
      '답을 이진 탐색합니다. 길이 mid로 잘랐을 때 N개 이상 만들 수 있는지 확인하세요.',
      'lo=1, hi=max(랜선길이)로 시작합니다.',
    ],
    solution: {
      code: `k, n = map(int, input().split())
cables = list(map(int, input().split()))

lo, hi = 1, max(cables)
while lo <= hi:
    mid = (lo + hi) // 2
    count = sum(c // mid for c in cables)
    if count >= n:
        lo = mid + 1
    else:
        hi = mid - 1
print(hi)`,
      explanation: '이진 탐색으로 최대 길이를 찾습니다. mid로 잘랐을 때 총 개수가 N 이상이면 더 긴 것을 시도합니다.',
      timeComplexity: 'O(K log max_len)',
      spaceComplexity: 'O(K)',
    },
    starterCode: `k, n = map(int, input().split())
cables = list(map(int, input().split()))

# 여기에 코드를 작성하세요
`,
  },

  // ===== 해시 =====
  {
    id: 'phone-book',
    title: '전화번호 목록',
    topicId: 'hash-table',
    difficulty: 2,
    description:
      '전화번호 목록이 주어졌을 때, 어떤 번호가 다른 번호의 접두어인 경우가 있으면 NO, 없으면 YES를 출력하세요.',
    constraints: ['1 ≤ N ≤ 1,000,000'],
    examples: [
      { input: '3\n119\n97674223\n1195524421', output: 'NO', explanation: '119는 1195524421의 접두어' },
      { input: '3\n123\n456\n789', output: 'YES' },
    ],
    testCases: [
      { input: '3\n119\n97674223\n1195524421', expectedOutput: 'NO', isHidden: false },
      { input: '3\n123\n456\n789', expectedOutput: 'YES', isHidden: false },
      { input: '2\n12\n123', expectedOutput: 'NO', isHidden: true },
      { input: '2\n123\n456', expectedOutput: 'YES', isHidden: true },
    ],
    hints: [
      '정렬 후 인접한 번호만 비교하면 됩니다.',
      '또는 각 번호의 모든 접두어를 set에 넣고 확인할 수 있습니다.',
    ],
    solution: {
      code: `n = int(input())
phones = [input() for _ in range(n)]
phones.sort()
for i in range(n - 1):
    if phones[i+1].startswith(phones[i]):
        print("NO")
        exit()
print("YES")`,
      explanation: '사전순 정렬하면 접두어 관계인 번호는 반드시 인접합니다.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
    starterCode: `n = int(input())
phones = [input() for _ in range(n)]

# 여기에 코드를 작성하세요
`,
  },

  // ===== BFS/DFS =====
  {
    id: 'connected-components',
    title: '연결 요소의 수',
    topicId: 'bfs-dfs',
    difficulty: 2,
    description:
      '무방향 그래프가 주어졌을 때, 연결 요소(Connected Component)의 수를 구하세요.',
    constraints: ['1 ≤ N ≤ 1000', '0 ≤ M ≤ N*(N-1)/2'],
    examples: [
      { input: '6 5\n1 2\n2 5\n5 1\n3 4\n4 6', output: '2' },
    ],
    testCases: [
      { input: '6 5\n1 2\n2 5\n5 1\n3 4\n4 6', expectedOutput: '2', isHidden: false },
      { input: '6 8\n1 2\n2 5\n5 1\n3 4\n4 6\n5 4\n2 4\n2 3', expectedOutput: '1', isHidden: true },
      { input: '3 0', expectedOutput: '3', isHidden: true },
    ],
    hints: [
      '방문하지 않은 노드에서 BFS/DFS를 시작할 때마다 카운트를 1 증가시킵니다.',
    ],
    solution: {
      code: `import sys
from collections import deque
input = sys.stdin.readline

n, m = map(int, input().split())
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

visited = [False] * (n + 1)
count = 0
for i in range(1, n + 1):
    if not visited[i]:
        count += 1
        queue = deque([i])
        visited[i] = True
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)
print(count)`,
      explanation: 'BFS로 각 연결 요소를 탐색하며, 새로운 미방문 노드를 만날 때마다 카운트를 증가시킵니다.',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N + M)',
    },
    starterCode: `from collections import deque

n, m = map(int, input().split())

# 여기에 코드를 작성하세요
`,
  },
  {
    id: 'maze-bfs',
    title: '미로 탈출',
    topicId: 'bfs-dfs',
    difficulty: 3,
    description:
      'N×M 미로에서 (1,1)부터 (N,M)까지 최소 이동 횟수를 구하세요.\n1은 이동 가능, 0은 벽입니다. 시작과 도착 칸도 횟수에 포함합니다.',
    constraints: ['2 ≤ N, M ≤ 100'],
    examples: [
      { input: '4 6\n101111\n101010\n101011\n111011', output: '15' },
    ],
    testCases: [
      { input: '4 6\n101111\n101010\n101011\n111011', expectedOutput: '15', isHidden: false },
      { input: '2 2\n11\n11', expectedOutput: '3', isHidden: true },
      { input: '3 3\n110\n010\n011', expectedOutput: '5', isHidden: true },
    ],
    hints: [
      'BFS는 최단 거리를 보장합니다.',
      '상하좌우 4방향으로 이동하세요.',
    ],
    solution: {
      code: `from collections import deque

n, m = map(int, input().split())
maze = [input() for _ in range(n)]
dist = [[0]*m for _ in range(n)]
dist[0][0] = 1
queue = deque([(0, 0)])
dx = [-1, 1, 0, 0]
dy = [0, 0, -1, 1]
while queue:
    x, y = queue.popleft()
    for i in range(4):
        nx, ny = x+dx[i], y+dy[i]
        if 0 <= nx < n and 0 <= ny < m and maze[nx][ny] == '1' and dist[nx][ny] == 0:
            dist[nx][ny] = dist[x][y] + 1
            queue.append((nx, ny))
print(dist[n-1][m-1])`,
      explanation: 'BFS로 (0,0)부터 탐색하며 각 칸까지의 최단 거리를 기록합니다.',
      timeComplexity: 'O(N × M)',
      spaceComplexity: 'O(N × M)',
    },
    starterCode: `from collections import deque

n, m = map(int, input().split())

# 여기에 코드를 작성하세요
`,
  },

  // ===== 재귀 =====
  {
    id: 'fibonacci',
    title: '피보나치 수',
    topicId: 'recursion',
    difficulty: 1,
    description: 'N번째 피보나치 수를 구하세요.\nF(0)=0, F(1)=1, F(N)=F(N-1)+F(N-2)',
    constraints: ['0 ≤ N ≤ 45'],
    examples: [
      { input: '10', output: '55' },
      { input: '0', output: '0' },
    ],
    testCases: [
      { input: '10', expectedOutput: '55', isHidden: false },
      { input: '0', expectedOutput: '0', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: true },
      { input: '20', expectedOutput: '6765', isHidden: true },
    ],
    hints: [
      '단순 재귀는 O(2^n)으로 느립니다.',
      '메모이제이션이나 반복문을 사용하세요.',
    ],
    solution: {
      code: `n = int(input())
if n <= 1:
    print(n)
else:
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    print(b)`,
      explanation: '반복문으로 앞의 두 값을 누적하며 O(n)에 계산합니다.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    starterCode: `n = int(input())

# 여기에 코드를 작성하세요
`,
  },

  // ===== DP =====
  {
    id: 'staircase',
    title: '계단 오르기',
    topicId: 'dynamic-programming',
    difficulty: 2,
    description:
      '한 번에 1칸 또는 2칸 오를 수 있을 때, N번째 계단에 도달하는 방법의 수를 구하세요.',
    constraints: ['1 ≤ N ≤ 45'],
    examples: [
      { input: '4', output: '5', explanation: '1111, 112, 121, 211, 22 → 5가지' },
    ],
    testCases: [
      { input: '4', expectedOutput: '5', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: false },
      { input: '2', expectedOutput: '2', isHidden: true },
      { input: '10', expectedOutput: '89', isHidden: true },
    ],
    hints: [
      'dp[i] = dp[i-1] + dp[i-2] — 피보나치와 같은 구조입니다.',
    ],
    solution: {
      code: `n = int(input())
if n <= 2:
    print(n)
else:
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)`,
      explanation: 'N번째 계단 = (N-1번째에서 1칸) + (N-2번째에서 2칸). 피보나치와 동일한 점화식입니다.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    starterCode: `n = int(input())

# 여기에 코드를 작성하세요
`,
  },
  {
    id: 'knapsack',
    title: '배낭 문제',
    topicId: 'dynamic-programming',
    difficulty: 3,
    description:
      'N개의 물건(무게 w, 가치 v)이 있을 때, 최대 무게 W인 배낭에 넣을 수 있는 최대 가치를 구하세요.',
    constraints: ['1 ≤ N ≤ 100', '1 ≤ W ≤ 100,000'],
    examples: [
      { input: '4 7\n6 13\n4 8\n3 6\n5 12', output: '14' },
    ],
    testCases: [
      { input: '4 7\n6 13\n4 8\n3 6\n5 12', expectedOutput: '14', isHidden: false },
      { input: '3 10\n5 10\n4 40\n6 30', expectedOutput: '70', isHidden: true },
    ],
    hints: [
      '0-1 배낭 문제는 DP로 풉니다.',
      'dp[j] = 무게 j일 때의 최대 가치, 역순으로 갱신하세요.',
    ],
    solution: {
      code: `n, w = map(int, input().split())
dp = [0] * (w + 1)
for _ in range(n):
    wi, vi = map(int, input().split())
    for j in range(w, wi - 1, -1):
        dp[j] = max(dp[j], dp[j - wi] + vi)
print(dp[w])`,
      explanation: '1차원 DP로 역순 갱신하면 각 물건을 한 번만 사용하는 0-1 배낭이 됩니다.',
      timeComplexity: 'O(NW)',
      spaceComplexity: 'O(W)',
    },
    starterCode: `n, w = map(int, input().split())

# 여기에 코드를 작성하세요
`,
  },

  // ===== 그리디 =====
  {
    id: 'coin-change-greedy',
    title: '거스름돈',
    topicId: 'greedy',
    difficulty: 1,
    description:
      '500원, 100원, 50원, 10원짜리 동전이 무한히 있을 때, 거스름돈 N원을 주기 위한 최소 동전 수를 구하세요.',
    constraints: ['N은 10의 배수, 10 ≤ N ≤ 100,000'],
    examples: [
      { input: '1260', output: '6', explanation: '500×2 + 100×2 + 50×1 + 10×1 = 6개' },
    ],
    testCases: [
      { input: '1260', expectedOutput: '6', isHidden: false },
      { input: '500', expectedOutput: '1', isHidden: true },
      { input: '30', expectedOutput: '3', isHidden: true },
    ],
    hints: ['큰 동전부터 최대한 많이 사용하면 최소 개수가 됩니다.'],
    solution: {
      code: `n = int(input())
count = 0
for coin in [500, 100, 50, 10]:
    count += n // coin
    n %= coin
print(count)`,
      explanation: '큰 동전부터 사용하는 그리디가 최적입니다 (동전 단위가 배수 관계이므로).',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
    },
    starterCode: `n = int(input())

# 여기에 코드를 작성하세요
`,
  },
  {
    id: 'meeting-room',
    title: '회의실 배정',
    topicId: 'greedy',
    difficulty: 2,
    description:
      'N개의 회의 시작/끝 시간이 주어질 때, 겹치지 않게 최대 몇 개의 회의를 할 수 있는지 구하세요.',
    constraints: ['1 ≤ N ≤ 100,000'],
    examples: [
      { input: '5\n1 4\n2 3\n3 5\n0 6\n5 7', output: '3', explanation: '(2,3),(3,5),(5,7) 선택' },
    ],
    testCases: [
      { input: '5\n1 4\n2 3\n3 5\n0 6\n5 7', expectedOutput: '3', isHidden: false },
      { input: '3\n1 2\n2 3\n3 4', expectedOutput: '3', isHidden: true },
      { input: '1\n0 1', expectedOutput: '1', isHidden: true },
    ],
    hints: [
      '끝나는 시간이 빠른 회의부터 선택하면 최적입니다.',
      '끝나는 시간이 같으면 시작 시간이 빠른 것을 먼저.',
    ],
    solution: {
      code: `n = int(input())
meetings = []
for _ in range(n):
    s, e = map(int, input().split())
    meetings.append((e, s))
meetings.sort()
count = 0
last_end = 0
for end, start in meetings:
    if start >= last_end:
        count += 1
        last_end = end
print(count)`,
      explanation: '끝나는 시간 기준 정렬 후, 현재 회의가 이전 회의 이후에 시작하면 선택합니다.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
    starterCode: `n = int(input())

# 여기에 코드를 작성하세요
`,
  },

  // ===== 연결 리스트 =====
  {
    id: 'reverse-list',
    title: '리스트 뒤집기',
    topicId: 'linked-list',
    difficulty: 1,
    description: 'N개의 수가 주어졌을 때, 순서를 뒤집어 출력하세요.',
    constraints: ['1 ≤ N ≤ 100,000'],
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1' },
    ],
    testCases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { input: '1\n42', expectedOutput: '42', isHidden: true },
      { input: '3\n-1 0 1', expectedOutput: '1 0 -1', isHidden: true },
    ],
    hints: ['Python의 슬라이싱 [::-1]이나 reversed()를 사용해보세요.'],
    solution: {
      code: `n = int(input())
nums = list(map(int, input().split()))
print(' '.join(map(str, nums[::-1])))`,
      explanation: '슬라이싱 [::-1]로 리스트를 뒤집습니다.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    starterCode: `n = int(input())
nums = list(map(int, input().split()))

# 여기에 코드를 작성하세요
`,
  },
];
