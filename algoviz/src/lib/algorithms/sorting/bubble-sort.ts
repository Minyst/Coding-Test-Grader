import type { AlgorithmEngine, AnimationStep, VisualElement } from '@/types/visualizer';

export class BubbleSortEngine implements AlgorithmEngine<number[]> {
  name = '버블 정렬 (Bubble Sort)';

  generateSteps(input: number[]): AnimationStep[] {
    const steps: AnimationStep[] = [];
    const arr = [...input];
    const n = arr.length;

    // 초기 상태
    steps.push({
      id: 0,
      description: `정렬할 배열: [${arr.join(', ')}]. 인접한 두 원소를 비교하며 정렬합니다.`,
      elements: this.createBarElements(arr, [], 'default'),
      highlights: [],
      codeLineHighlight: 0,
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // 비교
        steps.push({
          id: steps.length,
          description: `${arr[j]}과(와) ${arr[j + 1]}을(를) 비교합니다.`,
          elements: this.createBarElements(arr, [j, j + 1], 'comparing'),
          highlights: [j, j + 1],
          codeLineHighlight: 3,
          variables: { i, j, '비교': `${arr[j]} vs ${arr[j + 1]}` },
        });

        if (arr[j] > arr[j + 1]) {
          // 교환
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            id: steps.length,
            description: `${arr[j + 1]} > ${arr[j]}이므로 교환합니다.`,
            elements: this.createBarElements(arr, [j, j + 1], 'active'),
            highlights: [j, j + 1],
            codeLineHighlight: 4,
            variables: { i, j, '교환': `${arr[j]} ↔ ${arr[j + 1]}` },
          });
        }
      }
      // 한 패스 완료 — 마지막 원소 정렬됨
      steps.push({
        id: steps.length,
        description: `${i + 1}번째 패스 완료. ${arr[n - i - 1]}이(가) 제자리를 찾았습니다.`,
        elements: this.createBarElements(arr, [], 'default', n - i - 1),
        highlights: [],
        codeLineHighlight: 1,
        variables: { '패스': i + 1, '정렬완료': arr[n - i - 1] },
      });
    }

    // 최종 상태
    steps.push({
      id: steps.length,
      description: `정렬 완료! [${arr.join(', ')}]`,
      elements: this.createBarElements(arr, [], 'sorted'),
      highlights: [],
      codeLineHighlight: 6,
    });

    return steps;
  }

  getPseudoCode(): string[] {
    return [
      'def bubble_sort(arr):',
      '    for i in range(len(arr) - 1):',
      '        for j in range(len(arr) - i - 1):',
      '            if arr[j] > arr[j + 1]:',
      '                arr[j], arr[j+1] = arr[j+1], arr[j]',
      '    return arr',
    ];
  }

  private createBarElements(
    arr: number[],
    activeIndices: number[],
    activeStatus: VisualElement['status'],
    sortedFrom?: number
  ): VisualElement[] {
    const maxVal = Math.max(...arr, 1);
    return arr.map((val, i) => {
      let status: VisualElement['status'] = 'default';
      if (activeStatus === 'sorted') {
        status = 'sorted';
      } else if (sortedFrom !== undefined && i >= sortedFrom) {
        status = 'sorted';
      } else if (activeIndices.includes(i)) {
        status = activeStatus;
      }

      return {
        id: `bar-${i}`,
        type: 'bar' as const,
        value: val,
        x: i * 60 + 30,
        y: 200 - (val / maxVal) * 180,
        status,
      };
    });
  }
}
