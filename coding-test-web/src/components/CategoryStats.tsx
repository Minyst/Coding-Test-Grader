"use client";

import type { Problem } from "@/lib/types";

interface CategoryStatsProps {
  problems: Problem[];
  scores: Record<string, number>;
}

export default function CategoryStats({ problems, scores }: CategoryStatsProps) {
  const stats = new Map<string, { total: number; solved: number }>();

  for (const p of problems) {
    if (!stats.has(p.category)) {
      stats.set(p.category, { total: 0, solved: 0 });
    }
    const s = stats.get(p.category)!;
    s.total++;
    if (scores[p.id] >= 95) s.solved++;
  }

  const entries = Array.from(stats.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) return null;

  const totalProblems = problems.length;
  const totalAttempted = Object.keys(scores).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-black">총 {totalProblems}문제</span>
        <span className="text-sm font-semibold text-black">{totalAttempted}회 시도</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {entries.map(([category, { total, solved }]) => {
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
          return (
            <div key={category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black font-medium">{category}</span>
                <span className="text-black font-medium">{solved}/{total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-300 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
