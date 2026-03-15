# AlgoViz Planning Document

> **Summary**: 비전공생이 자료구조/알고리즘을 시각적으로 이해하고 코딩테스트를 통과할 수 있도록 돕는 올인원 학습 웹앱
>
> **Project**: AlgoViz (알고비즈)
> **Version**: 0.1.0
> **Author**: USER
> **Date**: 2026-03-14
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 비전공생이 자료구조/알고리즘을 텍스트만으로 이해하기 어렵고, 기존 학습 플랫폼은 전공자 중심으로 진입장벽이 높다 |
| **Solution** | 실생활 비유 + 애니메이션 시각화 + 단계별 문제풀이를 결합한 올인원 학습 웹앱 |
| **Function/UX Effect** | 개념을 보고 → 동작을 눈으로 확인하고 → 직접 코드로 풀어보는 3단계 학습 흐름으로 이해도 극대화 |
| **Core Value** | "보면 이해된다" — 추상적 개념을 시각화로 직관화하여 비전공자도 코딩테스트를 통과할 수 있는 실력 달성 |

---

## 1. Overview

### 1.1 Purpose

자료구조와 알고리즘은 코딩테스트의 핵심이지만, 비전공생에게는 추상적이고 난해하다. AlgoViz는 시각화 중심의 학습 경험을 제공하여 "읽는 학습"이 아닌 "보는 학습"으로 개념 이해의 진입장벽을 낮추고, 체계적인 문제풀이 훈련을 통해 실전 코딩테스트 통과 수준까지 이끈다.

### 1.2 Background

- 비전공 출신 개발 취업 희망자 지속 증가 (부트캠프, 국비교육 등)
- 기존 플랫폼(백준, 프로그래머스)은 문제 풀이 중심으로 개념 학습/시각화 부족
- 해외 시각화 도구(VisuAlgo 등)는 영어 중심이며 한국 코딩테스트 유형과 괴리
- 개념 이해 → 시각화 확인 → 문제 풀이로 이어지는 통합 학습 플로우 부재

### 1.3 Related Documents

- CLAUDE.md (프로젝트 정의)
- `docs/02-design/features/algoviz.design.md` (설계 - 추후 작성)

---

## 2. Scope

### 2.1 In Scope

- [ ] 개념 학습 모듈: 15개 토픽 (자료구조 7 + 알고리즘 8) 한국어 설명
- [ ] 시각화 엔진: 자료구조/알고리즘 동작 애니메이션 (스텝 실행, 속도 조절)
- [ ] 문제 풀이 시스템: Python 코드 에디터 + 브라우저 내 실행/채점
- [ ] 사용자 시스템: 회원가입/로그인, 학습 진행률, 랭킹
- [ ] 학습 로드맵: 입문 → 기초 → 심화 단계별 가이드
- [ ] 반응형 디자인: 데스크탑 + 모바일 지원

### 2.2 Out of Scope

