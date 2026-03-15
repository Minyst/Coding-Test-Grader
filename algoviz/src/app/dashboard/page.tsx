'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Trophy, Flame, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { problems } from '@/content/problems/problem-list';
import { topics } from '@/content/topics/topic-list';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <Card className="p-8">
          <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <CardHeader className="px-0 pt-0">
            <CardTitle>로그인이 필요합니다</CardTitle>
            <CardDescription>
              학습 진행률을 저장하고 통계를 보려면 로그인해주세요.
            </CardDescription>
          </CardHeader>
          <Link href="/auth/login">
            <Button>로그인</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split('@')[0] ||
    '사용자';

  const stats = [
    {
      icon: BookOpen,
      label: '학습 토픽',
      value: `${topics.length}개`,
      color: 'text-blue-500',
    },
    {
      icon: Code,
      label: '전체 문제',
      value: `${problems.length}개`,
      color: 'text-green-500',
    },
    {
      icon: Trophy,
      label: '해결 문제',
      value: '0개',
      color: 'text-yellow-500',
    },
    {
      icon: Flame,
      label: '연속 학습',
      value: '0일',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            안녕하세요, {displayName}님!
          </h1>
          <p className="text-muted-foreground">오늘도 알고리즘 공부 화이팅!</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {user.email}
        </Badge>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 추천 문제 */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">추천 문제</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {problems.slice(0, 3).map((p) => (
            <Link key={p.id} href={`/practice/${p.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                <p className="font-medium mb-1">{p.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {p.description.split('\n')[0]}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Card>

      {/* 학습 로드맵 진행 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">학습 로드맵</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((phase) => {
            const phaseTopics = topics.filter((t) => t.phase === phase);
            const phaseNames: Record<number, string> = {
              1: '기초 자료구조',
              2: '트리 & 그래프',
              3: '핵심 알고리즘',
              4: '심화 알고리즘',
            };
            return (
              <div key={phase} className="flex items-center gap-4">
                <Badge variant={phase === 1 ? 'default' : 'outline'}>
                  Phase {phase}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{phaseNames[phase]}</p>
                  <p className="text-xs text-muted-foreground">
                    {phaseTopics.map((t) => t.title).join(', ')}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  0/{phaseTopics.length}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
