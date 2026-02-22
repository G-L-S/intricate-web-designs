import { useState, useEffect, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

interface HeroProps {
  introMode?: boolean;
  onComplete?: () => void;
  skipReveal?: boolean;
}

// Shake-only styles — pure X translation, no skew, no chromatic aberration
const SHAKE_STYLES: Record<string, React.CSSProperties> = {
  s1: { transform: "translateX(-10px)" },
  s2: { transform: "translateX(10px)" },
  s3: { transform: "translateX(-9px)" },
  s4: { transform: "translateX(9px)" },
};

// Glitch styles for the dissolution phase — chromatic aberration, slight skew
const GLITCH_STYLES: Record<string, React.CSSProperties> = {
  g1: {
    transform: "translateX(4px)",
    textShadow: "-3px 0 hsl(0 100% 50% / 0.35), 3px 0 hsl(180 100% 50% / 0.35)",
  },
  g2: {
    transform: "translateX(-5px)",
    textShadow: "2px 0 hsl(0 100% 50% / 0.3), -2px 0 hsl(180 100% 50% / 0.3)",
  },
  g3: {
    transform: "translateX(3px)",
    textShadow: "-2px 0 hsl(0 100% 50% / 0.4), 3px 0 hsl(180 100% 50% / 0.25)",
  },
  g4: {
    transform: "translateX(-2px)",
    textShadow: "3px 0 hsl(0 100% 50% / 0.3), -3px 0 hsl(180 100% 50% / 0.35)",
  },
};

export default function Hero({ introMode = false, onComplete, skipReveal = false }: HeroProps) {
  const [revealRef, visible] = useReveal(0.1);
  const [glitch, setGlitch] = useState("");
  const [dissolve, setDissolve] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Ghost state: opacity of the afterimage layer, and which X offset it was burned at
  const [ghostOpacity, setGhostOpacity] = useState(0);
  const [ghostX, setGhostX] = useState(0);

  const stableOnComplete = useCallback(() => onComplete?.(), [onComplete]);

  useEffect(() => {
    if (!introMode) return;

    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));

    // === SHAKE SEQUENCE ===
    // 750ms of stillness, then two double-knock shakes

    // First knock — left/right, no ghost
    t(() => setGlitch("s1"), 750);
    t(() => setGlitch("s2"), 830);
    t(() => setGlitch(""),   910);

    // 180ms breath between knocks
    // Second knock — left/right, WITH ghost burned at the left position
    // Ghost: at the moment we snap right (s4), the previous left position burns in
    t(() => {
      setGlitch("s3");
      // Burn in a ghost at the left offset (-9px) with full opacity
      setGhostX(-9);
      setGhostOpacity(0.45);
    }, 1090);
    t(() => {
      setGlitch("s4");
      // Real text has snapped right — ghost at left begins decaying
      // (CSS transition on ghostOpacity handles the decay)
    }, 1170);
    t(() => {
      setGlitch("");
      // Text returns to center — ghost continues fading out via CSS
    }, 1250);

    // Ghost fully gone by ~1550ms (300ms decay from 1250)

    // === 200ms BREATH before glitch dissolution begins ===

    // First stutter
    t(() => setGlitch("g1"), 1600);
    t(() => setGlitch(""),   1640);
    t(() => setGlitch("g2"), 1700);
    t(() => setGlitch(""),   1750);

    // Third stutter
    t(() => setGlitch("g3"), 1875);
    t(() => setGlitch(""),   1925);

    // Pause... then one more
    t(() => setGlitch("g4"), 2175);
    t(() => setGlitch(""),   2215);

    // Accelerate
    t(() => setGlitch("g1"), 2275);
    t(() => setGlitch(""),   2305);
    t(() => setGlitch("g3"), 2330);
    t(() => setGlitch(""),   2360);
    t(() => setGlitch("g2"), 2380);
    t(() => setGlitch("g4"), 2400);
    t(() => setGlitch("g1"), 2420);

    // Dissolve
    t(() => {
      setGlitch("");
      setDissolve(true);
    }, 2450);

    // Complete
    t(() => {
      setHidden(true);
      stableOnComplete();
    }, 3050);

    return () => ids.forEach(clearTimeout);
  }, [introMode, stableOnComplete]);

  if (hidden && introMode) return null;

  const isIntro = introMode;
  const showRevealAnim = !isIntro && !skipReveal;

  const activeStyle = glitch
    ? ({ ...SHAKE_STYLES, ...GLITCH_STYLES }[glitch] ?? {})
    : {};

  return (
    <div
      ref={showRevealAnim ? (revealRef as React.RefObject<HTMLDivElement>) : undefined}
      className={`min-h-screen flex flex-col items-center justify-center text-center px-8 ${
        showRevealAnim
          ? `transition-opacity duration-[1200ms] ${visible ? "opacity-100" : "opacity-0"}`
          : ""
      }`}
    >
      {/* Ghost / afterimage layer — absolutely positioned, renders beneath real text,
          visible only during the second shake's afterimage moment.
          Uses the same text content as the real layer so it overlaps perfectly.
          Pointer-events none so it never interferes with interaction. */}
      {introMode && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pointerEvents: "none",
            opacity: ghostOpacity,
            transform: `translateX(${ghostX}px)`,
            transition: "opacity 300ms ease-out",
          }}
        >
          <p className="font-body text-[0.7rem] font-normal text-dim tracking-[0.35em] uppercase mb-8">
            The March to Babylon
          </p>

          <h1
            className="font-display font-light text-foreground tracking-[0.06em] uppercase m-0"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.95 }}
          >
            G.L.
            <br />
            Shephard
          </h1>

          <p
            className="font-display font-light italic text-body-muted max-w-[500px] mx-auto"
            style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
          >
            The books in the middle — where the storm is still deciding what it
            will destroy.
          </p>
        </div>
      )}

      {/* Real text layer */}
      <div
        style={{
          ...activeStyle,
          opacity: dissolve ? 0 : 1,
          filter: dissolve ? "blur(6px)" : "blur(0px)",
          transition: dissolve
            ? "opacity 600ms ease, filter 600ms ease"
            : "transform 60ms steps(1, end), text-shadow 60ms steps(1, end)",
        }}
      >
        <p className="font-body text-[0.7rem] font-normal text-dim tracking-[0.35em] uppercase mb-8">
          The March to Babylon
        </p>

        <h1
          className="font-display font-light text-foreground tracking-[0.06em] uppercase m-0"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.95 }}
        >
          G.L.
          <br />
          Shephard
        </h1>

        <p
          className="font-display font-light italic text-body-muted max-w-[500px] mx-auto"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        >
          The books in the middle — where the storm is still deciding what it
          will destroy.
        </p>

        {/* Down arrow — always rendered for consistent centering, hidden in intro */}
        <div
          className={`mt-16 flex justify-center ${isIntro ? "invisible" : ""}`}
          style={{ animation: isIntro ? "none" : "pulse-arrow 2.5s ease-in-out infinite" }}
        >
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <path
              d="M10 0 L10 24 M3 17 L10 24 L17 17"
              stroke="hsl(30, 7%, 27%)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
