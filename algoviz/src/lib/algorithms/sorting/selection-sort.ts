import type { AlgorithmEngine, AnimationStep, VisualElement } from '@/types/visualizer';

export class SelectionSortEngine implements AlgorithmEngine<number[]> {
  name = '선택 정렬 (Selection Sort)';

  generateSteps(input: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({
      id: 0,
      description: `정렬할 배열: [${arr.join(', ')}]. 매번 최솟값을 찾아 앞으로 보냅니다.`,
      elements: this.createCells(arr, [], 'default'),
      highlights: [],
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        id: steps.length,
        description: `${i}번 위치부터 최솟값을 찾기 시작합니다.`,
        elements: this.createCells(arr, [i], 'active', i),
        highlights: [i],
        variables: { i, minIdx },
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          id: steps.length,
          description: `${arr[j]}과(와) 현재 최솟값 ${arr[minIdx]}을(를) 비교합니다.`,
          elements: this.createCells(arr, [minIdx, j], 'comparing', i),
          highlights: [minIdx, j],
          variables: { i, j, minIdx, '최솟값': arr[minIdx] },
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            id: steps.length,
            description: `새로운 최솟값 ${arr[minIdx]}을(를) 찾았습니다! (인덱스 ${minIdx})`,
            elements: this.createCells(arr, [minIdx], 'found', i),
            highlights: [minIdx],
            variables: { i, minIdx, '새 최솟값': arr[minIdx] },
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          id: steps.length,
          description: `${arr[i]}과(와) ${arr[minIdx]}을(를) 교환합니다.`,
          elements: this.createCells(arr, [i, minIdx], 'active', i),
          highlights: [i, minIdx],
          variables: { '교환': `[${i}] ↔ [${minIdx}]` },
        });
      }

      steps.push({
        id: steps.length,
        description: `${arr[i]}이(가) ${i}번 위치에 확정되었습니다.`,
        elements: this.createCells(arr, [], 'default', i + 1),
        highlights: [],
      });
    }

    steps.push({
      id: steps.length,
      description: `정렬 완료! [${arr.join(', ')}]`,
      elements: this.createCells(arr, [], 'sorted'),
      highlights: [],
    });

    return steps;
  }

  getPseudoCode(): string[] {
    return [
      'def selection_sort(arr):',
      '    for i in range(len(arr) - 1):',
      '        min_idx = i',
      '        for j in range(i + 1, len(arr)):',
      '            if arr[j] < arr[min_idx]:',
      '                min_idx = j',
      '        arr[i], arr[min_idx] = arr[min_idx], arr[i]',
      '    return arr',
    ];
  }

  private createCells(
    arr: number[],
    activeIndices: number[],
    activeStatus: VisualElement['status'],
    sortedBefore?: number
  ): VisualElement[] {
    return arr.map((val, i) => {
      let status: VisualElement['status'] = 'default';
      if (activeStatus === 'sorted') status = 'sorted';
      else if (sortedBefore !== undefined && i < sortedBefore) status = 'sorted';
      else if (activeIndices.includes(i)) status = activeStatus;

      return { id: `bar-${i}`, type: 'bar', value: val, x: i * 60 + 30, y: 0, status };
    });
  }
}
