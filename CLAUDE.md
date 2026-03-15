# AlgoViz (알고비즈) - CLAUDE.md

## Project Overview
비전공생이 자료구조와 알고리즘을 쉽게 이해하고 코딩테스트를 통과할 수 있도록 돕는 올인원 학습 웹앱.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation/Visualization**: Framer Motion + D3.js (자료구조/알고리즘 시각화)
- **Code Editor**: Monaco Editor (VS Code 엔진, Python 코드 작성용)
- **Code Execution**: Pyodide (브라우저 내 Python 실행) 또는 Judge0 API (서버사이드 실행)
- **Backend/Auth**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **State Management**: Zustand
- **Deployment**: Vercel

## Target Users
- 비전공생, 코딩 입문자
- 코딩테스트를 처음 준비하는 사람
- 자료구조/알고리즘 개념이 부족한 취업 준비생

## Core Features

### 1. 개념 학습 (Learn)
- 자료구조/알고리즘별 개념 설명 페이지
- 비전공자 눈높이의 비유와 그림 중심 설명
- 난이도별 학습 로드맵 (입문 → 기초 → 심화)
- 각 개념의 실생활 비유 (예: 스택 = 접시 쌓기, 큐 = 줄서기)

### 2. 시각화 (Visualize)
- 자료구조 동작 애니메이션 (삽입, 삭제, 탐색 과정)
- 알고리즘 실행 과정 스텝별 시각화
- 사용자가 직접 값을 입력하고 동작을 관찰
- 속도 조절, 일시정지, 스텝 단위 실행 지원
- **지원 자료구조**: Array, Linked List, Stack, Queue, Hash Table, Tree (Binary, BST, Heap), Graph
- **지원 알고리즘**: Sorting (Bubble, Selection, Insertion, Merge, Quick), BFS/DFS, Binary Search, Dynamic Programming, Greedy, Dijkstra

### 3. 문제 풀이 (Practice)
- 난이도별 문제 (Lv.1 ~ Lv.5)
- 범용 코딩테스트 대비 (백준, 프로그래머스, LeetCode 스타일)
- Python 코드 에디터 + 실시간 실행/채점
- 힌트 시스템 (단계별 힌트 제공)
- 풀이 해설 + 시간/공간 복잡도 분석
- 관련 개념으로 자동 링크

### 4. 사용자 시스템 (User)
- 회원가입/로그인 (이메일, 소셜 로그인)
- 학습 진행률 대시보드
- 문제 풀이 기록 및 통계
- 랭킹 시스템 (문제 풀이 수, 연속 학습일 등)
- 북마크 (개념, 문제 저장)

## Content Scope (학습 커리큘럼)

### Phase 1: 기초 자료구조
1. 배열 (Array) & 문자열 (String)
2. 연결 리스트 (Linked List)
3. 스택 (Stack) & 큐 (Queue)
4. 해시 테이블 (Hash Table)

### Phase 2: 트리 & 그래프
5. 트리 (Binary Tree, BST)
6. 힙 (Heap) & 우선순위 큐
7. 그래프 (Graph) 기초

### Phase 3: 핵심 알고리즘
8. 정렬 알고리즘 (Sorting)
9. 이진 탐색 (Binary Search)
10. BFS / DFS
11. 재귀 & 백트래킹

### Phase 4: 심화 알고리즘
12. 동적 프로그래밍 (DP)
13. 그리디 (Greedy)
14. 최단 경로 (Dijkstra, Floyd)
15. 유니온 파인드 & MST

## Project Structure
```
algoviz/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # 로그인/회원가입 페이지
│   │   ├── learn/              # 개념 학습 페이지
│   │   │   └── [topic]/        # 토픽별 동적 라우팅
│   │   ├── visualize/          # 시각화 페이지
│   │   │   └── [structure]/    # 자료구조/알고리즘별
│   │   ├── practice/           # 문제 풀이 페이지
│   │   │   └── [problemId]/    # 개별 문제 페이지
│   │   ├── dashboard/          # 사용자 대시보드
│   │   ├── ranking/            # 랭킹 페이지
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── learn/              # 학습 관련 컴포넌트
│   │   ├── visualizer/         # 시각화 엔진 컴포넌트
│   │   ├── editor/             # 코드 에디터 컴포넌트
│   │   ├── problem/            # 문제 풀이 컴포넌트
│   │   └── layout/             # 레이아웃 (Header, Sidebar 등)
│   ├── lib/
│   │   ├── algorithms/         # 알고리즘 로직 (시각화용 스텝 생성)
│   │   ├── data-structures/    # 자료구조 구현 (시각화용)
│   │   ├── problems/           # 문제 데이터 & 채점 로직
│   │   ├── supabase/            # Supabase 클라이언트 설정
│   │   └── utils/              # 유틸리티 함수
│   ├── store/                  # Zustand 상태 관리
│   ├── hooks/                  # Custom React Hooks
│   ├── types/                  # TypeScript 타입 정의
│   └── content/                # 학습 컨텐츠 (MDX or JSON)
├── public/
│   └── images/                 # 정적 이미지
├── CLAUDE.md
├── package.json
└── tsconfig.json
```

## Design Principles

### UX/UI
- **비전공자 친화적**: 전문 용어 최소화, 쉬운 한국어 설명 우선
- **시각적 학습**: 텍스트보다 애니메이션과 다이어그램 중심
- **단계적 학습**: 쉬운 것부터 어려운 것으로 자연스러운 흐름
- **다크/라이트 모드** 지원
- **반응형 디자인**: 모바일에서도 사용 가능

### Code Quality
- TypeScript strict mode 사용
- 컴포넌트는 단일 책임 원칙 준수
- 시각화 로직과 UI 로직 분리
- 한국어 주석 허용 (학습 콘텐츠 관련 코드)

### Performance
- 시각화 컴포넌트는 Canvas 또는 SVG 기반으로 성능 최적화
- 학습 콘텐츠는 정적 생성 (SSG) 활용
- 코드 에디터는 dynamic import로 lazy loading

## Coding Conventions
- **파일명**: kebab-case (예: `binary-search.tsx`)
- **컴포넌트명**: PascalCase (예: `BinarySearchVisualizer`)
- **함수명**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **CSS**: Tailwind CSS 유틸리티 클래스 사용
- **Import 순서**: React → Next.js → 외부 라이브러리 → 내부 모듈 → 타입

## Key Commands
```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크
```

## Important Notes
- 모든 학습 콘텐츠는 한국어로 작성
- Python 코드 실행은 보안을 위해 샌드박스 환경에서만 실행
- 문제 데이터는 저작권 이슈를 피하기 위해 자체 제작
- 시각화 속도/스텝 조절은 모든 시각화 컴포넌트에서 일관되게 적용
