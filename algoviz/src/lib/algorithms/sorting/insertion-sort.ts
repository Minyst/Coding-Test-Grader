import type { AlgorithmEngine, AnimationStep, VisualElement } from '@/types/visualizer';

export class InsertionSortEngine implements AlgorithmEngine<number[]> {
  name = '삽입 정렬 (Insertion Sort)';

  generateSteps(input: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({
      id: 0,
      description: `정렬할 배열: [${arr.join(', ')}]. 카드를 정리하듯 하나씩 올바른 위치에 삽입합니다.`,
      elements: this.createCells(arr, [], 'default', 1),
      highlights: [],
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        id: steps.length,
        description: `${key}을(를) 정렬된 부분의 올바른 위치에 삽입합니다.`,
        elements: this.createCells(arr, [i], 'active', i),
        highlights: [i],
        variables: { key, i },
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          id: steps.length,
          description: `${arr[j]} > ${key}이므로 ${arr[j]}을(를) 오른쪽으로 한 칸 이동합니다.`,
          elements: this.createCells(arr, [j, j + 1], 'comparing', i),
          highlights: [j, j + 1],
          variables: { key, j, '비교': `${arr[j]} > ${key}` },
        });

        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;

      steps.push({
        id: steps.length,
        description: `${key}을(를) 인덱스 ${j + 1}에 삽입했습니다.`,
        elements: this.createCells(arr, [j + 1], 'found', i + 1),
        highlights: [j + 1],
        variables: { key, '삽입위치': j + 1 },
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
      'def insertion_sort(arr):',
      '    for i in range(1, len(arr)):',
      '        key = arr[i]',
      '        j = i - 1',
      '        while j >= 0 and arr[j] > key:',
      '            arr[j + 1] = arr[j]',
      '            j -= 1',
      '        arr[j + 1] = key',
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
