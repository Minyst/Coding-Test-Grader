"use client";

import type { TestResult } from "@/lib/types";
import TestResults from "@/components/TestResults";
import CodeDiff from "@/components/CodeDiff";
import { useState } from "react";

interface GradeResultProps {
  grade: "perfect" | "partial" | "wrong";
  message: string;
  emoji: string;
  passedCount: number;
  totalCount: number;
  testResults: TestResult[];
  answerCode: string;
  userCode: string;
}

export default function GradeResult({
  grade,
  message,
  emoji,
  passedCount,
  totalCount,
  testResults,
  answerCode,
  userCode,
}: GradeResultProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const bgColors = {
    perfect: "bg-green-500/10 border-green-500/30",
    partial: "bg-yellow-500/10 border-yellow-500/30",
    wrong: "bg-red-500/10 border-red-500/30",
  };

  const pct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const strokeColor =
    grade === "perfect" ? "#22c55e" : grade === "partial" ? "#eab308" : "#ef4444";

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <div className={`rounded-xl border p-6 ${bgColors[grade]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">
              <span className="text-lg">{emoji}</span> {passedCount}/{totalCount}
            </p>
            <p className="mt-1 text-gray-300">{message}</p>
          </div>
          <div className="relative h-20 w-20">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="40"
                fill="none" stroke="currentColor"
                strokeWidth="8" className="text-gray-700"
              />
              <circle
                cx="50" cy="50" r="40"
                fill="none" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${pct * 2.51} 251`}
                style={{ stroke: strokeColor }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <TestResults
        results={testResults}
        passedCount={passedCount}
        totalCount={totalCount}
      />

      {/* Answer Code Diff Toggle */}
      {grade !== "perfect" && (
        <div>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAnswer ? "코드 비교 숨기기 ▲" : "정답 코드와 비교하기 ▼"}
          </button>
          {showAnswer && (
            <div className="mt-2">
              <CodeDiff userCode={userCode} answerCode={answerCode} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
