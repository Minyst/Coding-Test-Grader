# AlgoViz Design Document

> **Summary**: 비전공생을 위한 자료구조/알고리즘 올인원 학습 웹앱 기술 설계
>
> **Project**: AlgoViz (알고비즈)
> **Version**: 0.1.0
> **Author**: USER
> **Date**: 2026-03-14
> **Status**: Draft
> **Planning Doc**: [algoviz.plan.md](../../01-plan/features/algoviz.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A (Design 문서에 포함) |
| Phase 2 | Coding Conventions | N/A (CLAUDE.md에 정의) |
| Phase 3 | Mockup | ❌ (추후 작성) |
| Phase 4 | API Spec | N/A (Supabase 자동 생성) |

---

## 1. Overview

### 1.1 Design Goals

- 시각화 엔진의 재사용성: 모든 자료구조/알고리즘 시각화가 공통 인터페이스를 공유
- 콘텐츠 확장 용이성: 새로운 토픽/문제 추가 시 코드 변경 최소화 (데이터 기반)
- 성능 최적화: 시각화 60fps, Pyodide lazy loading, SSG 활용
- 비전공자 UX: 직관적 UI, 단계적 정보 노출, 한국어 중심

### 1.2 Design Principles

- **컴포넌트 단일 책임**: 시각화 로직(lib) ↔ 렌더링(components) ↔ 상태(store) 분리
- **데이터 기반 콘텐츠**: 학습 콘텐츠/문제를 JSON/MDX로 관리하여 코드 변경 없이 확장
- **점진적 복잡도**: 사용자에게 한 번에 하나의 개념만 노출
- **오프라인 우선 실행**: Python 코드 실행은 서버 의존 없이 브라우저 내 처리

---

## 2. Architecture

### 2.1 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Client (Browser)                       │
│                                                               │
│  ┌─────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Next.js │  │ Monaco Editor│  │   Pyodide    │            │
│  │App Router│  │  (Code IDE)  │  │(Python WASM) │            │
│  └────┬────┘  └──────┬───────┘  └──────┬───────┘            │
│       │              │                  │                     │
│  ┌────▼──────────────▼──────────────────▼────┐               │
│  │              Zustand Store                 │               │
│  │  (visualizer state, user state, editor)    │               │
│  └────────────────────┬──────────────────────┘               │
│                       │                                       │
│  ┌────────────────────▼──────────────────────┐               │
│  │           Framer Motion + SVG              │               │
│  │        (Visualization Renderer)            │               │
│  └────────────────────────────────────────────┘               │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼──────────────────────────────────────┐
│                     Supabase                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   Auth   │  │PostgreSQL│  │ Storage  │  │  Realtime    │ │
│  │(Google,  │  │  (RLS)   │  │ (avatars)│  │ (rankings)  │ │
│  │ Email)   │  │          │  │          │  │             │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
└──────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                     Vercel                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  SSG Pages   │  │  Edge Func   │  │  CDN (static)     │  │
│  │ (learn/*)    │  │ (API routes) │  │ (images, wasm)    │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
[학습 플로우]
콘텐츠 JSON/MDX → SSG 빌드 → 정적 페이지 서빙 → 클라이언트 렌더링

[시각화 플로우]
사용자 입력 → AlgorithmEngine.generateSteps() → AnimationStep[]
→ Zustand Store → Framer Motion 렌더링 → SVG 애니메이션

[코드 실행 플로우]
Monaco Editor → Python 코드 → Web Worker (Pyodide)
→ 실행 결과 → 채점 로직 비교 → 결과 표시 + Supabase 저장

[인증/데이터 플로우]
Supabase Auth → JWT → RLS 보호된 DB 쿼리 → 클라이언트 응답
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| VisualizerRenderer | Zustand Store, Framer Motion | 시각화 스텝 기반 애니메이션 렌더링 |
| CodeEditor | Monaco Editor, Pyodide Worker | Python 코드 편집 + 실행 |
| LearnPage | Content JSON/MDX | 학습 콘텐츠 렌더링 |
| AuthProvider | Supabase Auth | 사용자 인증 상태 관리 |
| Dashboard | Supabase DB | 진행률/통계 데이터 조회 |
| ProblemJudge | Pyodide Worker | 테스트케이스 실행 및 비교 |

---

## 3. Data Model

### 3.1 Core Types

```typescript
// ── 학습 콘텐츠 타입 ──

interface Topic {
  id: string;                    // 'array', 'stack', 'bfs' 등
  title: string;                 // '배열 (Array)'
  category: 'data-structure' | 'algorithm';
  phase: 1 | 2 | 3 | 4;        // 학습 단계
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;           // 한줄 설명
  realLifeAnalogy: string;       // 실생활 비유
  prerequisites: string[];       // 선수 토픽 ID 목록
  icon: string;                  // 아이콘 이름
}

interface TopicContent {
  topicId: string;
  sections: ContentSection[];
  keyPoints: string[];           // 핵심 포인트 3~5개
  complexityTable: ComplexityInfo;
  relatedProblems: string[];     // 관련 문제 ID 목록
}

interface ContentSection {
  title: string;
  type: 'text' | 'diagram' | 'code' | 'analogy' | 'quiz';
  content: string;               // MDX 또는 plain text
}

interface ComplexityInfo {
  access?: string;    // O(1), O(n) 등
  search?: string;
  insert?: string;
  delete?: string;
  space?: string;
  best?: string;      // 알고리즘용
  average?: string;
  worst?: string;
}

// ── 시각화 타입 ──

interface VisualizerState {
  steps: AnimationStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;                 // 0.5x ~ 4x
  userInput: unknown;            // 자료구조별 입력 타입
}

interface AnimationStep {
  id: number;
  description: string;           // "인덱스 3에 값 42를 삽입합니다"
  elements: VisualElement[];
  highlights: number[];          // 강조할 요소 인덱스
  codeLineHighlight?: number;    // 해당 코드 라인 번호
  variables?: Record<string, unknown>; // 변수 상태 스냅샷
}

interface VisualElement {
  id: string;
  type: 'node' | 'edge' | 'bar' | 'cell' | 'pointer';
  value: string | number;
  x: number;
  y: number;
  status: 'default' | 'active' | 'comparing' | 'sorted' | 'found' | 'visited';
  connections?: string[];        // 연결된 요소 ID (그래프/트리)
}

// ── 문제 풀이 타입 ──

interface Problem {
  id: string;
  title: string;
  topicId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;           // 문제 설명 (MDX)
  constraints: string[];
  examples: ProblemExample[];
  testCases: TestCase[];
  hints: string[];               // 3단계 힌트
  solution: ProblemSolution;
  starterCode: string;           // 초기 코드 템플릿
}

interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;             // 숨겨진 테스트케이스
}

interface ProblemSolution {
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

interface SubmissionResult {
  problemId: string;
  isCorrect: boolean;
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  output: string;
  error?: string;
}

// ── 사용자 타입 ──

interface UserProfile {
  id: string;                    // Supabase auth.users.id
  username: string;
  avatarUrl?: string;
  streakDays: number;
  lastActiveDate: string;
  createdAt: string;
}

interface LearningProgress {
  userId: string;
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
}

interface UserStats {
  totalSolved: number;
  solvedByDifficulty: Record<number, number>;
  streakDays: number;
  totalTopicsCompleted: number;
}
```

### 3.2 Entity Relationships

```
[User (auth.users)] 1 ──── 1 [Profile]
        │
        ├── 1 ──── N [LearningProgress]
        │                    │
        │              N ──── 1 [Topic]
        │
        ├── 1 ──── N [Submission]
        │                    │
        │              N ──── 1 [Problem]
        │                          │
        │                    N ──── 1 [Topic]
        │
        └── 1 ──── N [Bookmark]
                         │
                   target ──── [Topic] or [Problem]
```

### 3.3 Supabase Database Schema

```sql
-- 1. 사용자 프로필
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  streak_days INT DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. 학습 진행률
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 3. 문제 풀이 기록
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  code TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  passed_tests INT DEFAULT 0,
  total_tests INT DEFAULT 0,
  execution_time_ms INT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_correct ON submissions(user_id, is_correct);

-- 4. 북마크
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('topic', 'problem')),
  target_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 5. RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- profiles: 누구나 읽기, 본인만 수정
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- learning_progress: 본인만 CRUD
CREATE POLICY "Users can manage own progress"
  ON learning_progress FOR ALL USING (auth.uid() = user_id);

-- submissions: 본인만 CRUD
CREATE POLICY "Users can manage own submissions"
  ON submissions FOR ALL USING (auth.uid() = user_id);

-- bookmarks: 본인만 CRUD
CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- 6. 랭킹 뷰 (실시간 집계)
CREATE OR REPLACE VIEW ranking_view AS
SELECT
  p.id,
  p.username,
  p.avatar_url,
  p.streak_days,
  COUNT(DISTINCT s.problem_id) FILTER (WHERE s.is_correct) AS solved_count,
  RANK() OVER (
    ORDER BY COUNT(DISTINCT s.problem_id) FILTER (WHERE s.is_correct) DESC
  ) AS rank
FROM profiles p
LEFT JOIN submissions s ON p.id = s.user_id
GROUP BY p.id, p.username, p.avatar_url, p.streak_days;
```

---

## 4. API Specification

Supabase 자동 생성 REST API + 클라이언트 라이브러리 사용. 별도 API 서버 불필요.

### 4.1 Supabase Client API

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 4.2 주요 데이터 접근 패턴

| Action | Method | Table | 비고 |
|--------|--------|-------|------|
| 회원가입 | `supabase.auth.signUp()` | auth.users | 프로필 자동 생성 (트리거) |
| 로그인 (이메일) | `supabase.auth.signInWithPassword()` | auth.users | |
| 로그인 (Google) | `supabase.auth.signInWithOAuth()` | auth.users | provider: 'google' |
| 진행률 조회 | `supabase.from('learning_progress').select()` | learning_progress | user_id 필터 (RLS) |
| 진행률 업데이트 | `supabase.from('learning_progress').upsert()` | learning_progress | ON CONFLICT 처리 |
| 문제 제출 | `supabase.from('submissions').insert()` | submissions | |
| 랭킹 조회 | `supabase.from('ranking_view').select()` | ranking_view | limit + order |
| 북마크 토글 | `supabase.from('bookmarks').upsert/delete()` | bookmarks | |

### 4.3 Next.js API Routes (서버사이드)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/callback` | GET | OAuth 콜백 처리 |
| `/api/streak` | POST | 연속 학습일 업데이트 (Cron or 로그인 시) |

---

## 5. UI/UX Design

### 5.1 Page Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: 로고 | 학습 | 시각화 | 문제풀이 | [로그인/프로필] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  / (Home)          → 소개 + CTA + 학습 로드맵 미리보기    │
│  /learn            → 토픽 목록 (카드 그리드)              │
│  /learn/[topic]    → 개념 설명 + 시각화 링크 + 문제 링크  │
│  /visualize        → 시각화 도구 목록                    │
│  /visualize/[id]   → 시각화 인터랙션 페이지              │
│  /practice         → 문제 목록 (필터: 토픽, 난이도)       │
│  /practice/[id]    → 문제 풀이 (에디터 + 채점)           │
│  /dashboard        → 진행률 + 통계 + 북마크              │
│  /ranking          → 랭킹 리스트                         │
│  /auth/login       → 로그인                              │
│  /auth/signup      → 회원가입                            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Footer: 소개 | GitHub | 문의                             │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Key Page Layouts

#### 시각화 페이지 (`/visualize/[id]`)
```
┌─────────────────────────────────────────────────────────┐
│  Header                                                  │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│  사이드패널           │     시각화 캔버스 (SVG)           │
│  ┌────────────────┐  │     ┌────────────────────────┐   │
│  │ 입력값 설정     │  │     │                        │   │
│  │ [1,5,3,8,2]   │  │     │   ● → ● → ● → ●       │   │
│  │ [실행] [리셋]  │  │     │                        │   │
│  ├────────────────┤  │     └────────────────────────┘   │
│  │ 현재 스텝 설명  │  │                                   │
│  │ "인덱스 2와    │  │     ┌────────────────────────┐   │
│  │  3을 비교"     │  │     │ ▶ ⏸ ⏭ 🔄  속도: 1x    │   │
│  ├────────────────┤  │     │ ━━━━━●━━━━━━━━ 3/10   │   │
│  │ 의사코드       │  │     └────────────────────────┘   │
│  │ (현재 라인     │  │                                   │
│  │  하이라이트)   │  │                                   │
│  ├────────────────┤  │                                   │
│  │ 변수 상태      │  │                                   │
│  │ i=2, j=3      │  │                                   │
│  │ temp=5        │  │                                   │
│  └────────────────┘  │                                   │
├──────────────────────┴──────────────────────────────────┤
│  관련: [📖 개념 학습] [✏️ 문제 풀기]                      │
└─────────────────────────────────────────────────────────┘
```

#### 문제 풀이 페이지 (`/practice/[id]`)
```
┌─────────────────────────────────────────────────────────┐
│  Header                                                  │
├────────────────────────┬────────────────────────────────┤
│                        │                                 │
│  문제 설명              │     코드 에디터 (Monaco)        │
│  ┌──────────────────┐  │     ┌────────────────────────┐ │
│  │ Lv.2 두 수의 합  │  │     │ def solution(nums):    │ │
│  │                  │  │     │     # 코드를 작성하세요   │ │
│  │ 정수 배열 nums와 │  │     │     pass               │ │
│  │ 정수 target이    │  │     │                        │ │
│  │ 주어졌을 때...   │  │     │                        │ │
│  ├──────────────────┤  │     ├────────────────────────┤ │
│  │ 예시 1:          │  │     │ 실행 결과               │ │
│  │ Input: [2,7,11]  │  │     │ ✅ 테스트 1 통과        │ │
│  │ Output: [0,1]    │  │     │ ❌ 테스트 2 실패        │ │
│  ├──────────────────┤  │     │ Expected: [1,2]        │ │
│  │ 💡 힌트 (3단계)  │  │     │ Got: [0,1]             │ │
│  │ [힌트 1 보기]    │  │     ├────────────────────────┤ │
│  │                  │  │     │ [▶ 실행] [📤 제출]      │ │
│  └──────────────────┘  │     └────────────────────────┘ │
├────────────────────────┴────────────────────────────────┤
│  관련: [📖 해시 테이블 개념] [🔍 시각화로 보기]            │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `Header` | `components/layout/header.tsx` | 글로벌 내비게이션, 테마 토글, 인증 상태 |
| `Sidebar` | `components/layout/sidebar.tsx` | 학습 로드맵 내비게이션 (learn 페이지) |
| `TopicCard` | `components/learn/topic-card.tsx` | 토픽 목록 카드 (아이콘, 제목, 진행률) |
| `TopicContent` | `components/learn/topic-content.tsx` | 개념 설명 렌더링 (MDX/JSON 기반) |
| `VisualizerCanvas` | `components/visualizer/visualizer-canvas.tsx` | SVG 기반 시각화 렌더링 영역 |
| `VisualizerControls` | `components/visualizer/visualizer-controls.tsx` | 재생/정지/스텝/속도 컨트롤 바 |
| `VisualizerInput` | `components/visualizer/visualizer-input.tsx` | 사용자 입력 패널 |
| `StepDescription` | `components/visualizer/step-description.tsx` | 현재 스텝 설명 + 변수 상태 |
| `PseudoCode` | `components/visualizer/pseudo-code.tsx` | 의사코드 표시 (라인 하이라이트) |
| `ArrayVisualizer` | `components/visualizer/array-visualizer.tsx` | 배열 시각화 |
| `LinkedListVisualizer` | `components/visualizer/linked-list-visualizer.tsx` | 연결리스트 시각화 |
| `StackQueueVisualizer` | `components/visualizer/stack-queue-visualizer.tsx` | 스택/큐 시각화 |
| `TreeVisualizer` | `components/visualizer/tree-visualizer.tsx` | 트리 시각화 (D3 활용) |
| `GraphVisualizer` | `components/visualizer/graph-visualizer.tsx` | 그래프 시각화 (D3 활용) |
| `SortingVisualizer` | `components/visualizer/sorting-visualizer.tsx` | 정렬 바 차트 시각화 |
| `CodeEditor` | `components/editor/code-editor.tsx` | Monaco Editor 래퍼 |
| `ExecutionResult` | `components/editor/execution-result.tsx` | 코드 실행 결과 표시 |
| `ProblemDescription` | `components/problem/problem-description.tsx` | 문제 설명 + 예시 + 힌트 |
| `ProblemList` | `components/problem/problem-list.tsx` | 문제 목록 (필터, 정렬) |
| `HintAccordion` | `components/problem/hint-accordion.tsx` | 단계별 힌트 아코디언 |
| `Dashboard` | `components/dashboard/dashboard.tsx` | 학습 진행률 대시보드 |
| `ProgressChart` | `components/dashboard/progress-chart.tsx` | 진행률 차트/그래프 |
| `RankingTable` | `components/ranking/ranking-table.tsx` | 랭킹 테이블 |
| `AuthForm` | `components/auth/auth-form.tsx` | 로그인/회원가입 폼 |
| `ThemeToggle` | `components/ui/theme-toggle.tsx` | 다크/라이트 모드 토글 |

---

## 6. Core Engine Design

### 6.1 Visualization Engine Architecture

```typescript
// lib/algorithms/types.ts — 공통 인터페이스

interface AlgorithmEngine<TInput, TState> {
  name: string;
  generateSteps(input: TInput): AnimationStep[];
  getInitialState(input: TInput): TState;
  getPseudoCode(): string[];
}

// 사용 예: 버블 정렬 엔진
class BubbleSortEngine implements AlgorithmEngine<number[], number[]> {
  name = 'Bubble Sort';

  generateSteps(input: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const arr = [...input];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // 비교 스텝
        steps.push({
          id: steps.length,
          description: `${arr[j]}와 ${arr[j + 1]}을 비교합니다`,
          elements: this.createElements(arr, [j, j + 1], 'comparing'),
          highlights: [j, j + 1],
          codeLineHighlight: 3,
          variables: { i, j, comparing: `${arr[j]} vs ${arr[j+1]}` }
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          // 교환 스텝
          steps.push({
            id: steps.length,
            description: `${arr[j+1]} > ${arr[j]}이므로 교환합니다`,
            elements: this.createElements(arr, [j, j + 1], 'active'),
            highlights: [j, j + 1],
            codeLineHighlight: 4,
            variables: { i, j, swapped: true }
          });
        }
      }
    }
    return steps;
  }
  // ...
}
```

### 6.2 Visualizer Store (Zustand)

```typescript
// store/visualizer-store.ts

interface VisualizerStore {
  // State
  steps: AnimationStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;          // 배수: 0.5, 1, 1.5, 2, 4

  // Actions
  setSteps: (steps: AnimationStep[]) => void;
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}
```

### 6.3 Pyodide Worker Architecture

```
┌─────────────────┐          ┌──────────────────────┐
│   Main Thread   │          │     Web Worker        │
│                 │ postMsg  │                       │
│  CodeEditor ────┼─────────▶│  Pyodide Runtime      │
│                 │          │  ┌──────────────────┐ │
│                 │          │  │ exec(userCode)   │ │
│                 │          │  │ + testCases      │ │
│                 │ onMsg    │  │ → stdout capture │ │
│  ResultPanel ◀──┼──────────│  │ → time measure   │ │
│                 │          │  └──────────────────┘ │
└─────────────────┘          └──────────────────────┘

보안 제한:
- import os, sys, subprocess 차단
- 실행 시간 제한: 10초
- 메모리 제한: 128MB
- 네트워크 접근 차단 (Worker 내 fetch 불가)
```

```typescript
// lib/pyodide/worker.ts

interface WorkerMessage {
  type: 'execute' | 'judge';
  code: string;
  testCases?: TestCase[];
  timeLimit?: number;     // ms, default 10000
}

interface WorkerResult {
  type: 'result' | 'error' | 'judge-result';
  output?: string;
  error?: string;
  results?: {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    executionTimeMs: number;
  }[];
}
```

---

## 7. Security Considerations

- [x] Supabase RLS: 모든 테이블에 행 수준 보안 적용 (본인 데이터만 접근)
- [x] Auth: Supabase Auth + JWT (서버사이드 검증)
- [x] Python 실행 샌드박스: Web Worker 격리, import 제한, 시간/메모리 제한
- [x] XSS 방지: React 기본 이스케이핑 + DOMPurify (사용자 입력 렌더링 시)
- [x] HTTPS: Vercel 자동 SSL
- [ ] Rate Limiting: Supabase Edge Functions 또는 Vercel middleware (향후)
- [x] Environment Variables: 서버 키는 NEXT_PUBLIC_ 접두사 없이 서버에서만 사용

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Unit Test | 알고리즘 엔진 (스텝 생성 로직) | Vitest |
| Unit Test | 채점 로직 (테스트케이스 비교) | Vitest |
| Unit Test | Zustand Store 액션 | Vitest |
| Component Test | 시각화 컴포넌트 렌더링 | Vitest + Testing Library |
| E2E Test | 학습 → 시각화 → 문제풀이 플로우 | Playwright |
| E2E Test | 회원가입 → 로그인 → 진행률 저장 | Playwright |

### 8.2 Test Cases (Key)

- [ ] 버블 정렬 엔진이 올바른 스텝 수를 생성하는가
- [ ] 시각화 Play/Pause/Step이 정상 동작하는가
- [ ] Pyodide에서 Python 코드 실행 후 올바른 결과 반환
- [ ] 채점 시스템이 정답/오답을 정확히 구분하는가
- [ ] 비로그인 사용자도 학습/시각화를 이용할 수 있는가
- [ ] 로그인 사용자의 진행률이 정상 저장/복원되는가
- [ ] RLS가 타인의 데이터 접근을 차단하는가

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | 페이지, UI 컴포넌트, 사용자 인터랙션 | `src/app/`, `src/components/` |
| **Application** | 시각화 엔진 오케스트레이션, 채점 로직 | `src/hooks/`, `src/store/` |
| **Domain** | 타입 정의, 핵심 비즈니스 규칙 | `src/types/`, `src/lib/algorithms/`, `src/lib/data-structures/` |
| **Infrastructure** | Supabase 클라이언트, Pyodide Worker, 외부 서비스 | `src/lib/supabase/`, `src/lib/pyodide/` |

### 9.2 Dependency Rules

```
Presentation (app/, components/)
    │
    ▼
Application (hooks/, store/)
    │
    ▼
Domain (types/, lib/algorithms/, lib/data-structures/)
    ▲
    │
Infrastructure (lib/supabase/, lib/pyodide/)
```

### 9.3 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| VisualizerCanvas, TopicContent | Presentation | `src/components/visualizer/`, `src/components/learn/` |
| useVisualizer, useCodeRunner | Application | `src/hooks/` |
| visualizerStore, authStore | Application | `src/store/` |
| AlgorithmEngine, AnimationStep | Domain | `src/lib/algorithms/`, `src/types/` |
| Problem, Topic | Domain | `src/types/` |
| supabaseClient | Infrastructure | `src/lib/supabase/client.ts` |
| pyodideWorker | Infrastructure | `src/lib/pyodide/worker.ts` |

---

## 10. Coding Convention Reference

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `ArrayVisualizer`, `TopicCard` |
| Hooks | camelCase, use 접두사 | `useVisualizer`, `useAuth` |
| Store | camelCase, Store 접미사 | `visualizerStore`, `authStore` |
| Engine class | PascalCase, Engine 접미사 | `BubbleSortEngine`, `BfsEngine` |
| 파일명 | kebab-case | `array-visualizer.tsx`, `bubble-sort.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_EXECUTION_TIME`, `SPEED_OPTIONS` |
| 타입/인터페이스 | PascalCase | `AnimationStep`, `Problem` |

### 10.2 Import Order

```typescript
// 1. React / Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. 외부 라이브러리
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';

// 3. 내부 모듈 (@/ alias)
import { Button } from '@/components/ui/button';
import { useVisualizer } from '@/hooks/use-visualizer';
import { BubbleSortEngine } from '@/lib/algorithms/sorting/bubble-sort';

// 4. 상대 경로
import { LocalComponent } from './local-component';

// 5. 타입
import type { AnimationStep, VisualElement } from '@/types';
```

### 10.3 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 | Server |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (OAuth 콜백) | Client |

---

## 11. Implementation Guide

### 11.1 File Structure (최종)

```
src/
├── app/
│   ├── layout.tsx                    # RootLayout (ThemeProvider, AuthProvider)
│   ├── page.tsx                      # Home 랜딩 페이지
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts         # OAuth 콜백
│   ├── learn/
│   │   ├── page.tsx                  # 토픽 목록
│   │   └── [topic]/page.tsx          # 개별 토픽 학습
│   ├── visualize/
│   │   ├── page.tsx                  # 시각화 도구 목록
│   │   └── [id]/page.tsx             # 개별 시각화
│   ├── practice/
│   │   ├── page.tsx                  # 문제 목록
│   │   └── [id]/page.tsx             # 문제 풀이
│   ├── dashboard/
│   │   └── page.tsx                  # 학습 대시보드
│   └── ranking/
│       └── page.tsx                  # 랭킹
├── components/
│   ├── ui/                           # shadcn/ui (Button, Card, Dialog 등)
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── learn/
│   │   ├── topic-card.tsx
│   │   ├── topic-content.tsx
│   │   └── roadmap.tsx
│   ├── visualizer/
│   │   ├── visualizer-canvas.tsx     # 공통 캔버스 래퍼
│   │   ├── visualizer-controls.tsx   # 재생/정지/속도 컨트롤
│   │   ├── visualizer-input.tsx      # 입력값 설정 패널
│   │   ├── step-description.tsx      # 스텝 설명 + 변수 상태
│   │   ├── pseudo-code.tsx           # 의사코드 하이라이트
│   │   ├── array-visualizer.tsx
│   │   ├── linked-list-visualizer.tsx
│   │   ├── stack-queue-visualizer.tsx
│   │   ├── tree-visualizer.tsx
│   │   ├── graph-visualizer.tsx
│   │   └── sorting-visualizer.tsx
│   ├── editor/
│   │   ├── code-editor.tsx           # Monaco Editor 래퍼
│   │   └── execution-result.tsx
│   ├── problem/
│   │   ├── problem-description.tsx
│   │   ├── problem-list.tsx
│   │   └── hint-accordion.tsx
│   ├── dashboard/
│   │   ├── dashboard.tsx
│   │   └── progress-chart.tsx
│   ├── ranking/
│   │   └── ranking-table.tsx
│   └── auth/
│       └── auth-form.tsx
├── lib/
│   ├── algorithms/
│   │   ├── types.ts                  # AlgorithmEngine 인터페이스
│   │   ├── sorting/
│   │   │   ├── bubble-sort.ts
│   │   │   ├── selection-sort.ts
│   │   │   ├── insertion-sort.ts
│   │   │   ├── merge-sort.ts
│   │   │   └── quick-sort.ts
│   │   ├── search/
│   │   │   ├── binary-search.ts
│   │   │   ├── bfs.ts
│   │   │   └── dfs.ts
│   │   └── graph/
│   │       ├── dijkstra.ts
│   │       └── index.ts
│   ├── data-structures/
│   │   ├── array-ops.ts
│   │   ├── linked-list.ts
│   │   ├── stack.ts
│   │   ├── queue.ts
│   │   ├── hash-table.ts
│   │   ├── binary-tree.ts
│   │   ├── bst.ts
│   │   ├── heap.ts
│   │   └── graph.ts
│   ├── problems/
│   │   ├── problem-data.ts           # 문제 목록 데이터
│   │   └── judge.ts                  # 채점 로직
│   ├── supabase/
│   │   ├── client.ts                 # 브라우저 클라이언트
│   │   ├── server.ts                 # 서버 클라이언트
│   │   └── middleware.ts             # Auth 미들웨어
│   ├── pyodide/
│   │   ├── worker.ts                 # Web Worker
│   │   └── loader.ts                 # Pyodide 로더 (lazy)
│   └── utils/
│       └── cn.ts                     # className 유틸
├── store/
│   ├── visualizer-store.ts
│   ├── auth-store.ts
│   └── editor-store.ts
├── hooks/
│   ├── use-visualizer.ts
│   ├── use-code-runner.ts
│   ├── use-auth.ts
│   └── use-progress.ts
├── types/
│   ├── topic.ts
│   ├── problem.ts
│   ├── visualizer.ts
│   └── user.ts
└── content/
    ├── topics/                       # 토픽별 학습 콘텐츠 JSON
    │   ├── array.json
    │   ├── stack.json
    │   └── ...
    └── problems/                     # 문제 데이터 JSON
        ├── array-problems.json
        ├── stack-problems.json
        └── ...
```

### 11.2 Implementation Order

#### Phase 1: 기반 (Sprint 1)
1. [ ] Next.js 15 프로젝트 초기화 (`create-next-app`)
2. [ ] Tailwind CSS + shadcn/ui 설정
3. [ ] TypeScript 타입 정의 (`src/types/`)
4. [ ] Supabase 프로젝트 생성 + 클라이언트 설정 (`src/lib/supabase/`)
5. [ ] 공통 레이아웃 컴포넌트 (Header, Footer)
6. [ ] 테마 (다크/라이트) 설정

#### Phase 2: 시각화 코어 (Sprint 1~2)
7. [ ] AlgorithmEngine 인터페이스 + Zustand Store
8. [ ] VisualizerControls 공통 컴포넌트
9. [ ] ArrayVisualizer + Array 엔진
10. [ ] StackQueueVisualizer + Stack/Queue 엔진
11. [ ] SortingVisualizer + BubbleSort 엔진
12. [ ] LinkedListVisualizer + LinkedList 엔진

#### Phase 3: 학습 콘텐츠 (Sprint 2)
13. [ ] Topic 데이터 구조 + JSON 콘텐츠 작성 (Phase 1: 4개 토픽)
14. [ ] TopicCard, TopicContent 컴포넌트
15. [ ] 학습 로드맵 페이지
16. [ ] 개념 ↔ 시각화 ↔ 문제 링크 시스템

#### Phase 4: 코드 실행 (Sprint 3)
17. [ ] Pyodide Web Worker 설정
18. [ ] Monaco Editor 통합 (dynamic import)
19. [ ] 채점 시스템 (judge.ts)
20. [ ] 문제 데이터 구조 + 첫 15문제 작성
21. [ ] ProblemDescription, HintAccordion 컴포넌트

#### Phase 5: 인증/사용자 (Sprint 5)
22. [ ] Supabase Auth (이메일 + Google)
23. [ ] DB 스키마 적용 (profiles, learning_progress, submissions, bookmarks)
24. [ ] 학습 진행률 저장/조회
25. [ ] Dashboard 페이지
26. [ ] 랭킹 시스템

#### Phase 6: 확장 시각화 (Sprint 4)
27. [ ] TreeVisualizer + BST/Heap 엔진 (D3.js)
28. [ ] GraphVisualizer + BFS/DFS 엔진 (D3.js)
29. [ ] MergeSort, QuickSort, BinarySearch 엔진
30. [ ] DP, Greedy, Dijkstra 시각화

#### Phase 7: 마무리 (Sprint 6)
31. [ ] 반응형 디자인 점검
32. [ ] SEO 최적화
33. [ ] 나머지 문제 추가 (총 45+)
34. [ ] Vercel 배포

---

## 12. NPM Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "zustand": "^5",
    "framer-motion": "^12",
    "d3": "^7",
    "@monaco-editor/react": "^4",
    "next-themes": "^0.4",
    "lucide-react": "^0.4",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@types/d3": "^7",
    "vitest": "^2",
    "@testing-library/react": "^16",
    "playwright": "^1",
    "eslint": "^9",
    "prettier": "^3"
  }
}
```

> **Note**: Pyodide는 CDN에서 런타임 로드 (npm 패키지 아님)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-14 | Initial draft | USER |
