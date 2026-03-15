"use client";

import type { Change } from "diff";
import CodeBlock from "@/components/CodeBlock";

interface GradeResultProps {
  similarity: number;
  grade: "perfect" | "close" | "partial" | "wrong";
  message: string;
  emoji: string;
  diff: Change[];
  answerCode: string;
}

export default function GradeResult({
  similarity,
  grade,
  message,
  emoji,
  diff,
  answerCode,
}: GradeResultProps) {
  const gradeColors = {
    perfect: "from-green-500 to-emerald-500",
    close: "from-blue-500 to-cyan-500",
    partial: "from-yellow-500 to-orange-500",
    wrong: "from-red-500 to-pink-500",
  };

  const bgColors = {
    perfect: "bg-green-500/10 border-green-500/30",
    close: "bg-blue-500/10 border-blue-500/30",
    partial: "bg-yellow-500/10 border-yellow-500/30",
    wrong: "bg-red-500/10 border-red-500/30",
  };

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <div className={`rounded-xl border p-6 ${bgColors[grade]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">
              <span className="text-lg">{emoji}</span> {similarity}%
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
                strokeDasharray={`${similarity * 2.51} 251`}
                className={`bg-gradient-to-r ${gradeColors[grade]}`}
                style={{ stroke: grade === "perfect" ? "#22c55e" : grade === "close" ? "#3b82f6" : grade === "partial" ? "#eab308" : "#ef4444" }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Diff View */}
      {grade !== "perfect" && (
        <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
            <span className="text-sm font-medium text-gray-300">차이점 비교</span>
            <div className="flex gap-3 text-xs">
              <span className="text-red-400">- 정답에 있는 줄</span>
              <span className="text-green-400">+ 내가 작성한 줄</span>
            </div>
          </div>
          <pre className="max-h-[300px] overflow-auto p-4 text-sm">
            {diff.map((change, i) => {
              if (change.added) {
                return (
                  <span key={i} className="block bg-green-500/15 text-green-400">
                    {change.value.split("\n").filter(Boolean).map((line, j) => (
                      <span key={j} className="block">+ {line}</span>
                    ))}
                  </span>
                );
              }
              if (change.removed) {
                return (
                  <span key={i} className="block bg-red-500/15 text-red-400">
                    {change.value.split("\n").filter(Boolean).map((line, j) => (
                      <span key={j} className="block">- {line}</span>
                    ))}
                  </span>
                );
              }
              return (
                <span key={i} className="block text-gray-400">
                  {change.value.split("\n").filter(Boolean).map((line, j) => (
                    <span key={j} className="block">  {line}</span>
                  ))}
                </span>
              );
            })}
          </pre>
        </div>
      )}

      {/* Answer Code - auto show when not perfect */}
      {grade !== "perfect" && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-300">정답 코드</p>
          <CodeBlock code={answerCode} />
        </div>
      )}
    </div>
  );
}
