import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { topics } from '@/content/topics/topic-list';

export default function LearnPage() {
  const phases = [
    { num: 1, title: 'Phase 1: 기초 자료구조' },
    { num: 2, title: 'Phase 2: 트리 & 그래프' },
    { num: 3, title: 'Phase 3: 핵심 알고리즘' },
    { num: 4, title: 'Phase 4: 심화 알고리즘' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">개념 학습</h1>
      <p className="text-muted-foreground mb-8">
        비전공자 눈높이에 맞춘 자료구조/알고리즘 개념 설명입니다. 쉬운 것부터 차근차근 배워보세요.
      </p>

      {phases.map((phase) => {
        const phaseTopics = topics.filter((t) => t.phase === phase.num);
        if (phaseTopics.length === 0) return null;

        return (
          <section key={phase.num} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{phase.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phaseTopics.map((topic) => (
                <Link key={topic.id} href={`/learn/${topic.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {topic.category === 'data-structure' ? '자료구조' : '알고리즘'}
                        </Badge>
                        <Badge variant="secondary">{topic.difficulty === 'beginner' ? '입문' : topic.difficulty === 'intermediate' ? '기초' : '심화'}</Badge>
                      </div>
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        &quot;{topic.realLifeAnalogy}&quot;
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
