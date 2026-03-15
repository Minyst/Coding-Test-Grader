export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  code: string;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  problem_id: string;
  user_code: string;
  similarity_score: number;
  is_correct: boolean;
  created_at: string;
}

export const CATEGORIES = [
  "Hash",
  "LinkedList",
  "Stack",
  "Queue",
  "BFS",
  "DFS",
  "DP",
  "Heap",
  "Dijkstra",
  "Backtracking",
  "Tree",
  "Graph",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
