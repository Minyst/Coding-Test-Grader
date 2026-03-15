import Link from "next/link";
import { BookOpen, Eye, Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "개념 학습",
    description: "실생활 비유와 그림으로 자료구조/알고리즘을 쉽게 이해하세요",
    href: "/learn",
    color: "text-blue-500",
  },
  {
    icon: Eye,
    title: "시각화",
    description: "동작 과정을 애니메이션으로 직접 눈으로 확인하세요",
    href: "/visualize",
    color: "text-green-500",
  },
  {
    icon: Code2,
    title: "문제 풀이",
    description: "단계별 문제를 Python으로 풀고 실시간으로 채점받으세요",
    href: "/practice",
    color: "text-purple-500",
  },
];

const roadmap = [
  { phase: 1, title: "기초 자료구조", topics: "배열, 연결리스트, 스택, 큐, 해시테이블" },
  { phase: 2, title: "트리 & 그래프", topics: "이진트리, BST, 힙, 그래프" },
  { phase: 3, title: "핵심 알고리즘", topics: "정렬, 이진탐색, BFS/DFS, 재귀" },
  { phase: 4, title: "심화 알고리즘", topics: "DP, 그리디, 최단경로" },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          보면 <span className="text-primary">이해</span>된다
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          비전공자도 코딩테스트를 통과할 수 있도록,
          <br />
          자료구조와 알고리즘을 <strong>시각화</strong>로 쉽게 배우세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/learn">
            <Button size="lg" className="gap-2">
              학습 시작하기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/visualize">
            <Button size="lg" variant="outline">
              시각화 체험하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Icon className={`h-10 w-10 mb-2 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Roadmap */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">학습 로드맵</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {roadmap.map((item) => (
            <Card key={item.phase} className="relative">
              <CardHeader>
                <div className="text-sm font-medium text-primary mb-1">
                  Phase {item.phase}
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.topics}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-2">지금 바로 시작하세요</h2>
        <p className="text-muted-foreground mb-4">
          회원가입 없이도 학습과 시각화를 이용할 수 있어요.
        </p>
        <Link href="/learn">
          <Button size="lg">무료로 시작하기</Button>
        </Link>
      </section>
    </div>
  );
}
