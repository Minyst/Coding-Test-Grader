'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useVisualizerStore } from '@/store/visualizer-store';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { SortingVisualizer } from '@/components/visualizer/sorting-visualizer';
import { StackQueueVisualizer } from '@/components/visualizer/stack-queue-visualizer';
import { BubbleSortEngine } from '@/lib/algorithms/sorting/bubble-sort';
import { SelectionSortEngine } from '@/lib/algorithms/sorting/selection-sort';
import { InsertionSortEngine } from '@/lib/algorithms/sorting/insertion-sort';
import { BinarySearchEngine } from '@/lib/algorithms/search/binary-search';
import { StackEngine } from '@/lib/data-structures/stack';
import { QueueEngine } from '@/lib/data-structures/queue';
import type { AlgorithmEngine } from '@/types/visualizer';

type VisualizerType = 'sorting' | 'stack' | 'queue' | 'search';

interface EngineConfig {
  engine: AlgorithmEngine<unknown>;
  type: VisualizerType;
  defaultInput: string;
  inputLabel: string;
  inputPlaceholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseInput: (val: string) => any;
  randomize: () => string;
}

function makeSortConfig(engine: AlgorithmEngine<number[]>, defaultInput: string): EngineConfig {
  return {
    engine: engine as AlgorithmEngine<unknown>,
    type: 'sorting',
    defaultInput,
    inputLabel: '정렬할 숫자들',
    inputPlaceholder: '쉼표로 구분된 숫자',
    parseInput: (val: string) =>
      val.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)),
    randomize: () =>
      Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1).join(','),
  };
}

const configs: Record<string, EngineConfig> = {
  'bubble-sort': makeSortConfig(new BubbleSortEngine(), '5,3,8,1,9,2,7,4,6'),
  'selection-sort': makeSortConfig(new SelectionSortEngine(), '29,10,14,37,13'),
  'insertion-sort': makeSortConfig(new InsertionSortEngine(), '12,11,13,5,6'),
  'binary-search': {
    engine: new BinarySearchEngine() as AlgorithmEngine<unknown>,
    type: 'search',
    defaultInput: '2,5,8,12,16,23,38,45,56,72,91',
    inputLabel: '배열 (자동 정렬됨)',
    inputPlaceholder: '쉼표로 구분된 숫자',
    parseInput: (val: string) => {
      const parts = val.split('|');
      const arr = parts[0].split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      const target = parts.length > 1 ? parseInt(parts[1].trim(), 10) : arr[Math.floor(arr.length / 3)];
      return { arr, target };
    },
    randomize: () => {
      const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1).sort((a, b) => a - b);
      const target = arr[Math.floor(Math.random() * arr.length)];
      return `${arr.join(',')}|${target}`;
    },
  },
  stack: {
    engine: new StackEngine() as AlgorithmEngine<unknown>,
    type: 'stack',
    defaultInput: 'push 5, push 3, push 8, pop, push 1, pop, pop',
    inputLabel: '연산 순서',
    inputPlaceholder: 'push 숫자, pop (쉼표 구분)',
    parseInput: (val: string) =>
      val.split(',').map((s) => {
        const trimmed = s.trim().toLowerCase();
        if (trimmed === 'pop') return { type: 'pop' as const };
        const match = trimmed.match(/push\s+(\d+)/);
        return match ? { type: 'push' as const, value: parseInt(match[1], 10) } : null;
      }).filter(Boolean),
    randomize: () => {
      const ops: string[] = [];
      let size = 0;
      for (let i = 0; i < 8; i++) {
        if (size === 0 || Math.random() > 0.35) {
          ops.push(`push ${Math.floor(Math.random() * 30) + 1}`);
          size++;
        } else {
          ops.push('pop');
          size--;
        }
      }
      return ops.join(', ');
    },
  },
  queue: {
    engine: new QueueEngine() as AlgorithmEngine<unknown>,
    type: 'queue',
    defaultInput: 'enqueue 5, enqueue 3, enqueue 8, dequeue, enqueue 1, dequeue',
    inputLabel: '연산 순서',
    inputPlaceholder: 'enqueue 숫자, dequeue (쉼표 구분)',
    parseInput: (val: string) =>
      val.split(',').map((s) => {
        const trimmed = s.trim().toLowerCase();
        if (trimmed === 'dequeue') return { type: 'dequeue' as const };
        const match = trimmed.match(/enqueue\s+(\d+)/);
        return match ? { type: 'enqueue' as const, value: parseInt(match[1], 10) } : null;
      }).filter(Boolean),
    randomize: () => {
      const ops: string[] = [];
      let size = 0;
      for (let i = 0; i < 8; i++) {
        if (size === 0 || Math.random() > 0.35) {
          ops.push(`enqueue ${Math.floor(Math.random() * 30) + 1}`);
          size++;
        } else {
          ops.push('dequeue');
          size--;
        }
      }
      return ops.join(', ');
    },
  },
};

