import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(SplitText, ScrollTrigger);

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

// Recreated on every page load: Astro's view transitions rebuild <html>,
// which strips the classes/state Lenis put there, so a surviving instance
// is half-broken. Destroy + re-init is stateless and also picks up a
// changed reduced-motion preference.
function startLenis() {
  lenis?.destroy();
  lenis = null;
  if (reduceMotion()) return;
  // Touch devices keep native momentum scrolling (Lenis default);
  // smoothing only applies to wheel input.
  // lerp: each frame closes this fraction of the gap to the wheel target.
  // Default 0.1 takes ~400ms to catch up to a flick and reads as lag;
  // 0.22 keeps the weighted feel but roughly halves the latency. This is
  // THE knob for smooth-vs-responsive — tune to taste.
  lenis = new Lenis({ autoRaf: true, lerp: 0.22 });
  // Keep ScrollTrigger's measurements in sync with Lenis-driven scrolling.
  lenis.on('scroll', ScrollTrigger.update);
}

// The inline head script sets this before first paint, but Astro's view
// transitions rebuild <html> attributes from the incoming page on client-side
// navigation, so it is re-applied on every astro:page-load.
function applyDaypart() {
  const h = new Date().getHours();
  document.documentElement.dataset.daypart =
    h >= 6 && h < 11 ? 'morning' : h >= 11 && h < 16 ? 'midday' : h >= 16 && h < 21 ? 'evening' : 'night';
}

function revealHero() {
  const line = document.querySelector<HTMLElement>('[data-hero-line]');
  const rest = gsap.utils.toArray<HTMLElement>('[data-hero-rest]');
  if (!line) return;

  if (reduceMotion()) {
    // Preference flipped after the head script ran: just show everything.
    gsap.set([line, ...rest], { visibility: 'visible' });
    return;
  }

  // Splitting by words *and* chars keeps words whole when the headline
  // wraps; masking clips each word so characters rise into view rather
  // than fading in place — the "settle" the brief asks for.
  const split = SplitText.create(line, { type: 'words,chars', mask: 'words' });

  // .from() tweens render their start values immediately, so nothing
  // flashes visible between these set() calls and the animation start.
  gsap.set([line, ...rest], { visibility: 'visible' });
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(split.chars, { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.018 })
    .from(rest, { y: 14, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.45');
}

// Cards (and later, other elements) marked data-rise lift into place as
// they enter the viewport, once, then stay settled.
function riseOnScroll() {
  const items = gsap.utils.toArray<HTMLElement>('[data-rise]');
  if (!items.length) return;

  if (reduceMotion()) {
    gsap.set(items, { visibility: 'visible' });
    return;
  }

  for (const el of items) {
    gsap.set(el, { visibility: 'visible' });
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  }
}

// Fires on first load and after every client-side navigation
// (requires <ClientRouter /> in the layout head).
document.addEventListener('astro:page-load', () => {
  // Triggers from the previous page point at DOM that no longer exists.
  ScrollTrigger.getAll().forEach((t) => t.kill());
  applyDaypart();
  startLenis();
  revealHero();
  riseOnScroll();
});
