import type { AlgorithmEngine, AnimationStep, VisualElement } from '@/types/visualizer';

export type StackOperation = { type: 'push'; value: number } | { type: 'pop' };

export class StackEngine implements AlgorithmEngine<StackOperation[]> {
  name = '스택 (Stack)';

  generateSteps(operations: StackOperation[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const stack: number[] = [];

    steps.push({
      id: 0,
      description: '빈 스택입니다. Push로 넣고 Pop으로 꺼냅니다. (LIFO: 후입선출)',
      elements: [],
      highlights: [],
    });

    for (const op of operations) {
      if (op.type === 'push') {
        stack.push(op.value);
        steps.push({
          id: steps.length,
          description: `Push(${op.value}): ${op.value}을(를) 스택 맨 위에 넣습니다.`,
          elements: this.createCells(stack, [stack.length - 1], 'active'),
          highlights: [stack.length - 1],
          variables: { '크기': stack.length, 'top': op.value },
        });
      } else if (op.type === 'pop' && stack.length > 0) {
        const val = stack[stack.length - 1];
        steps.push({
          id: steps.length,
          description: `Pop(): 맨 위의 ${val}을(를) 꺼냅니다.`,
          elements: this.createCells(stack, [stack.length - 1], 'comparing'),
          highlights: [stack.length - 1],
          variables: { '꺼낸 값': val, '크기': stack.length - 1 },
        });
        stack.pop();
        steps.push({
          id: steps.length,
          description: `${val}이(가) 제거되었습니다. 현재 크기: ${stack.length}`,
          elements: this.createCells(stack, stack.length > 0 ? [stack.length - 1] : [], 'default'),
          highlights: [],
          variables: { '크기': stack.length, 'top': stack.length > 0 ? stack[stack.length - 1] : '비어있음' },
        });
      } else if (op.type === 'pop') {
        steps.push({
          id: steps.length,
          description: 'Pop 실패! 스택이 비어있습니다. (Stack Underflow)',
          elements: [],
          highlights: [],
          variables: { '에러': 'Stack Underflow' },
        });
      }
    }

    return steps;
  }

  getPseudoCode(): string[] {
    return [
      'class Stack:',
      '    def __init__(self):',
      '        self.items = []',
      '',
      '    def push(self, item):',
      '        self.items.append(item)',
      '',
      '    def pop(self):',
      '        if self.is_empty():',
      '            raise Error("Stack Underflow")',
      '        return self.items.pop()',
      '',
      '    def is_empty(self):',
      '        return len(self.items) == 0',
    ];
  }

  private createCells(
    stack: number[],
    activeIndices: number[],
    activeStatus: VisualElement['status']
  ): VisualElement[] {
    return stack.map((val, i) => ({
      id: `cell-${i}`,
      type: 'cell' as const,
      value: val,
      x: 0,
      y: i,
      status: activeIndices.includes(i) ? activeStatus : 'default',
    }));
  }
}
