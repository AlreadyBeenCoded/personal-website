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

// Salzburg's clock, matching the head script — the footer names this daypart.
function salzburgTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
    timeZone: 'Europe/Vienna',
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { hour: get('hour'), minute: get('minute') };
}

function daypart() {
  const h = salzburgTime().hour;
  return h >= 6 && h < 11 ? 'morning' : h >= 11 && h < 16 ? 'midday' : h >= 16 && h < 21 ? 'evening' : 'night';
}

// The footer sundial: minutes-since-midnight mapped linearly onto the
// track. Runs against a given root so before-swap can place the sun on
// the incoming document before it paints (same trick as the daypart).
function placeSun(root: Document = document) {
  const track = root.querySelector<HTMLElement>('[data-sun]');
  if (!track) return;
  const { hour, minute } = salzburgTime();
  track.style.setProperty('--sun-x', `${(((hour * 60 + minute) / 1440) * 100).toFixed(2)}%`);
}

// The inline head script sets this before first paint on hard loads;
// astro:page-load re-applies it as a belt after client-side navigation.
function applyDaypart() {
  document.documentElement.dataset.daypart = daypart();
}

// View transitions rebuild <html> attributes from the incoming page's
// static HTML, which never carries the JS-applied state: data-daypart and
// .motion-ok would vanish between the swap painting and astro:page-load
// firing — the canvas fades default→daypart (body's 1500ms transition
// animating a change that isn't one) and the hero can flash unhidden
// before its reveal replays. Settle both on the incoming document BEFORE
// it paints.
document.addEventListener('astro:before-swap', (e) => {
  const doc = (e as Event & { newDocument: Document }).newDocument;
  doc.documentElement.dataset.daypart = daypart();
  doc.documentElement.classList.toggle('motion-ok', !reduceMotion());
  placeSun(doc);
});

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
  placeSun();
  startLenis();
  revealHero();
  riseOnScroll();
});
