import type { Player, Question } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, X, Plus, Minus } from 'lucide-react';

interface QuestionViewProps {
  question: Question;
  pointValue: number;
  players: Player[];
  activePlayerId: number | null;
  timerSeconds: number;
  timerActive: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onAwardPoints: (playerId: number, points: number) => void;
  onDeductPoints: (playerId: number, points: number) => void;
  onClose: () => void;
  onPlayerSelect: (playerId: number) => void;
}

export default function QuestionView({
  question,
  pointValue,
  players,
  activePlayerId,
  timerSeconds,
  timerActive,
  onStartTimer,
  onStopTimer,
  onAwardPoints,
  onDeductPoints,
  onClose,
  onPlayerSelect,
}: QuestionViewProps) {
  const timerPercentage = (timerSeconds / 15) * 100;
  const timerColor =
    timerSeconds > 10
      ? 'bg-green-500'
      : timerSeconds > 5
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-5xl bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-sm border-4 border-blue-400/50">
        <CardContent className="p-8">
          {/* Заголовок с закрытием */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-3xl font-bold text-amber-400">
              ❄️ Вопрос за {pointValue} очков ❄️
            </div>
            <Button
              onClick={onClose}
              variant="destructive"
              size="lg"
              className="gap-2"
            >
              <X className="w-5 h-5" />
              ❌ Закрыть вопрос
            </Button>
          </div>

          {/* Текст вопроса */}
          <div className="bg-white/10 rounded-xl p-8 mb-8 border-2 border-blue-300/30">
            <p className="text-3xl text-white text-center leading-relaxed">
              {question.text}
            </p>
          </div>

          {/* Таймер */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Timer className="w-8 h-8 text-white" />
              <div className="text-6xl font-bold text-white tabular-nums">
                {timerSeconds}
              </div>
              <div className="text-xl text-white">секунд</div>
            </div>

            {/* Прогресс-бар таймера */}
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full ${timerColor} transition-all duration-1000 ease-linear`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>

            {/* Кнопки управления таймером */}
            <div className="flex gap-4 justify-center">
              {!timerActive ? (
                <Button
                  onClick={onStartTimer}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white text-xl px-8"
                  disabled={timerSeconds === 0}
                >
                  <Timer className="w-6 h-6 mr-2" />
                  Старт таймера
                </Button>
              ) : (
                <Button
                  onClick={onStopTimer}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white text-xl px-8"
                >
                  Стоп
                </Button>
              )}
            </div>
          </div>

          {/* Панель игроков с кнопками начисления/снятия очков */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white text-center mb-4">
              🎯 Выберите игрока для ответа: 🎯
            </h3>
            {players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  player.id === activePlayerId
                    ? 'bg-amber-500/30 border-amber-400'
                    : 'bg-blue-800/30 border-blue-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onPlayerSelect(player.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-white">
                        {player.name}
                      </div>
                      <div className="text-xl text-amber-400">
                        {player.score} очков
                      </div>
                      {player.id === activePlayerId && (
                        <div className="text-sm text-amber-300 animate-pulse">
                          ⭐ Активный
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onAwardPoints(player.id, pointValue)}
                      variant="default"
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <Plus className="w-5 h-5" />+{pointValue}
                    </Button>
                    <Button
                      onClick={() => onDeductPoints(player.id, pointValue)}
                      variant="destructive"
                      size="lg"
                      className="gap-2"
                    >
                      <Minus className="w-5 h-5" />-{pointValue}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

