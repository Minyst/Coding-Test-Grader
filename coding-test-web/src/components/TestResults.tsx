"use client";

import type { TestResult } from "@/lib/types";

interface TestResultsProps {
  results: TestResult[];
  passedCount: number;
  totalCount: number;
}

export default function TestResults({
  results,
  passedCount,
  totalCount,
}: TestResultsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300">
          테스트 결과
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            passedCount === totalCount
              ? "bg-green-500/15 text-green-400"
              : passedCount > 0
              ? "bg-yellow-500/15 text-yellow-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {passedCount}/{totalCount} 통과
        </span>
      </div>

      <div className="space-y-2">
        {results.map((result, i) => (
          <div
            key={i}
            className={`rounded-lg border p-4 ${
              result.passed
                ? "border-green-500/30 bg-green-500/5"
                : "border-red-500/30 bg-red-500/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {result.passed ? "✅" : "❌"}
              </span>
              <span className="text-sm font-medium text-gray-200">
                테스트 {i + 1}
              </span>
            </div>

            <div className="space-y-1.5 text-sm font-mono">
              <div className="flex gap-2">
                <span className="text-gray-500 min-w-[60px]">입력:</span>
                <span className="text-gray-300 break-all">{result.input}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 min-w-[60px]">기대값:</span>
                <span className="text-green-400 break-all">{result.expected}</span>
              </div>
              {!result.passed && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[60px]">실제값:</span>
                  <span className="text-red-400 break-all">{result.actual}</span>
                </div>
              )}
              {result.error && (
                <div className="mt-2 rounded bg-red-500/10 p-2 text-xs text-red-400">
                  {result.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