function VisualizerRenderer({ type }: { type: VisualizerType }) {
  switch (type) {
    case 'sorting':
    case 'search':
      return <SortingVisualizer />;
    case 'stack':
      return <StackQueueVisualizer mode="stack" />;
    case 'queue':
      return <StackQueueVisualizer mode="queue" />;
    default:
      return null;
  }
}

export default function VisualizerPage() {
  const params = useParams();
  const id = params.id as string;
  const config = configs[id];

  const [inputValue, setInputValue] = useState(config?.defaultInput ?? '');
  const [searchTarget, setSearchTarget] = useState('23');
  const setSteps = useVisualizerStore((s) => s.setSteps);
  const steps = useVisualizerStore((s) => s.steps);

  const handleGenerate = useCallback(() => {
    if (!config) return;
    let parsed;
    if (config.type === 'search') {
      const arr = inputValue.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      parsed = { arr, target: parseInt(searchTarget, 10) || arr[0] };
    } else {
      parsed = config.parseInput(inputValue);
    }
    if (!parsed || (Array.isArray(parsed) && parsed.length < 1)) return;
    const generatedSteps = config.engine.generateSteps(parsed);
    setSteps(generatedSteps);
  }, [config, inputValue, searchTarget, setSteps]);

  if (!config) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/visualize">
          <Button variant="ghost" size="sm" className="gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" /> 목록으로
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">준비 중입니다</h1>
        <p className="text-muted-foreground mt-2">이 시각화는 아직 개발 중이에요.</p>
      </div>
    );
  }

  const pseudoCode = config.engine.getPseudoCode();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/visualize">
        <Button variant="ghost" size="sm" className="gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> 목록으로
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-6">{config.engine.name}</h1>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* 사이드 패널 */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">{config.inputLabel}</h3>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={config.inputPlaceholder}
              className="mb-2"
            />
            {config.type === 'search' && (
              <Input
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                placeholder="찾을 값"
                className="mb-2"
              />
            )}
            <div className="flex gap-2">
              <Button onClick={handleGenerate} className="flex-1">
                실행
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const newVal = config.randomize();
                  setInputValue(newVal);
                  if (config.type === 'search') {
                    const parts = newVal.split('|');
                    if (parts[1]) setSearchTarget(parts[1]);
                    setInputValue(parts[0]);
                  }
                }}
              >
                랜덤
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">의사코드 (Python)</h3>
            <pre className="text-xs bg-muted rounded p-3 overflow-x-auto">
              {pseudoCode.map((line, i) => (
                <div key={i} className="leading-5">
                  <span className="text-muted-foreground mr-2 select-none">{i + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
          </Card>
        </div>

        {/* 메인 시각화 영역 */}
        <div className="flex flex-col gap-4">
          <Card className="p-4 min-h-[300px] flex items-center justify-center">
            {steps.length > 0 ? (
              <VisualizerRenderer type={config.type} />
            ) : (
              <p className="text-muted-foreground">
                &quot;실행&quot;을 눌러 시각화를 시작하세요.
              </p>
            )}
          </Card>
          <VisualizerControls />
        </div>
      </div>
    </div>
  );
}