- Python 외 언어 지원 (Java, C++ 등) — v2에서 고려
- AI 기반 문제 추천/자동 힌트 생성 — v2에서 고려
- 실시간 대전/경쟁 모드
- 네이티브 모바일 앱 (React Native 등)
- 다국어 지원 (영어, 일본어 등)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 15개 토픽별 개념 설명 페이지 (실생활 비유, 다이어그램 포함) | High | Pending |
| FR-02 | 자료구조 동작 시각화 (Array, LinkedList, Stack, Queue, HashTable, Tree, Graph) | High | Pending |
| FR-03 | 알고리즘 실행 시각화 (정렬 5종, BFS/DFS, BinarySearch, DP, Greedy, Dijkstra) | High | Pending |
| FR-04 | 시각화 컨트롤 (재생/일시정지/스텝실행/속도조절/리셋) | High | Pending |
| FR-05 | 사용자 입력값으로 시각화 실행 (직접 배열, 그래프 등 입력) | Medium | Pending |
| FR-06 | Monaco Editor 기반 Python 코드 에디터 | High | Pending |
| FR-07 | Pyodide 기반 브라우저 내 Python 코드 실행 및 채점 | High | Pending |
| FR-08 | 난이도별 문제 제공 (Lv.1 ~ Lv.5, 토픽별 분류) | High | Pending |
| FR-09 | 단계별 힌트 시스템 (3단계 힌트) | Medium | Pending |
| FR-10 | 풀이 해설 + 시간/공간 복잡도 분석 표시 | Medium | Pending |
| FR-11 | Supabase Auth 기반 회원가입/로그인 (이메일 + Google 소셜) | High | Pending |
| FR-12 | 학습 진행률 대시보드 (토픽별 완료율, 문제 풀이 통계) | Medium | Pending |
| FR-13 | 랭킹 시스템 (문제 풀이 수, 연속 학습일 기준) | Low | Pending |
| FR-14 | 북마크 기능 (개념 페이지, 문제 저장) | Low | Pending |
| FR-15 | 다크/라이트 모드 전환 | Medium | Pending |
| FR-16 | 개념 ↔ 시각화 ↔ 문제 간 자동 링크/내비게이션 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 시각화 애니메이션 60fps 유지 | Chrome DevTools Performance 탭 |
| Performance | 페이지 초기 로드 3초 이내 (LCP) | Lighthouse |
| Performance | Pyodide 초기 로드 5초 이내 (lazy load) | 실측 |
| Security | Supabase RLS 적용, XSS 방지 | OWASP 체크리스트 |
| Accessibility | 키보드 내비게이션, 색상 대비 4.5:1 이상 | axe DevTools |
| SEO | 학습 콘텐츠 페이지 SSG 적용 | Lighthouse SEO 점수 90+ |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 15개 토픽 개념 학습 페이지 완성
- [ ] 최소 10개 시각화 컴포넌트 동작 확인
- [ ] 토픽별 최소 3문제 (총 45문제+) 제공
- [ ] 회원가입/로그인/진행률 저장 동작
- [ ] Vercel 배포 완료 및 접근 가능
- [ ] 모바일 반응형 확인

### 4.2 Quality Criteria

- [ ] TypeScript strict 모드 에러 0건
- [ ] ESLint 에러 0건
- [ ] Lighthouse Performance 80+
- [ ] 주요 플로우 수동 QA 통과

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Pyodide 초기 로드 시간이 길어 UX 저하 | High | High | lazy loading + 로딩 인디케이터 + Web Worker 분리 |
| 시각화 컴포넌트 개발 복잡도가 높아 일정 지연 | High | Medium | 핵심 자료구조 5개 우선 개발, 나머지는 점진적 추가 |
| 문제 콘텐츠 자체 제작 부담 | Medium | High | 토픽당 3문제로 시작, 공개 알고리즘 문제 참고하여 자체 변형 |
| Supabase 무료 플랜 제한 (500MB DB, 1GB Storage) | Medium | Low | 초기 사용자 규모에서 충분, 성장 시 Pro 플랜 전환 |
| D3.js + Framer Motion 학습 곡선 | Medium | Medium | Framer Motion 중심 구현, 복잡한 그래프만 D3.js 활용 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | ☑ |
| **Enterprise** | Strict layer separation, microservices | High-traffic systems | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React+Vite / Vanilla | **Next.js 15 (App Router)** | SSG로 학습콘텐츠 정적 생성, SEO 유리, Vercel 최적화 |
| State Management | Context / Zustand / Redux | **Zustand** | 경량, 보일러플레이트 최소, 시각화 상태 관리에 적합 |
| Styling | Tailwind / CSS Modules / styled | **Tailwind CSS + shadcn/ui** | 빠른 UI 개발, 일관된 디자인 시스템 |
| Visualization | D3.js / Framer Motion / Canvas | **Framer Motion + SVG (주) / D3.js (보조)** | Framer Motion으로 대부분 처리, 복잡한 그래프만 D3 |
| Code Editor | Monaco / CodeMirror / Ace | **Monaco Editor** | VS Code 엔진, Python 자동완성/하이라이팅 우수 |
| Python Execution | Pyodide / Judge0 / Piston | **Pyodide (WASM)** | 서버 비용 없음, 브라우저 내 실행, 오프라인 가능 |
| Backend | Supabase / Firebase / Custom | **Supabase** | PostgreSQL 기반, Auth+DB+Storage 통합, RLS 지원 |
| Deployment | Vercel / Netlify / AWS | **Vercel** | Next.js 최적화, 무료 플랜 충분, 자동 배포 |
| Testing | Jest / Vitest / Playwright | **Vitest + Playwright** | Vitest(단위), Playwright(E2E) |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure:
┌─────────────────────────────────────────────────────┐
│ src/                                                │
│   app/              → Next.js App Router 페이지     │
│   components/       → 재사용 UI 컴포넌트            │
│     ui/             → shadcn/ui 기본 컴포넌트       │
│     learn/          → 학습 모듈 컴포넌트            │
│     visualizer/     → 시각화 엔진 컴포넌트          │
│     editor/         → 코드 에디터 컴포넌트          │
│     problem/        → 문제 풀이 컴포넌트            │
│     layout/         → Header, Sidebar, Footer       │
│   lib/                                              │
│     algorithms/     → 알고리즘 로직 (스텝 생성)     │
│     data-structures/→ 자료구조 구현 (시각화용)      │
│     problems/       → 문제 데이터 & 채점 로직       │
│     supabase/       → Supabase 클라이언트 설정      │
│     utils/          → 유틸리티                      │
│   store/            → Zustand 상태 관리             │
│   hooks/            → Custom React Hooks            │
│   types/            → TypeScript 타입 정의          │
│   content/          → 학습 콘텐츠 (MDX/JSON)        │
└─────────────────────────────────────────────────────┘
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] ESLint configuration (`.eslintrc.*`)
- [ ] Prettier configuration (`.prettierrc`)
- [ ] TypeScript configuration (`tsconfig.json`)

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | CLAUDE.md에 정의됨 | kebab-case 파일, PascalCase 컴포넌트 | High |
| **Folder structure** | CLAUDE.md에 정의됨 | Dynamic 레벨 구조 확정 | High |
| **Import order** | CLAUDE.md에 정의됨 | React → Next → 외부 → 내부 → 타입 | Medium |
| **Environment variables** | 미정의 | Supabase 키, 사이트 URL | High |
| **Error handling** | 미정의 | Error Boundary + toast 알림 패턴 | Medium |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client | ☑ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | Client | ☑ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 (서버용) | Server | ☑ |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (OAuth 콜백용) | Client | ☑ |

