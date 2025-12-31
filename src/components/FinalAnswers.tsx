import type { Player, SuperGameTheme } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface FinalAnswersProps {
  selectedTheme: SuperGameTheme;
  players: Player[];
  bets: Record<number, number>;
  answers: Record<number, boolean | null>;
  onMarkAnswer: (playerId: number, correct: boolean) => void;
  onComplete: () => void;
}

export default function FinalAnswers({
  selectedTheme,
  players,
  bets,
  answers,
  onMarkAnswer,
  onComplete,
}: FinalAnswersProps) {
  const eligiblePlayers = players.filter(p => p.score > 0);
  const allAnswersMarked = eligiblePlayers.every(p => answers[p.id] !== null && answers[p.id] !== undefined);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-5xl bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-4 border-purple-400/50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎁 СУПЕР ИГРА: Ответы 🎁
            </h1>
            <div className="p-6 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <p className="text-2xl font-bold mb-2">Тема: {selectedTheme.name}</p>
            </div>
          </div>

          {/* Вопрос */}
          <div className="mb-8 p-8 rounded-xl bg-white/10 border-2 border-white/30">
            <p className="text-3xl text-white text-center leading-relaxed">
              {selectedTheme.question}
            </p>
          </div>

          <div className="mb-8 p-4 bg-white/10 rounded-lg text-white text-center">
            <p className="text-lg">
              Каждый игрок называет свой ответ. Отметьте правильность ответов.
            </p>
          </div>

          {/* Ответы игроков */}
          <div className="space-y-4 mb-8">
            {eligiblePlayers.map((player) => {
              const answer = answers[player.id];
              const bet = bets[player.id];
              const hasAnswered = answer !== null && answer !== undefined;

              return (
                <Card
                  key={player.id}
                  className={`${
                    !hasAnswered
                      ? 'bg-gradient-to-r from-purple-700/50 to-pink-700/50 border-purple-400'
                      : answer
                      ? 'bg-gradient-to-r from-green-700/50 to-emerald-700/50 border-green-400'
                      : 'bg-gradient-to-r from-red-700/50 to-rose-700/50 border-red-400'
                  } border-2`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white">
                          {player.name}
                        </h3>
                        <p className="text-lg text-purple-200">
                          Ставка: {bet} очков
                        </p>
                        <p className="text-sm text-purple-200">
                          Текущий счет: {player.score} очков
                        </p>
                      </div>

                      {!hasAnswered ? (
                        <div className="flex items-center gap-4">
                          <p className="text-white text-lg mr-4">
                            Ответ игрока:
                          </p>
                          <Button
                            onClick={() => onMarkAnswer(player.id, true)}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8"
                          >
                            <Check className="w-6 h-6" />
                            Правильно
                          </Button>
                          <Button
                            onClick={() => onMarkAnswer(player.id, false)}
                            size="lg"
                            variant="destructive"
                            className="gap-2 px-8"
                          >
                            <X className="w-6 h-6" />
                            Неправильно
                          </Button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className={`text-4xl font-bold ${answer ? 'text-green-300' : 'text-red-300'}`}>
                            {answer ? (
                              <>
                                <Check className="w-12 h-12 inline-block mr-2" />
                                +{bet} очков
                              </>
                            ) : (
                              <>
                                <X className="w-12 h-12 inline-block mr-2" />
                                -{bet} очков
                              </>
                            )}
                          </p>
                          <p className="text-lg text-white mt-2">
                            Новый счет: {answer ? player.score + bet : player.score - bet}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Кнопка завершения */}
          {allAnswersMarked && (
            <div className="text-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-2xl px-12 py-6 animate-pulse"
              >
                🎉 Завершить супер игру! 🎉
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

