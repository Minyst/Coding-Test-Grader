export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  streak_days: number;
  last_active_date: string;
  created_at: string;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  is_correct: boolean;
  passed_tests: number;
  total_tests: number;
  execution_time_ms: number;
  submitted_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  target_type: 'topic' | 'problem';
  target_id: string;
  created_at: string;
}

export interface UserStats {
  totalSolved: number;
  solvedByDifficulty: Record<number, number>;
  streakDays: number;
  totalTopicsCompleted: number;
}

export interface RankingEntry {
  id: string;
  username: string;
  avatar_url?: string;
  streak_days: number;
  solved_count: number;
  rank: number;
}
