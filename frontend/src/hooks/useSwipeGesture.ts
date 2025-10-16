
import { useState, useRef, useCallback } from 'react';

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeGestureConfig) {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsSwiping(true);
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      setIsSwiping(false);
      return;
    }

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    // Determine if swipe is horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (deltaY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    }

    setIsSwiping(false);
    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return {
    isSwiping,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