### 7.4 Pipeline Integration

| Phase | Status | Document Location | Command |
|-------|:------:|-------------------|---------|
| Phase 1 (Schema) | ☐ | `docs/01-plan/schema.md` | `/phase-1-schema` |
| Phase 2 (Convention) | ☐ | `docs/01-plan/conventions.md` | `/phase-2-convention` |

---

## 8. Available Tools & Integration Plan

### 8.1 MCP Servers (활용 계획)

| MCP Server | Purpose in AlgoViz | Usage Phase |
|------------|-------------------|-------------|
| **context7** | Next.js, Supabase, D3.js, Framer Motion 공식 문서 실시간 조회 | Design, Do |
| **github** | 레포 관리, PR/이슈 관리, 코드 푸시 | Do, Check |
| **jupyter-executor** | 알고리즘 로직 프로토타이핑, Python 채점 로직 검증 | Do |

### 8.2 Installed Skills (활용 계획)

| Skill | Purpose in AlgoViz | Usage Phase |
|-------|-------------------|-------------|
| **plotly** | 인터랙티브 시각화 패턴 참고 (D3.js/Framer Motion 구현에 영감) | Design |
| **networkx** | 그래프 자료구조/알고리즘 로직 참고 및 검증 | Do |
| **matplotlib / seaborn** | 알고리즘 복잡도 비교 차트 생성 참고 | Do |
| **scientific-visualization** | 시각화 모범 사례 참고 | Design |
| **scientific-schematics** | 자료구조 다이어그램 설계 참고 | Design |
| **markdown-mermaid-writing** | 문서 내 다이어그램 작성 | Plan, Design |
| **find-docs / context7** | 라이브러리 최신 문서 조회 | 전 단계 |
| **scikit-learn** | 향후 AI 문제 추천 기능 참고 (v2) | — |
| **generate-image** | 학습 콘텐츠용 일러스트/다이어그램 생성 | Do |
| **statistical-analysis** | 알고리즘 시간복잡도 시각화 데이터 검증 | Do |

### 8.3 bkit Agents (PDCA 연동)

