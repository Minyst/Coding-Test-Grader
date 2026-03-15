export interface Topic {
  id: string;
  title: string;
  category: 'data-structure' | 'algorithm';
  phase: 1 | 2 | 3 | 4;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  realLifeAnalogy: string;
  prerequisites: string[];
  icon: string;
}

export interface TopicContent {
  topicId: string;
  sections: ContentSection[];
  keyPoints: string[];
  complexityTable: ComplexityInfo;
  relatedProblems: string[];
}

export interface ContentSection {
  title: string;
  type: 'text' | 'diagram' | 'code' | 'analogy' | 'quiz';
  content: string;
}

export interface ComplexityInfo {
  access?: string;
  search?: string;
  insert?: string;
  delete?: string;
  space?: string;
  best?: string;
  average?: string;
  worst?: string;
}
