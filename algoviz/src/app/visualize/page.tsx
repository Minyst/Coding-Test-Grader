import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const visualizers = [
  {
    id: 'bubble-sort',
    title: '버블 정렬',
    description: '인접한 두 원소를 비교하며 정렬하는 가장 기본적인 정렬 알고리즘',
    category: '정렬',
    difficulty: '입문',
  },
  {
    id: 'selection-sort',
    title: '선택 정렬',
    description: '매 단계마다 최솟값을 찾아 앞으로 보내는 정렬 알고리즘',
    category: '정렬',
    difficulty: '입문',
  },
  {
    id: 'insertion-sort',
    title: '삽입 정렬',
    description: '카드를 정리하듯 하나씩 올바른 위치에 삽입하는 정렬',
    category: '정렬',
    difficulty: '입문',
  },
  {
    id: 'binary-search',
    title: '이진 탐색',
    description: '정렬된 배열에서 반씩 줄여가며 빠르게 찾는 탐색 알고리즘',
    category: '탐색',
    difficulty: '기초',
  },
  {
    id: 'stack',
    title: '스택',
    description: '접시 쌓기처럼 마지막에 넣은 것을 먼저 꺼내는 LIFO 구조',
    category: '자료구조',
    difficulty: '입문',
  },
  {
    id: 'queue',
    title: '큐',
    description: '줄 서기처럼 먼저 넣은 것을 먼저 꺼내는 FIFO 구조',
    category: '자료구조',
    difficulty: '입문',
  },
];

export default function VisualizePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">시각화</h1>
      <p className="text-muted-foreground mb-8">
        자료구조와 알고리즘의 동작 과정을 애니메이션으로 직접 확인하세요.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visualizers.map((v) => (
          <Link key={v.id} href={`/visualize/${v.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{v.category}</Badge>
                  <Badge variant="secondary">{v.difficulty}</Badge>
                </div>
                <CardTitle className="text-lg">{v.title}</CardTitle>
                <CardDescription>{v.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
