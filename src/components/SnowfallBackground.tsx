import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  opacity: number;
}

export default function SnowfallBackground() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Создаём снежинки
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 10 + Math.random() * 20,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.left}%`,
            top: '-10px',
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

