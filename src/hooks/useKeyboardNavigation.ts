import { useEffect, useCallback, type RefObject } from 'react';

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}

export function useKeyboardNavigation(
  elementRef: RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
      }
    },
    [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [elementRef, handleKeyDown, enabled]);
}

// Хук для глобальной навигации клавиатурой
export function useGlobalKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Игнорируем, если фокус на input
      if (event.target instanceof HTMLInputElement) {
        return;
      }

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);
}

