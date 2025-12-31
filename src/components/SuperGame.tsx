import type { Player, SuperGameState } from '@/types/game';
import ThemeElimination from './ThemeElimination';
import BettingPhase from './BettingPhase';
import FinalAnswers from './FinalAnswers';

interface SuperGameProps {
  superGameState: SuperGameState;
  players: Player[];
  onUpdateSuperGame: (updates: Partial<SuperGameState>) => void;
  onComplete: () => void;
}

export default function SuperGame({
  superGameState,
  players,
  onUpdateSuperGame,
  onComplete,
}: SuperGameProps) {
  const eligiblePlayers = players.filter(p => p.score > 0);

  const handleEliminateTheme = (themeName: string) => {
    const newEliminatedThemes = [...superGameState.eliminatedThemes, themeName];

    // Переход к следующему игроку
    const nextPlayerIndex = (superGameState.currentPlayerIndex + 1) % eligiblePlayers.length;

    onUpdateSuperGame({
      eliminatedThemes: newEliminatedThemes,
      currentPlayerIndex: nextPlayerIndex,
    });
  };

  const handleCompleteElimination = () => {
    const remainingThemes = superGameState.themes.filter(
      t => !superGameState.eliminatedThemes.includes(t.name)
    );

    if (remainingThemes.length === 1) {
      onUpdateSuperGame({
        selectedTheme: remainingThemes[0],
        phase: 'betting',
        currentPlayerIndex: 0,
      });
    }
  };

  const handlePlaceBet = (playerId: number, amount: number) => {
    onUpdateSuperGame({
      bets: {
        ...superGameState.bets,
        [playerId]: amount,
      },
    });
  };

  const handleCompleteBetting = () => {
    onUpdateSuperGame({
      phase: 'answering',
      currentPlayerIndex: 0,
    });
  };

  const handleMarkAnswer = (playerId: number, correct: boolean) => {
    onUpdateSuperGame({
      answers: {
        ...superGameState.answers,
        [playerId]: correct,
      },
    });
  };

  const handleCompleteAnswering = () => {
    onUpdateSuperGame({
      phase: 'completed',
    });
    // Небольшая задержка перед завершением для отображения результатов
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  if (superGameState.phase === 'elimination') {
    return (
      <ThemeElimination
        themes={superGameState.themes}
        eliminatedThemes={superGameState.eliminatedThemes}
        players={players}
        currentPlayerIndex={superGameState.currentPlayerIndex}
        onEliminateTheme={handleEliminateTheme}
        onComplete={handleCompleteElimination}
      />
    );
  }

  if (superGameState.phase === 'betting' && superGameState.selectedTheme) {
    return (
      <BettingPhase
        selectedTheme={superGameState.selectedTheme}
        players={players}
        bets={superGameState.bets}
        onPlaceBet={handlePlaceBet}
        onComplete={handleCompleteBetting}
      />
    );
  }

  if (superGameState.phase === 'answering' && superGameState.selectedTheme) {
    return (
      <FinalAnswers
        selectedTheme={superGameState.selectedTheme}
        players={players}
        bets={superGameState.bets}
        answers={superGameState.answers}
        onMarkAnswer={handleMarkAnswer}
        onComplete={handleCompleteAnswering}
      />
    );
  }

  if (superGameState.phase === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎉 Супер игра завершена! 🎉
          </h1>
          <p className="text-2xl text-purple-200">
            Возврат к результатам...
          </p>
        </div>
      </div>
    );
  }

  return null;
}

