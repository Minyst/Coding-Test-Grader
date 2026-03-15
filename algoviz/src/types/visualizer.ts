export interface AnimationStep {
  id: number;
  description: string;
  elements: VisualElement[];
  highlights: number[];
  codeLineHighlight?: number;
  variables?: Record<string, unknown>;
}

export interface VisualElement {
  id: string;
  type: 'node' | 'edge' | 'bar' | 'cell' | 'pointer';
  value: string | number;
  x: number;
  y: number;
  status: ElementStatus;
  connections?: string[];
}

export type ElementStatus =
  | 'default'
  | 'active'
  | 'comparing'
  | 'sorted'
  | 'found'
  | 'visited';

export interface AlgorithmEngine<TInput = unknown> {
  name: string;
  generateSteps(input: TInput): AnimationStep[];
  getPseudoCode(): string[];
}
