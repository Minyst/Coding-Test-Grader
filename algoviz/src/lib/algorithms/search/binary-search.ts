import type { AlgorithmEngine, AnimationStep, VisualElement } from '@/types/visualizer';

export interface BinarySearchInput {
  arr: number[];
  target: number;
}

export class BinarySearchEngine implements AlgorithmEngine<BinarySearchInput> {
  name = '이진 탐색 (Binary Search)';

  generateSteps(input: BinarySearchInput): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const { arr, target } = input;
    const sorted = [...arr].sort((a, b) => a - b);

    steps.push({
      id: 0,
      description: `정렬된 배열 [${sorted.join(', ')}]에서 ${target}을(를) 찾습니다.`,
      elements: this.createCells(sorted, [], 'default'),
      highlights: [],
      variables: { target },
    });

    let left = 0;
    let right = sorted.length - 1;
    let found = false;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        id: steps.length,
        description: `탐색 범위: [${left}~${right}], 중간 인덱스: ${mid}, 값: ${sorted[mid]}`,
        elements: this.createCells(sorted, [mid], 'comparing', left, right),
        highlights: [mid],
        variables: { left, right, mid, '중간값': sorted[mid], target },
      });

      if (sorted[mid] === target) {
        steps.push({
          id: steps.length,
          description: `${sorted[mid]} == ${target}! 찾았습니다! (인덱스 ${mid})`,
          elements: this.createCells(sorted, [mid], 'found'),
          highlights: [mid],
          variables: { '결과': `인덱스 ${mid}에서 발견` },
        });
        found = true;
        break;
      } else if (sorted[mid] < target) {
        steps.push({
          id: steps.length,
          description: `${sorted[mid]} < ${target}이므로 왼쪽 절반을 버리고 오른쪽을 탐색합니다.`,
          elements: this.createCells(sorted, [], 'default', mid + 1, right),
          highlights: [],
          variables: { '방향': '오른쪽', left: mid + 1, right },
        });
        left = mid + 1;
      } else {
        steps.push({
          id: steps.length,
          description: `${sorted[mid]} > ${target}이므로 오른쪽 절반을 버리고 왼쪽을 탐색합니다.`,
          elements: this.createCells(sorted, [], 'default', left, mid - 1),
          highlights: [],
          variables: { '방향': '왼쪽', left, right: mid - 1 },
        });
        right = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        id: steps.length,
        description: `${target}을(를) 배열에서 찾을 수 없습니다.`,
        elements: this.createCells(sorted, [], 'default'),
        highlights: [],
        variables: { '결과': '찾을 수 없음' },
      });
    }

    return steps;
  }

  getPseudoCode(): string[] {
    return [
      'def binary_search(arr, target):',
      '    left, right = 0, len(arr) - 1',
      '    while left <= right:',
      '        mid = (left + right) // 2',
      '        if arr[mid] == target:',
      '            return mid',
      '        elif arr[mid] < target:',
      '            left = mid + 1',
      '        else:',
      '            right = mid - 1',
      '    return -1',
    ];
  }

  private createCells(
    arr: number[],
    activeIndices: number[],
    activeStatus: VisualElement['status'],
    rangeStart?: number,
    rangeEnd?: number
  ): VisualElement[] {
    return arr.map((val, i) => {
      let status: VisualElement['status'] = 'default';
      if (activeStatus === 'found' && activeIndices.includes(i)) status = 'found';
      else if (activeIndices.includes(i)) status = activeStatus;
      else if (rangeStart !== undefined && rangeEnd !== undefined) {
        if (i < rangeStart || i > rangeEnd) status = 'visited';
      }

      return { id: `bar-${i}`, type: 'bar' as const, value: val, x: i * 60 + 30, y: 0, status };
    });
  }
}
