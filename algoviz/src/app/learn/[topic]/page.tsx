import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { topics } from '@/content/topics/topic-list';

interface PageProps {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.id }));
}

export default async function TopicPage({ params }: PageProps) {
  const { topic: topicId } = await params;
  const topic = topics.find((t) => t.id === topicId);

  if (!topic) notFound();

  const prereqs = topics.filter((t) => topic.prerequisites.includes(t.id));

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/learn">
        <Button variant="ghost" size="sm" className="gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> 목록으로
        </Button>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline">
          {topic.category === 'data-structure' ? '자료구조' : '알고리즘'}
        </Badge>
        <Badge variant="secondary">
          Phase {topic.phase}
        </Badge>
      </div>

      <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
      <p className="text-lg text-muted-foreground mb-6">{topic.description}</p>

      {/* 실생활 비유 */}
      <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
        <h2 className="font-semibold mb-2">실생활로 이해하기</h2>
        <p className="text-muted-foreground italic">
          &quot;{topic.realLifeAnalogy}&quot;
        </p>
      </Card>

      {/* 콘텐츠 플레이스홀더 */}
      <section className="prose dark:prose-invert max-w-none mb-8">
        <h2>개념 설명</h2>
        <p className="text-muted-foreground">
          이 토픽의 상세 학습 콘텐츠가 곧 추가됩니다. 아래 시각화와 문제풀이를 먼저 체험해보세요.
        </p>
      </section>

      <Separator className="my-6" />

      {/* 선수 토픽 */}
      {prereqs.length > 0 && (
        <section className="mb-6">
          <h3 className="font-semibold mb-2">선수 학습</h3>
          <div className="flex gap-2 flex-wrap">
            {prereqs.map((p) => (
              <Link key={p.id} href={`/learn/${p.id}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  {p.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 관련 링크 */}
      <section className="flex gap-3 mt-6">
        <Link href={`/visualize/${topicId === 'sorting' ? 'bubble-sort' : topicId}`}>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" /> 시각화로 보기
          </Button>
        </Link>
        <Link href="/practice">
          <Button variant="outline" className="gap-2">
            <Code2 className="h-4 w-4" /> 문제 풀기
          </Button>
        </Link>
      </section>
    </div>
  );
}
