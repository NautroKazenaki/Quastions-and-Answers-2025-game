export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface MediaContent {
  type: 'image' | 'video' | null;
  src: string | null;
}

export interface Answer {
  text: string;
  media?: MediaContent;
}

export interface Question {
  id: string;
  text: string;
  answered: boolean;
  isCatInBag?: boolean;
  media?: MediaContent;
  answer: string | Answer; // Обязательное поле, может быть строкой или объектом
}

export interface Theme {
  name: string;
  round: number; // 1 для первого раунда (100-500), 2 для второго (200-1000)
  questions: Question[];
}

export interface CurrentQuestion {
  themeIndex: number;
  questionIndex: number;
  pointValue: number;
}

export interface CatInBagState {
  isActive: boolean;
  originalPlayerId: number | null;
  selectedPlayerId: number | null;
  themeIndex: number | null;
  questionIndex: number | null;
  pointValue: number | null;
}

export interface GameState {
  themes: Theme[];
  players: Player[];
  activePlayerId: number | null;
  currentQuestion: CurrentQuestion | null;
  timerSeconds: number;
  timerActive: boolean;
  currentRound: 1 | 2 | 'super';
  superGameState: SuperGameState | null;
  catInBagState: CatInBagState | null;
}

export interface ThemeData {
  name: string;
  round: number;
  questions: QuestionData[]; // Теперь только объекты
}

export interface QuestionData {
  text: string;
  media?: MediaContent;
  answer: string | Answer; // Обязательное поле
}

export interface SuperGameTheme {
  name: string;
  question: string;
  media?: MediaContent;
  answer: string | Answer; // Обязательное поле
}

export interface SuperGameData {
  themes: SuperGameTheme[];
}

export interface QuestionsData {
  themes: ThemeData[];
  superGame: SuperGameData;
}

export interface SuperGameState {
  phase: 'elimination' | 'betting' | 'answering' | 'completed';
  themes: SuperGameTheme[];
  eliminatedThemes: string[];
  selectedTheme: SuperGameTheme | null;
  bets: Record<number, number>; // playerId -> bet amount
  answers: Record<number, boolean | null>; // playerId -> correct/incorrect/null
  currentPlayerIndex: number;
}

// Константы для очков
export const ROUND_1_POINTS = [100, 200, 300, 400, 500];
export const ROUND_2_POINTS = [200, 400, 600, 800, 1000];

export const getPointsForRound = (round: number): number[] => {
  return round === 1 ? ROUND_1_POINTS : ROUND_2_POINTS;
};

