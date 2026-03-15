'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { problems } from '@/content/problems/problem-list';
import { topics } from '@/content/topics/topic-list';

const difficultyLabels: Record<number, string> = {
  1: '입문',
  2: '기초',
  3: '보통',
  4: '어려움',
  5: '심화',
};

const difficultyColors: Record<number, string> = {
  1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  4: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function PracticePage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topicMap = new Map(topics.map((t) => [t.id, t.title]));
  const usedTopicIds = [...new Set(problems.map((p) => p.topicId))];

  const filtered = selectedTopic
    ? problems.filter((p) => p.topicId === selectedTopic)
    : problems;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">문제 풀이</h1>
      <p className="text-muted-foreground mb-6">
        Python으로 알고리즘 문제를 풀고 실시간으로 채점받으세요.
      </p>

      {/* 토픽 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            !selectedTopic
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border hover:bg-muted'
          }`}
        >
          전체 ({problems.length})
        </button>
        {usedTopicIds.map((tid) => {
          const count = problems.filter((p) => p.topicId === tid).length;
          return (
            <button
              key={tid}
              onClick={() => setSelectedTopic(tid)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedTopic === tid
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              {topicMap.get(tid) ?? tid} ({count})
            </button>
          );
        })}
      </div>

      {/* 문제 목록 */}
      <div className="flex flex-col gap-3">
        {filtered.map((p, idx) => (
          <Link key={p.id} href={`/practice/${p.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm font-mono w-6">
                      {idx + 1}
                    </span>
                    <div>
                      <CardTitle className="text-base">{p.title}</CardTitle>
                      <CardDescription className="text-sm mt-0.5">
                        {p.description.split('\n')[0]}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline">{topicMap.get(p.topicId) ?? p.topicId}</Badge>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[p.difficulty]}`}
                    >
                      {difficultyLabels[p.difficulty]}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
