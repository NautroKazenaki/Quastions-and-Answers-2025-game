import { useState, useEffect } from 'react';
import type { GameState, Player, Theme, SuperGameState, Answer, QuestionsData } from '@/types/game';
import { getPointsForRound } from '@/types/game';
import questionsData from '@/data/questions.json';
import GameBoard from '@/components/GameBoard';
import PlayersPanel from '@/components/PlayersPanel';
import QuestionView from '@/components/QuestionView';
import SuperGame from '@/components/SuperGame';
import SnowfallBackground from '@/components/SnowfallBackground';
import CatInBagModal from '@/components/CatInBagModal';

const STORAGE_KEY = 'new-year-quiz-state';

const initialPlayers: Player[] = [
  { id: 1, name: 'Даша', score: 0 },
  { id: 2, name: 'Настя', score: 0 },
  { id: 3, name: 'Ира', score: 0 },
  { id: 4, name: 'Артём', score: 0 },
  { id: 5, name: 'Максим', score: 0 },
];

function markRandomCatsInBag(themes: Theme[], count: number) {
  const allQuestions = themes.flatMap(theme => 
    theme.questions.map(q => ({ theme, question: q }))
  );
  
  // Перемешать и выбрать count случайных
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  shuffled.slice(0, count).forEach(({ question }) => {
    question.isCatInBag = true;
  });
}

function initializeThemes(): Theme[] {
  const data = questionsData as QuestionsData;
  const themes = data.themes.map((themeData) => ({
    name: themeData.name,
    round: themeData.round,
    questions: themeData.questions.map((questionData, index) => {
      const media = questionData.media 
        ? {
            type: questionData.media.type as 'image' | 'video' | null,
            src: questionData.media.src as string | null
          }
        : undefined;

      // answer теперь всегда есть - или строка, или объект
      let answer: string | Answer;
      if (typeof questionData.answer === 'string') {
        answer = questionData.answer;
      } else {
        const answerMedia = questionData.answer?.media
          ? {
              type: questionData.answer.media.type as 'image' | 'video' | null,
              src: questionData.answer.media.src as string | null
            }
          : undefined;
        answer = {
          text: questionData.answer.text,
          media: answerMedia
        };
      }

      return {
        id: `${themeData.name}-${index}`,
        text: questionData.text,
        answered: false,
        isCatInBag: false,
        media,
        answer,
      };
    }),
  }));

  // Отметить 2 случайных вопроса в раунде 1
  markRandomCatsInBag(themes.filter(t => t.round === 1), 2);
  
  // Отметить 2 случайных вопроса в раунде 2
  markRandomCatsInBag(themes.filter(t => t.round === 2), 2);

  return themes;
}

function loadGameState(): GameState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Если не удалось распарсить, создаём новое состояние
    }
  }
  
  return {
    themes: initializeThemes(),
    players: initialPlayers,
    activePlayerId: null,
    currentQuestion: null,
    timerSeconds: 15,
    timerActive: false,
    currentRound: 1,
    superGameState: null,
    catInBagState: null,
  };
}

