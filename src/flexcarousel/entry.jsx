import { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import FlexCarousel from './FlexCarousel.jsx';
import { projects } from './items.js';

// Cards are sized in multiples of the container height, but the glass lens is
// sized in multiples of the container width (lensWidth/lensHeight become
// `half = prop * width / 2`). Deriving the lens from the measured box keeps the
// band on the cards' edges instead of ballooning far past them on the narrow,
// tall phone viewports this carousel runs on.
const CARD_HEIGHT = 0.42;
const GAP = 12;
const RADIUS = 4;
const LENS_TILT = (62 * Math.PI) / 180; // BEND_PRESETS.liquid tilt, in radians
const LENS_HALF_HEIGHT = 0.22; // of the container height
const LENS_MAX_HALF_EXTENT = 0.44; // rotated lens footprint, of the container height
const LENS_MAX_HALF_WIDTH = 0.46; // of the container width

// The `liquid` preset assumes a lens far larger than the cards, so its bend and
// reach were tuned for a soft wash at the edges. With the lens sized to the
// cards, and the bend now weighted by distance from the centre, the outer cards
// carry the whole effect, so the amplitude can stay close to the preset.
const LENS_BEND = 0.28; // uFlow = bend * (halfW + halfH) * 0.45 => ~29px at the edges
const LENS_REACH = 0.34; // band width (uInner/uOuter) around the lens edge

/**
 * The tilted lens is a rotated superellipse, so its vertical footprint is
 * sqrt((halfWidth * sin)² + (halfHeight * cos)²). Solve for the half width that
 * keeps that footprint inside the container, then convert both axes back to the
 * width-relative values the component expects.
 */
const lensFor = (width, height) => {
  const safeWidth = Math.max(width, 1);
  const cardHeight = CARD_HEIGHT * height;
  const halfHeight = Math.min(cardHeight * 0.66, height * LENS_HALF_HEIGHT);
  const extent = height * LENS_MAX_HALF_EXTENT;
  const cos = Math.cos(LENS_TILT);
  const sin = Math.sin(LENS_TILT);
  const fitted = Math.sqrt(Math.max(extent * extent - (halfHeight * cos) ** 2, 1)) / sin;
  const halfWidth = Math.max(Math.min(fitted, safeWidth * LENS_MAX_HALF_WIDTH), halfHeight * 0.9);

  return {
    lensWidth: (halfWidth * 2) / safeWidth,
    lensHeight: (halfHeight * 2) / safeWidth
  };
};

const hasWebGL2 = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

/** Native, dependency-free fallback used when WebGL2 is unavailable. */
const Fallback = () => (
  <div className="ja-flexcarousel__fallback" role="list" aria-label="Projects">
    {projects.map(project => (
      <a
        key={project.id}
        role="listitem"
        className="ja-flexcarousel__fallback-card"
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={project.src} alt={project.alt} decoding="async" />
        <span className="ja-flexcarousel__fallback-title">{project.title}</span>
      </a>
    ))}
  </div>
);

class CarouselBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    window.__jaFlexCarouselFallback = true;
    console.warn('[projects] FlexCarousel failed; showing the native fallback.', error);
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function App() {
  const hostRef = useRef(null);
  const webgl2 = useMemo(hasWebGL2, []);
  const [failed, setFailed] = useState(false);
  const usingFallback = failed || !webgl2;
  const [glass, setGlass] = useState(() => ({ lensWidth: 0.74, lensHeight: 1.18 }));

  // Keep the lens proportional to the mounted box at every width.
  useEffect(() => {
    const host = hostRef.current?.closest('[data-ja-flexcarousel]');
    if (!host || typeof ResizeObserver === 'undefined') return undefined;
    let key = '';
    const update = () => {
      const box = host.getBoundingClientRect();
      const next = lensFor(box.width, box.height);
      const signature = `${next.lensWidth.toFixed(3)}|${next.lensHeight.toFixed(3)}`;
      if (signature === key) return;
      key = signature;
      setGlass(next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  // The fallback is a shorter native strip, so the mount collapses to its
  // natural height instead of leaving dead space under the cards.
  useEffect(() => {
    const host = hostRef.current?.closest('[data-ja-flexcarousel]');
    if (!host) return;
    host.classList.toggle('ja-flexcarousel--fallback', usingFallback);
    if (usingFallback) window.__jaFlexCarouselFallback = true;
    else delete window.__jaFlexCarouselFallback;
  }, [usingFallback]);

  useEffect(() => {
    const carousel = hostRef.current?.querySelector('.flex-carousel');
    if (!carousel) return;
    carousel.setAttribute('aria-label', 'Projects carousel');
    carousel.setAttribute(
      'aria-description',
      'Drag, swipe, or use the arrow keys to browse the projects. Press Enter or tap the centred project to open it.'
    );
  });

  const openProject = useCallback((index, item) => {
    if (!item?.href) return;
    window.open(item.href, '_blank', 'noopener,noreferrer');
  }, []);

  const reportChange = useCallback((index, item) => {
    window.__jaFlexCarouselState = {
      index,
      title: item?.title ?? '',
      href: item?.href ?? ''
    };
  }, []);

  return (
    <div className="ja-flexcarousel__inner" ref={hostRef}>
      {usingFallback ? (
        <Fallback />
      ) : (
        <CarouselBoundary fallback={<Fallback />} onError={() => setFailed(true)}>
          <FlexCarousel
            items={projects}
            preset="liquid"
            intro="rise"
            cardHeight={CARD_HEIGHT}
            gap={GAP}
            radius={RADIUS}
            lensWidth={glass.lensWidth}
            lensHeight={glass.lensHeight}
            bend={LENS_BEND}
            reach={LENS_REACH}
            squeeze={0.2}
            focusOnClick
            captions
            captureWheel={false}
            autoplay={false}
            onSelect={openProject}
            onChange={reportChange}
          />
        </CarouselBoundary>
      )}
    </div>
  );
}

export function mount(host) {
  if (!host || host.__jaFlexRoot) return;
  const root = createRoot(host);
  host.__jaFlexRoot = root;
  root.render(<App />);
  window.__jaFlexCarouselItems = projects;
  window.__jaFlexCarouselMounted = true;
}

export function unmount(host) {
  if (!host || !host.__jaFlexRoot) return;
  host.__jaFlexRoot.unmount();
  delete host.__jaFlexRoot;
  window.__jaFlexCarouselMounted = false;
}
