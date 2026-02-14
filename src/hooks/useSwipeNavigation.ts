import { useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SWIPE_PAGES = ['/home', '/agenda', '/lembretes', '/lista'];
const MIN_DISTANCE = 60;
const MAX_TIME = 500;

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const startRef = useRef({ x: 0, y: 0, t: 0, ignore: false });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target as HTMLElement;
    startRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
      ignore: isInsideScrollableOrIgnored(target),
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (startRef.current.ignore) return;

    const currentIndex = SWIPE_PAGES.indexOf(location.pathname);
    if (currentIndex === -1) return;

    const dx = e.changedTouches[0].clientX - startRef.current.x;
    const dy = e.changedTouches[0].clientY - startRef.current.y;
    const dt = Date.now() - startRef.current.t;

    // Must be fast, far enough, and strongly horizontal
    if (dt > MAX_TIME) return;
    if (Math.abs(dx) < MIN_DISTANCE) return;
    if (Math.abs(dy) > Math.abs(dx) * 0.6) return;

    if (dx < 0 && currentIndex < SWIPE_PAGES.length - 1) {
      navigate(SWIPE_PAGES[currentIndex + 1]);
    } else if (dx > 0 && currentIndex > 0) {
      navigate(SWIPE_PAGES[currentIndex - 1]);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}

/** Skip swipe if touch started inside a horizontally scrollable or drag-enabled element */
function isInsideScrollableOrIgnored(el: HTMLElement | null): boolean {
  while (el) {
    if (el.dataset.swipeIgnore !== undefined) return true;
    const style = getComputedStyle(el);
    if (
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      el.scrollWidth > el.clientWidth
    ) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}
