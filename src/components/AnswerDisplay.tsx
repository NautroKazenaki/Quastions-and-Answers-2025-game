import type { Answer } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MediaDisplay from './MediaDisplay';

interface AnswerDisplayProps {
  answer: string | Answer | undefined;
  isVisible: boolean;
  onToggle: () => void;
}

export default function AnswerDisplay({ 
  answer, 
  isVisible, 
  onToggle 
}: AnswerDisplayProps) {
  if (!answer) return null;

  // Преобразуем строку в объект Answer для единообразия
  const answerObj: Answer = typeof answer === 'string' 
    ? { text: answer } 
    : answer;

  return (
    <div className="mt-6">
      <Button 
        onClick={onToggle}
        size="lg"
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xl px-8"
      >
        {isVisible ? '🙈 Скрыть ответ' : '👁️ Показать ответ'}
      </Button>

      {isVisible && (
        <Card className="mt-4 bg-gradient-to-br from-green-900/70 to-emerald-900/70 border-4 border-green-400 shadow-2xl">
          <CardContent className="p-6">
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-4xl">✅</span>
              Правильный ответ:
            </h3>
            <p className="text-2xl text-white mb-4 leading-relaxed">
              {answerObj.text}
            </p>
            {answerObj.media && (
              <MediaDisplay media={answerObj.media} className="max-w-3xl mx-auto" />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

