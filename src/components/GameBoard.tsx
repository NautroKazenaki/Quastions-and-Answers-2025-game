import type { Theme } from '@/types/game';
import { getPointsForRound } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameBoardProps {
  themes: Theme[];
  currentRound: 1 | 2 | 'super';
  onQuestionSelect: (themeIndex: number, questionIndex: number) => void;
  onStartSuperGame?: () => void;
  canStartSuperGame?: boolean;
}

export default function GameBoard({ 
  themes, 
  currentRound,
  onQuestionSelect,
  onStartSuperGame,
  canStartSuperGame,
}: GameBoardProps) {
  // Фильтруем темы по текущему раунду
  const currentThemes = currentRound === 'super' 
    ? [] 
    : themes.filter(t => t.round === currentRound);

  // Индикатор раунда
  const roundTitle = currentRound === 1 
    ? '🎄 РАУНД 1: Разминка (100-500 очков)'
    : currentRound === 2
    ? '⭐ РАУНД 2: Решающий (200-1000 очков)'
    : '🎁 СУПЕР ИГРА';

  const roundColor = currentRound === 1
    ? 'from-blue-600 to-blue-800'
    : currentRound === 2
    ? 'from-red-600 to-red-800'
    : 'from-purple-600 to-purple-800';

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-sm border-2 border-blue-400/30">
      {/* Индикатор раунда */}
      <div className={`mb-6 p-4 rounded-lg bg-gradient-to-r ${roundColor} text-white text-center`}>
        <h2 className="text-3xl font-bold">{roundTitle}</h2>
      </div>

      {canStartSuperGame && onStartSuperGame && (
        <div className="mb-6 text-center">
          <Button
            onClick={onStartSuperGame}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-2xl px-12 py-6 animate-pulse"
          >
            🎁 Начать Супер Игру! 🎁
          </Button>
        </div>
      )}

      <div className="grid grid-cols-6 gap-3">
        {/* Заголовок таблицы */}
        <div className="col-span-1 flex items-center justify-center">
          <div className="text-xl font-bold text-amber-400 text-center">
            ТЕМЫ
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className="flex items-center justify-center text-lg font-bold text-white"
          >
            Вопрос {num}
          </div>
        ))}

        {/* Строки с темами и вопросами */}
        {currentThemes.map((theme, displayIndex) => {
          // Находим оригинальный индекс темы в полном массиве
          const themeIndex = themes.findIndex(t => t.name === theme.name);
          const pointValues = getPointsForRound(theme.round);
          const isRound2 = theme.round === 2;
          
          return (
            <div key={displayIndex} className="col-span-6 grid grid-cols-6 gap-3">
              {/* Название темы */}
              <div
                className={`flex items-center justify-center p-4 rounded-lg font-bold text-center ${
                  isRound2
                    ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-2 border-red-400'
                    : 'bg-gradient-to-br from-blue-600 to-blue-800 text-white border-2 border-blue-400'
                }`}
              >
                {theme.name}
              </div>

              {/* Кнопки вопросов */}
              {theme.questions.map((question, questionIndex) => (
                <Button
                  key={question.id}
                  onClick={() => onQuestionSelect(themeIndex, questionIndex)}
                  disabled={question.answered}
                  className={`h-full min-h-[80px] text-2xl font-bold transition-all ${
                    question.answered
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      : isRound2
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg hover:shadow-orange-500/50 hover:scale-105'
                      : 'bg-gradient-to-br from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-blue-950 shadow-lg hover:shadow-yellow-500/50 hover:scale-105'
                  }`}
                  variant={question.answered ? 'ghost' : 'default'}
                >
                  {question.answered ? '✓' : pointValues[questionIndex]}
                </Button>
              ))}
            </div>
          );
        })}
      </div>

      {currentThemes.length === 0 && !canStartSuperGame && (
        <div className="text-center py-12 text-white text-2xl">
          <p>🎉 Раунд {currentRound} завершен! 🎉</p>
          <p className="text-lg mt-2">Подождите загрузки следующего раунда...</p>
        </div>
      )}
    </Card>
  );
}

