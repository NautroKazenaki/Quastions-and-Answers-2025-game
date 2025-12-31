import type { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CatInBagModalProps {
  players: Player[];
  currentPlayerId: number | null;
  pointValue: number;
  onSelectPlayer: (playerId: number) => void;
}

export default function CatInBagModal({
  players,
  currentPlayerId,
  pointValue,
  onSelectPlayer,
}: CatInBagModalProps) {
  const otherPlayers = players.filter(p => p.id !== currentPlayerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-3xl bg-gradient-to-br from-orange-900/95 to-amber-900/95 backdrop-blur-sm border-4 border-amber-400/50 animate-pulse-glow">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-bounce">🐱</div>
            <h1 className="text-5xl font-bold text-white mb-4 animate-sparkle">
              КОТ В МЕШКЕ!
            </h1>
            <div className="p-4 rounded-lg bg-white/10 border-2 border-amber-400">
              <p className="text-2xl text-amber-300 font-bold">
                Вопрос за {pointValue} очков
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-white/10 rounded-lg text-center">
            <p className="text-xl text-white">
              Вы должны передать этот вопрос другому игроку!
            </p>
            <p className="text-lg text-amber-200 mt-2">
              Выберите, кому передать вопрос:
            </p>
          </div>

          {/* Список игроков */}
          <div className="grid grid-cols-2 gap-4">
            {otherPlayers.map((player) => (
              <Button
                key={player.id}
                onClick={() => onSelectPlayer(player.id)}
                size="lg"
                className="h-auto py-6 px-4 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-2 border-purple-400 hover:border-pink-400 transition-all hover:scale-105"
              >
                <div className="text-left w-full">
                  <div className="text-2xl font-bold">{player.name}</div>
                  <div className="text-lg text-purple-200">
                    {player.score} очков
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-6 text-center text-amber-200 text-sm">
            💡 Выбранный игрок получит/потеряет очки за этот вопрос
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

