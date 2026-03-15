'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

// 데모 랭킹 데이터 (Supabase 연동 후 실제 데이터로 대체)
const demoRankings = [
  { rank: 1, name: 'algorithm_master', solved: 18, streak: 14 },
  { rank: 2, name: 'code_ninja', solved: 15, streak: 7 },
  { rank: 3, name: 'python_lover', solved: 12, streak: 10 },
  { rank: 4, name: 'data_wizard', solved: 10, streak: 5 },
  { rank: 5, name: 'sort_queen', solved: 9, streak: 3 },
  { rank: 6, name: 'binary_hero', solved: 8, streak: 6 },
  { rank: 7, name: 'dp_fighter', solved: 7, streak: 2 },
  { rank: 8, name: 'graph_explorer', solved: 6, streak: 4 },
  { rank: 9, name: 'stack_overflow', solved: 5, streak: 1 },
  { rank: 10, name: 'queue_master', solved: 4, streak: 3 },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
  return <span className="w-5 text-center text-sm font-mono text-muted-foreground">{rank}</span>;
}

export default function RankingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">랭킹</h1>
      <p className="text-muted-foreground mb-6">
        문제 풀이 수 기준 랭킹입니다.
      </p>

      <Badge variant="secondary" className="mb-4">
        데모 데이터 — Supabase 연동 후 실제 랭킹으로 전환됩니다
      </Badge>

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 text-sm font-medium w-16">순위</th>
              <th className="text-left p-3 text-sm font-medium">사용자</th>
              <th className="text-right p-3 text-sm font-medium">해결 문제</th>
              <th className="text-right p-3 text-sm font-medium">연속 학습</th>
            </tr>
          </thead>
          <tbody>
            {demoRankings.map((r) => (
              <tr
                key={r.rank}
                className={`border-b last:border-0 ${
                  r.rank <= 3 ? 'bg-yellow-50/50 dark:bg-yellow-950/20' : ''
                }`}
              >
                <td className="p-3">
                  <div className="flex items-center justify-center">
                    <RankIcon rank={r.rank} />
                  </div>
                </td>
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-right">
                  <Badge variant="outline">{r.solved}문제</Badge>
                </td>
                <td className="p-3 text-right text-sm text-muted-foreground">
                  {r.streak}일
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
