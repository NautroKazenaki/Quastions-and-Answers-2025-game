import type { MediaContent } from '@/types/game';

interface MediaDisplayProps {
  media: MediaContent | undefined;
  className?: string;
}

export default function MediaDisplay({ media, className = '' }: MediaDisplayProps) {
  if (!media || !media.src) return null;

  if (media.type === 'image') {
    return (
      <img 
        src={media.src} 
        alt="Media content"
        className={`rounded-lg shadow-lg ${className}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    );
  }

  if (media.type === 'video') {
    return (
      <video 
        src={media.src} 
        controls
        className={`rounded-lg shadow-lg ${className}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        Ваш браузер не поддерживает видео.
      </video>
    );
  }

  return null;
}

