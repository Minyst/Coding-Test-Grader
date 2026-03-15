import type { AlgorithmEngine, AnimationStep, VisualElement } from '@/types/visualizer';

export type QueueOperation = { type: 'enqueue'; value: number } | { type: 'dequeue' };

export class QueueEngine implements AlgorithmEngine<QueueOperation[]> {
  name = '큐 (Queue)';

  generateSteps(operations: QueueOperation[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const queue: number[] = [];

    steps.push({
      id: 0,
      description: '빈 큐입니다. Enqueue로 넣고 Dequeue로 꺼냅니다. (FIFO: 선입선출)',
      elements: [],
      highlights: [],
    });

    for (const op of operations) {
      if (op.type === 'enqueue') {
        queue.push(op.value);
        steps.push({
          id: steps.length,
          description: `Enqueue(${op.value}): ${op.value}을(를) 큐 뒤쪽에 추가합니다.`,
          elements: this.createCells(queue, [queue.length - 1], 'active'),
          highlights: [queue.length - 1],
          variables: { '크기': queue.length, 'front': queue[0], 'rear': op.value },
        });
      } else if (op.type === 'dequeue' && queue.length > 0) {
        const val = queue[0];
        steps.push({
          id: steps.length,
          description: `Dequeue(): 맨 앞의 ${val}을(를) 꺼냅니다.`,
          elements: this.createCells(queue, [0], 'comparing'),
          highlights: [0],
          variables: { '꺼낸 값': val, '크기': queue.length - 1 },
        });
        queue.shift();
        steps.push({
          id: steps.length,
          description: `${val}이(가) 제거되었습니다. 현재 크기: ${queue.length}`,
          elements: this.createCells(queue, queue.length > 0 ? [0] : [], 'default'),
          highlights: [],
          variables: { '크기': queue.length, 'front': queue.length > 0 ? queue[0] : '비어있음' },
        });
      } else if (op.type === 'dequeue') {
        steps.push({
          id: steps.length,
          description: 'Dequeue 실패! 큐가 비어있습니다.',
          elements: [],
          highlights: [],
          variables: { '에러': 'Queue Empty' },
        });
      }
    }

    return steps;
  }

  getPseudoCode(): string[] {
    return [
      'class Queue:',
      '    def __init__(self):',
      '        self.items = []',
      '',
      '    def enqueue(self, item):',
      '        self.items.append(item)',
      '',
      '    def dequeue(self):',
      '        if self.is_empty():',
      '            raise Error("Queue Empty")',
      '        return self.items.pop(0)',
      '',
      '    def is_empty(self):',
      '        return len(self.items) == 0',
    ];
  }

  private createCells(
    queue: number[],
    activeIndices: number[],
    activeStatus: VisualElement['status']
  ): VisualElement[] {
    return queue.map((val, i) => ({
      id: `cell-${i}`,
      type: 'cell' as const,
      value: val,
      x: i,
      y: 0,
      status: activeIndices.includes(i) ? activeStatus : 'default',
    }));
  }
}
