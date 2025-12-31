import type { Player } from '@/types/game';
import PlayerCard from '@/components/PlayerCard';

interface PlayersPanelProps {
  players: Player[];
  activePlayerId: number | null;
  onPlayerSelect: (playerId: number) => void;
}

export default function PlayersPanel({
  players,
  activePlayerId,
  onPlayerSelect,
}: PlayersPanelProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isActive={player.id === activePlayerId}
          onClick={() => onPlayerSelect(player.id)}
        />
      ))}
    </div>
  );
}

