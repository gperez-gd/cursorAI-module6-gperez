interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
}

type EasingFn = (t: number) => number;

const easeInOutCubic: EasingFn = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export class SmoothScroller {
  private offset: number;
  private duration: number;
  private animationId: number | null = null;
  private userScrolled = false;
  private abortController: AbortController | null = null;

  constructor(options: SmoothScrollOptions = {}) {
    this.offset = options.offset ?? 80;
    this.duration = options.duration ?? 500;
  }

  private cancelAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private onUserScroll = (): void => {
    this.userScrolled = true;
    this.cancelAnimation();
  };

  scrollTo(targetId: string): void {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.scrollIntoView({ block: 'start' });
      return;
    }

    // Compute values upfront to avoid layout thrashing
    const startY = window.scrollY;
    const targetRect = target.getBoundingClientRect();
    const endY = startY + targetRect.top - this.offset;
    const distance = endY - startY;

    if (distance === 0) return;

    this.userScrolled = false;
    this.cancelAnimation();

    // Listen for manual scroll to cancel animation
    window.addEventListener('wheel', this.onUserScroll, { once: true, passive: true });
    window.addEventListener('touchstart', this.onUserScroll, { once: true, passive: true });

    let startTime: number | null = null;

    const step = (timestamp: number): void => {
      if (this.userScrolled) return;

      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const eased = easeInOutCubic(progress);

      // Ensure accurate final position — no drift
      const nextY = progress < 1 ? startY + distance * eased : endY;
      window.scrollTo(0, nextY);

      if (progress < 1) {
        this.animationId = requestAnimationFrame(step);
      } else {
        this.animationId = null;
        window.removeEventListener('wheel', this.onUserScroll);
        window.removeEventListener('touchstart', this.onUserScroll);
      }
    };

    this.animationId = requestAnimationFrame(step);
  }

  init(): () => void {
    const handleClick = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      const scrollable = target.closest<HTMLElement>('[data-scroll]');
      if (!scrollable) return;

      const targetId = scrollable.dataset.scroll;
      if (!targetId) return;

      event.preventDefault();
      this.scrollTo(targetId);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      this.cancelAnimation();
      if (this.abortController) this.abortController.abort();
    };
  }
}

export function initSmoothScroll(options?: SmoothScrollOptions): () => void {
  const scroller = new SmoothScroller(options);
  return scroller.init();
}
