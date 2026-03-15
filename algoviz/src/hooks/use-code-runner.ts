'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs?: number;
}

interface JudgeResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTimeMs: number;
}

export function useCodeRunner() {
  const workerRef = useRef<Worker | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [judgeResults, setJudgeResults] = useState<JudgeResult[] | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      setIsLoading(true);
      workerRef.current = new Worker(
        new URL('@/lib/pyodide/worker.ts', import.meta.url)
      );
      workerRef.current.onmessage = (event) => {
        setIsLoading(false);
        setIsRunning(false);
        const data = event.data;

        if (data.type === 'result') {
          setResult({ output: data.output, executionTimeMs: data.executionTimeMs });
        } else if (data.type === 'error') {
          setResult({ output: '', error: data.error });
        } else if (data.type === 'judge-result') {
          setJudgeResults(data.results);
        }
      };
    }
    return workerRef.current;
  }, []);

  const execute = useCallback(
    (code: string) => {
      setIsRunning(true);
      setResult(null);
      setJudgeResults(null);
      const worker = getWorker();
      worker.postMessage({ type: 'execute', code });
    },
    [getWorker]
  );

  const judge = useCallback(
    (code: string, testCases: Array<{ input: string; expectedOutput: string }>) => {
      setIsRunning(true);
      setResult(null);
      setJudgeResults(null);
      const worker = getWorker();
      worker.postMessage({ type: 'judge', code, testCases });
    },
    [getWorker]
  );

  return { execute, judge, isRunning, isLoading, result, judgeResults };
}