| Agent | Role | PDCA Phase |
|-------|------|------------|
| **gap-detector** | 설계 vs 구현 비교 | Check |
| **pdca-iterator** | 자동 코드 수정 | Act |
| **code-analyzer** | 코드 품질 분석 | Check |
| **report-generator** | 완료 보고서 생성 | Report |
| **frontend-architect** | UI 아키텍처 자문 | Design, Do |

---

## 9. Implementation Roadmap

### Sprint 1: 기반 구축 (프로젝트 셋업 + 핵심 시각화)
- [ ] Next.js 15 프로젝트 초기화 + Tailwind/shadcn 설정
- [ ] Supabase 프로젝트 생성 + Auth 설정
- [ ] 공통 레이아웃 (Header, Sidebar, Footer)
- [ ] 시각화 엔진 코어 (VisualizerControls, AnimationEngine)
- [ ] Array 시각화 컴포넌트 (첫 번째 시각화)
- [ ] Stack/Queue 시각화 컴포넌트

### Sprint 2: 학습 + 시각화 확장
- [ ] 개념 학습 페이지 템플릿 + 콘텐츠 (Phase 1: 기초 자료구조 4개)
- [ ] LinkedList 시각화
- [ ] HashTable 시각화
- [ ] 정렬 알고리즘 시각화 (Bubble, Selection, Insertion)
- [ ] 학습 로드맵 페이지

### Sprint 3: 코드 에디터 + 문제 풀이
- [ ] Monaco Editor 통합
- [ ] Pyodide 통합 (Web Worker)
- [ ] 문제 데이터 구조 설계 + 첫 15문제 제작
- [ ] 채점 시스템 구현
- [ ] 힌트 시스템

### Sprint 4: 트리/그래프 + 심화 알고리즘
- [ ] Binary Tree / BST 시각화
- [ ] Heap 시각화
- [ ] Graph 시각화 + BFS/DFS 시각화
- [ ] Merge Sort / Quick Sort 시각화
- [ ] Binary Search 시각화
- [ ] 개념 학습 콘텐츠 (Phase 2, 3)

### Sprint 5: 사용자 시스템 + 심화
- [ ] Supabase Auth 연동 (이메일 + Google)
- [ ] 학습 진행률 DB 설계 + 대시보드
- [ ] 문제 풀이 기록 저장
- [ ] DP / Greedy / Dijkstra 시각화
- [ ] 개념 학습 콘텐츠 (Phase 4)

### Sprint 6: 마무리 + 배포
- [ ] 랭킹 시스템
- [ ] 북마크 기능
- [ ] 다크/라이트 모드
- [ ] 반응형 디자인 점검
- [ ] SEO 최적화 (메타태그, OG)
- [ ] Vercel 배포 + 도메인 연결
- [ ] 나머지 문제 추가 (총 45+)

---

## 10. Supabase Database Schema (초안)

```sql
-- 사용자 프로필 (auth.users 확장)
profiles (
  id uuid PK → auth.users.id,
  username text UNIQUE,
  avatar_url text,
  streak_days int DEFAULT 0,
  last_active_date date,
  created_at timestamptz
)

-- 학습 진행률
learning_progress (
  id uuid PK,
  user_id uuid FK → profiles.id,
  topic_id text,           -- 'array', 'stack', 'bfs' 등
  status text,             -- 'not_started' | 'in_progress' | 'completed'
  completed_at timestamptz,
  UNIQUE(user_id, topic_id)
)

-- 문제 풀이 기록
submissions (
  id uuid PK,
  user_id uuid FK → profiles.id,
  problem_id text,
  code text,
  is_correct boolean,
  execution_time_ms int,
  submitted_at timestamptz
)

-- 북마크
bookmarks (
  id uuid PK,
  user_id uuid FK → profiles.id,
  target_type text,        -- 'topic' | 'problem'
  target_id text,
  created_at timestamptz,
  UNIQUE(user_id, target_type, target_id)
)
```

---

## 11. Next Steps

1. [ ] Design 문서 작성 (`/pdca design algoviz`)
2. [ ] Supabase 프로젝트 생성 및 환경변수 설정
3. [ ] Next.js 프로젝트 초기화
4. [ ] 구현 시작 (`/pdca do algoviz`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-14 | Initial draft | USER |
