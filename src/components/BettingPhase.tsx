import { useState } from 'react';
import type { Player, SuperGameTheme } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BettingPhaseProps {
  selectedTheme: SuperGameTheme;
  players: Player[];
  bets: Record<number, number>;
  onPlaceBet: (playerId: number, amount: number) => void;
  onComplete: () => void;
}

export default function BettingPhase({
  selectedTheme,
  players,
  bets,
  onPlaceBet,
  onComplete,
}: BettingPhaseProps) {
  const eligiblePlayers = players.filter(p => p.score > 0);
  const [currentBet, setCurrentBet] = useState<Record<number, string>>({});

  const handleBetChange = (playerId: number, value: string) => {
    setCurrentBet(prev => ({ ...prev, [playerId]: value }));
  };

  const handleSetMax = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    setCurrentBet(prev => ({ ...prev, [playerId]: player.score.toString() }));
  };

  const handleAdd100 = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    const currentValue = parseInt(currentBet[playerId] || '0');
    const newValue = Math.min(currentValue + 100, player.score);
    setCurrentBet(prev => ({ ...prev, [playerId]: newValue.toString() }));
  };

  const handleConfirmBet = (playerId: number) => {
    const betValue = parseInt(currentBet[playerId] || '0');
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    if (betValue < 1) {
      alert('Минимальная ставка - 1 очко');
      return;
    }

    if (betValue > player.score) {
      alert(`У игрока ${player.name} только ${player.score} очков!`);
      return;
    }

    onPlaceBet(playerId, betValue);
  };

  const allBetsPlaced = eligiblePlayers.every(p => bets[p.id] !== undefined);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-5xl bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-4 border-purple-400/50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎁 СУПЕР ИГРА: Ставки 🎁
            </h1>
            <div className="p-6 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <p className="text-2xl font-bold">Тема: {selectedTheme.name}</p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-white/10 rounded-lg text-white text-center">
            <p className="text-lg">
              Каждый игрок делает ставку от 1 до своего количества очков
            </p>
            <p className="text-sm text-purple-200 mt-2">
              Правильный ответ = +ставка | Неправильный = -ставка
            </p>
          </div>

          {/* Ставки игроков */}
          <div className="space-y-4 mb-8">
            {eligiblePlayers.map((player) => {
              const hasBet = bets[player.id] !== undefined;

              return (
                <Card
                  key={player.id}
                  className={`${
                    hasBet
                      ? 'bg-gradient-to-r from-green-700/50 to-emerald-700/50 border-green-400'
                      : 'bg-gradient-to-r from-purple-700/50 to-pink-700/50 border-purple-400'
                  } border-2`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white">
                          {player.name}
                        </h3>
                        <p className="text-lg text-purple-200">
                          Доступно очков: {player.score}
                        </p>
                      </div>

                      {!hasBet ? (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleSetMax(player.id)}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                            >
                              MAX
                            </Button>
                            <Button
                              onClick={() => handleAdd100(player.id)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            >
                              +100
                            </Button>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max={player.score}
                            value={currentBet[player.id] || ''}
                            onChange={(e) => handleBetChange(player.id, e.target.value)}
                            placeholder="Ставка"
                            className="w-32 px-4 py-3 text-2xl text-center bg-white/20 text-white rounded-lg border-2 border-white/30 focus:border-amber-400 focus:outline-none"
                          />
                          <Button
                            onClick={() => handleConfirmBet(player.id)}
                            size="lg"
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Подтвердить
                          </Button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-4xl font-bold text-white">
                            {bets[player.id]} очков
                          </p>
                          <p className="text-green-300">✓ Ставка принята</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Кнопка продолжения */}
          {allBetsPlaced && (
            <div className="text-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-2xl px-12 py-6 animate-pulse"
              >
                Все ставки приняты - Задать вопрос! →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