function App() {
  const [gameState, setGameState] = useState<GameState>(loadGameState);

  // Сохранение состояния в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Проверка завершения раунда и автоматическое переключение
  useEffect(() => {
    if (gameState.currentRound === 1) {
      const round1Complete = gameState.themes
        .filter(t => t.round === 1)
        .every(theme => theme.questions.every(q => q.answered));
      
      if (round1Complete && !gameState.currentQuestion) {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentRound: 2,
          }));
        }, 500);
      }
    } else if (gameState.currentRound === 2) {
      // Не переключаем автоматически на супер игру, только показываем кнопку
    }
  }, [gameState.themes, gameState.currentQuestion, gameState.currentRound]);

  const handlePlayerSelect = (playerId: number) => {
    setGameState(prev => ({
      ...prev,
      activePlayerId: playerId,
    }));
  };

  const handleQuestionSelect = (themeIndex: number, questionIndex: number) => {
    const theme = gameState.themes[themeIndex];
    const question = theme.questions[questionIndex];
    
    if (question.answered) return;
    
    const pointValues = getPointsForRound(theme.round);
    const pointValue = pointValues[questionIndex];

    // Проверка на Кота в мешке
    if (question.isCatInBag) {
      setGameState(prev => ({
        ...prev,
        catInBagState: {
          isActive: true,
          originalPlayerId: prev.activePlayerId,
          selectedPlayerId: null,
          themeIndex,
          questionIndex,
          pointValue,
        },
      }));
      // Показать модалку выбора игрока, не открывать вопрос пока
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentQuestion: {
        themeIndex,
        questionIndex,
        pointValue,
      },
      timerSeconds: 15,
      timerActive: false,
    }));
  };

  const handleCatPlayerSelect = (playerId: number) => {
    if (!gameState.catInBagState) return;

    const { themeIndex, questionIndex, pointValue } = gameState.catInBagState;
    if (themeIndex === null || questionIndex === null || pointValue === null) return;

    // Установить выбранного игрока как активного и открыть вопрос
    setGameState(prev => ({
      ...prev,
      activePlayerId: playerId,
      catInBagState: {
        ...prev.catInBagState!,
        selectedPlayerId: playerId,
      },
      currentQuestion: {
        themeIndex,
        questionIndex,
        pointValue,
      },
      timerSeconds: 15,
      timerActive: false,
    }));
  };

  const handleStartTimer = () => {
    setGameState(prev => ({
      ...prev,
      timerActive: true,
    }));
  };

  const handleStopTimer = () => {
    setGameState(prev => ({
      ...prev,
      timerActive: false,
    }));
  };

  const handleAwardPoints = (playerId: number, points: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId
          ? { ...player, score: player.score + points }
          : player
      ),
    }));
  };

  const handleDeductPoints = (playerId: number, points: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId
          ? { ...player, score: player.score - points }
          : player
      ),
    }));
  };

  const handleCloseQuestion = () => {
    if (gameState.currentQuestion) {
      const { themeIndex, questionIndex } = gameState.currentQuestion;
      
      setGameState(prev => ({
        ...prev,
        themes: prev.themes.map((theme, tIndex) =>
          tIndex === themeIndex
            ? {
                ...theme,
                questions: theme.questions.map((q, qIndex) =>
                  qIndex === questionIndex ? { ...q, answered: true } : q
                ),
              }
            : theme
        ),
        currentQuestion: null,
        timerActive: false,
        timerSeconds: 15,
        catInBagState: null, // Сбросить состояние Кота в мешке
      }));
    }
  };

  const handleResetGame = () => {
    if (confirm('Вы уверены, что хотите начать игру заново? Все данные будут удалены.')) {
      const newState: GameState = {
        themes: initializeThemes(),
        players: initialPlayers,
        activePlayerId: null,
        currentQuestion: null,
        timerSeconds: 15,
        timerActive: false,
        currentRound: 1,
        superGameState: null,
        catInBagState: null,
      };
      setGameState(newState);
    }
  };

  const handleStartSuperGame = () => {
    const eligiblePlayers = gameState.players.filter(p => p.score > 0);
    if (eligiblePlayers.length === 0) {
      alert('Нет игроков с положительными очками для участия в супер игре!');
      return;
    }

    // Преобразуем темы супер игры с правильными типами
    const data = questionsData as QuestionsData;
    const superGameThemes = data.superGame.themes.map((theme) => {
      const media = theme.media 
        ? {
            type: theme.media.type as 'image' | 'video' | null,
            src: theme.media.src as string | null
          }
        : undefined;

      // answer теперь всегда есть - или строка, или объект
      let answer: string | Answer;
      if (typeof theme.answer === 'string') {
        answer = theme.answer;
      } else {
        const answerMedia = theme.answer?.media
          ? {
              type: theme.answer.media.type as 'image' | 'video' | null,
              src: theme.answer.media.src as string | null
            }
          : undefined;
        answer = {
          text: theme.answer.text,
          media: answerMedia
        };
      }

      return {
        name: theme.name,
        question: theme.question,
        media,
        answer,
      };
    });

    setGameState(prev => ({
      ...prev,
      currentRound: 'super',
      superGameState: {
        phase: 'elimination',
        themes: superGameThemes,
        eliminatedThemes: [],
        selectedTheme: null,
        bets: {},
        answers: {},
        currentPlayerIndex: 0,
      },
    }));
  };

  const isRound2Complete = () => {
    return gameState.themes
      .filter(t => t.round === 2)
      .every(theme => theme.questions.every(q => q.answered));
  };

  const handleUpdateSuperGame = (updates: Partial<SuperGameState>) => {
    setGameState(prev => ({
      ...prev,
      superGameState: prev.superGameState ? {
        ...prev.superGameState,
        ...updates,
      } : null,
    }));
  };

  const handleCompleteSuperGame = () => {
    if (!gameState.superGameState) return;

    // Применяем результаты ставок к очкам игроков
    const updatedPlayers = gameState.players.map(player => {
      const bet = gameState.superGameState?.bets[player.id];
      const answer = gameState.superGameState?.answers[player.id];
      
      if (bet !== undefined && answer !== null && answer !== undefined) {
        return {
          ...player,
          score: answer ? player.score + bet : player.score - bet,
        };
      }
      return player;
    });

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      superGameState: null,
    }));
  };

  // Таймер
  useEffect(() => {
    if (gameState.timerActive && gameState.timerSeconds > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timerSeconds: prev.timerSeconds - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timerSeconds === 0) {
      setGameState(prev => ({
        ...prev,
        timerActive: false,
      }));
    }
  }, [gameState.timerActive, gameState.timerSeconds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-4 relative">
      <SnowfallBackground />
      
      {/* Модалка Кота в мешке */}
      {gameState.catInBagState?.isActive && 
       !gameState.currentQuestion && 
       gameState.catInBagState.pointValue !== null && (
        <CatInBagModal
          players={gameState.players}
          currentPlayerId={gameState.catInBagState.originalPlayerId}
          pointValue={gameState.catInBagState.pointValue}
          onSelectPlayer={handleCatPlayerSelect}
        />
      )}
      
      <div className="max-w-[1800px] mx-auto relative z-10">
        {gameState.currentRound === 'super' && gameState.superGameState ? (
          <SuperGame
            superGameState={gameState.superGameState}
            players={gameState.players}
            onUpdateSuperGame={handleUpdateSuperGame}
            onComplete={handleCompleteSuperGame}
          />
        ) : !gameState.currentQuestion ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
                <span className="animate-twinkle inline-block">⭐</span>
                {' '}🎄 Новогодняя викторина 2025 🎄{' '}
                <span className="animate-twinkle inline-block" style={{ animationDelay: '1s' }}>⭐</span>
              </h1>
              <button
                onClick={handleResetGame}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all shadow-lg hover:shadow-red-500/50"
              >
                🔄 Сбросить игру
              </button>
            </div>
            
            <GameBoard
              themes={gameState.themes}
              currentRound={gameState.currentRound}
              onQuestionSelect={handleQuestionSelect}
              onStartSuperGame={handleStartSuperGame}
              canStartSuperGame={gameState.currentRound === 2 && isRound2Complete()}
            />
            
            <PlayersPanel
              players={gameState.players}
              activePlayerId={gameState.activePlayerId}
              onPlayerSelect={handlePlayerSelect}
            />
          </div>
        ) : (
          <QuestionView
            question={
              gameState.themes[gameState.currentQuestion.themeIndex].questions[
                gameState.currentQuestion.questionIndex
              ]
            }
            pointValue={gameState.currentQuestion.pointValue}
            players={gameState.players}
            activePlayerId={gameState.activePlayerId}
            timerSeconds={gameState.timerSeconds}
            timerActive={gameState.timerActive}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            onAwardPoints={handleAwardPoints}
            onDeductPoints={handleDeductPoints}
            onClose={handleCloseQuestion}
            onPlayerSelect={handlePlayerSelect}
            catInBagState={gameState.catInBagState}
          />
        )}
      </div>
    </div>
  );
}

export default App;
