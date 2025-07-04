// --- Series Types ---
export type Series = {
  id: string;
  title: string;
  genre?: string;
  language?: string;
  createdAt: string;
};

// --- Chapter Types ---
export type Chapter = {
  id: string;
  seriesId: string;
  number: number;
  title?: string;
  sourceFile?: string;
  private?: boolean;
  difficulty?: string;
  unlocked: boolean;
  createdAt: string;
};

// --- Card Types ---
export type Card = {
  id: string;
  chapterId: string;
  word: string;
  definition: string;
  romanization?: string;
  example?: string;
  createdAt: string;
};

// --- User Types ---
export type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  guest?: boolean;
  createdAt: string;
};

// --- Deck Types ---
export type Deck = {
  id: string;
  title: string;
  genre?: string;
  difficulty?: string;
  status?: string;
  featured?: string[];
  createdAt: string;
};

// --- Common API Response Types ---
export type ApiResponse<T> = {
  data: T;
  error?: string;
}; 