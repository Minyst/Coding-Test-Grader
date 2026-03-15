'use client';

import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface JudgeResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTimeMs: number;
}

interface ExecutionResultProps {
  isRunning: boolean;
  isLoading: boolean;
  result: { output: string; error?: string; executionTimeMs?: number } | null;
  judgeResults: JudgeResult[] | null;
}

export function ExecutionResult({
  isRunning,
  isLoading,
  result,
  judgeResults,
}: ExecutionResultProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Python 런타임을 불러오는 중... (처음에만 시간이 걸려요)</span>
        </div>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>코드 실행 중...</span>
        </div>
      </Card>
    );
  }

  if (judgeResults) {
    const passed = judgeResults.filter((r) => r.passed).length;
    const total = judgeResults.length;
    const allPassed = passed === total;

    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {allPassed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="font-semibold">
            {allPassed ? '모든 테스트 통과!' : `${passed}/${total} 테스트 통과`}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {judgeResults.map((r, i) => (
            <div
              key={i}
              className={`p-3 rounded text-sm ${
                r.passed
                  ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">
                  {r.passed ? '✅' : '❌'} 테스트 {i + 1}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {r.executionTimeMs}ms
                </span>
              </div>
              <div className="font-mono text-xs space-y-1">
                <div>입력: {r.input}</div>
                <div>예상: {r.expected}</div>
                {!r.passed && <div className="text-red-600 dark:text-red-400">출력: {r.actual}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (result) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">실행 결과</span>
          {result.executionTimeMs !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {result.executionTimeMs}ms
            </span>
          )}
        </div>
        {result.error ? (
          <pre className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-3 rounded overflow-x-auto">
            {result.error}
          </pre>
        ) : (
          <pre className="text-sm bg-muted p-3 rounded overflow-x-auto font-mono">
            {result.output || '(출력 없음)'}
          </pre>
        )}
      </Card>
    );
  }

  return null;
}
