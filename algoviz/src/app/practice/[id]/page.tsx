'use client';

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, FlaskConical, Eye, EyeOff, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from '@/components/editor/code-editor';
import { ExecutionResult } from '@/components/editor/execution-result';
import { useCodeRunner } from '@/hooks/use-code-runner';
import { problems } from '@/content/problems/problem-list';

const difficultyLabels: Record<number, string> = {
  1: '입문', 2: '기초', 3: '보통', 4: '어려움', 5: '심화',
};

export default function ProblemPage() {
  const params = useParams();
  const problem = useMemo(
    () => problems.find((p) => p.id === params.id),
    [params.id]
  );

  const [code, setCode] = useState(problem?.starterCode ?? '');
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { execute, judge, isRunning, isLoading, result, judgeResults } = useCodeRunner();

  if (!problem) {
    notFound();
  }

  const handleRun = () => {
    execute(code);
  };

  const handleJudge = () => {
    judge(code, problem.testCases);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/practice">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> 목록
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 왼쪽: 문제 설명 */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              <Badge variant="secondary">
                {difficultyLabels[problem.difficulty]}
              </Badge>
            </div>
            <p className="text-muted-foreground whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* 제약 조건 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">제약 조건</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Card>

          {/* 예제 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">예제</h3>
            <div className="space-y-3">
              {problem.examples.map((ex, i) => (
                <div key={i} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">입력</span>
                      <pre className="bg-muted p-2 rounded text-sm font-mono mt-1">{ex.input}</pre>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">출력</span>
                      <pre className="bg-muted p-2 rounded text-sm font-mono mt-1">{ex.output}</pre>
                    </div>
                  </div>
                  {ex.explanation && (
                    <p className="text-xs text-muted-foreground">
                      설명: {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 힌트 */}
          <Card className="p-4">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 w-full text-left font-semibold"
            >
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              힌트 ({problem.hints.length}개)
              {showHints ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </button>
            {showHints && (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {problem.hints.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-yellow-500 shrink-0">💡</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* 풀이 보기 */}
          <Card className="p-4">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 w-full text-left font-semibold"
            >
              {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              풀이 보기
              {showSolution ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </button>
            {showSolution && (
              <div className="mt-3 space-y-3">
                <pre className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto">
                  {problem.solution.code}
                </pre>
                <p className="text-sm text-muted-foreground">{problem.solution.explanation}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>시간: {problem.solution.timeComplexity}</span>
                  <span>공간: {problem.solution.spaceComplexity}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* 오른쪽: 코드 에디터 + 실행 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">코드 작성</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning || isLoading}
              >
                <Play className="h-4 w-4 mr-1" /> 실행
              </Button>
              <Button
                size="sm"
                onClick={handleJudge}
                disabled={isRunning || isLoading}
              >
                <FlaskConical className="h-4 w-4 mr-1" /> 채점
              </Button>
            </div>
          </div>

          <CodeEditor value={code} onChange={setCode} height="400px" />

          <ExecutionResult
            isRunning={isRunning}
            isLoading={isLoading}
            result={result}
            judgeResults={judgeResults}
          />
        </div>
      </div>
    </div>
  );
}
