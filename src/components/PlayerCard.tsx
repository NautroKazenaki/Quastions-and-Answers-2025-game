import type { Player } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  onClick: () => void;
}

export default function PlayerCard({ player, isActive, onClick }: PlayerCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
        isActive
          ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-4 border-amber-300 shadow-xl shadow-amber-500/50 animate-pulse-glow'
          : 'bg-gradient-to-br from-blue-700 to-indigo-800 border-2 border-blue-400/50 hover:border-blue-300'
      }`}
    >
      <CardContent className="p-6 text-center">
        <div
          className={`text-2xl font-bold mb-2 ${
            isActive ? 'text-white' : 'text-blue-100'
          }`}
        >
          {isActive && '🎅 '}
          {player.name}
          {isActive && ' 🎅'}
        </div>
        <div
          className={`text-4xl font-bold ${
            isActive ? 'text-white' : 'text-amber-400'
          }`}
        >
          {player.score}
        </div>
        <div
          className={`text-sm mt-1 ${
            isActive ? 'text-white/90' : 'text-blue-200'
          }`}
        >
          ⭐ очков
        </div>
        {isActive && (
          <div className="mt-3 text-white font-semibold text-sm animate-sparkle">
            👑 Активный игрок 👑
          </div>
        )}
      </CardContent>
    </Card>
  );
}

