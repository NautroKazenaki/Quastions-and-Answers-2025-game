import type { Player, SuperGameTheme } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ThemeEliminationProps {
  themes: SuperGameTheme[];
  eliminatedThemes: string[];
  players: Player[];
  currentPlayerIndex: number;
  onEliminateTheme: (themeName: string) => void;
  onComplete: () => void;
}

export default function ThemeElimination({
  themes,
  eliminatedThemes,
  players,
  currentPlayerIndex,
  onEliminateTheme,
  onComplete,
}: ThemeEliminationProps) {
  const eligiblePlayers = players.filter(p => p.score > 0);
  const currentPlayer = eligiblePlayers[currentPlayerIndex];
  const remainingThemes = themes.filter(t => !eliminatedThemes.includes(t.name));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-5xl bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-4 border-purple-400/50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎁 СУПЕР ИГРА: Выбор темы 🎁
            </h1>
            <p className="text-xl text-purple-200">
              Вычеркивайте темы по очереди, пока не останется одна
            </p>
          </div>

          {/* Текущий игрок */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-center">
            <p className="text-2xl font-bold">
              Ход игрока: {currentPlayer?.name}
            </p>
            <p className="text-lg mt-2">
              Выберите тему для вычеркивания
            </p>
          </div>

          {/* Темы */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {themes.map((theme) => {
              const isEliminated = eliminatedThemes.includes(theme.name);
              const isLast = remainingThemes.length === 1 && !isEliminated;

              return (
                <Button
                  key={theme.name}
                  onClick={() => onEliminateTheme(theme.name)}
                  disabled={isEliminated || isLast}
                  className={`h-32 text-xl font-bold transition-all ${
                    isEliminated
                      ? 'bg-gray-700 text-gray-500 line-through opacity-30'
                      : isLast
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/50 border-4 border-green-300 animate-pulse'
                      : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50 hover:scale-105'
                  }`}
                >
                  {isEliminated && <X className="w-8 h-8 mr-2" />}
                  {theme.name}
                </Button>
              );
            })}
          </div>

          {/* Прогресс */}
          <div className="text-center text-white text-lg mb-6">
            <p>
              Осталось тем: <span className="text-3xl font-bold text-amber-400">{remainingThemes.length}</span>
            </p>
            <p className="text-sm text-purple-200 mt-2">
              Вычеркнуто: {eliminatedThemes.length} из {themes.length - 1}
            </p>
          </div>

          {/* Кнопка продолжения */}
          {remainingThemes.length === 1 && (
            <div className="text-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-2xl px-12 py-6 animate-pulse"
              >
                Продолжить с темой: {remainingThemes[0].name} →
              </Button>
            </div>
          )}

          {/* Список участников */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <h3 className="text-white font-bold mb-3">Участники супер игры:</h3>
            <div className="flex gap-4 flex-wrap">
              {eligiblePlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`px-4 py-2 rounded-lg ${
                    index === currentPlayerIndex
                      ? 'bg-amber-500 text-white font-bold'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {player.name} ({player.score} очков)
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

