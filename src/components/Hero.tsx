import { useState, useEffect, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

interface HeroProps {
  introMode?: boolean;
  onComplete?: () => void;
  skipReveal?: boolean;
}

const SHAKE_STYLES: Record<string, React.CSSProperties> = {
  s1: { transform: "translateX(-10px)" },
  s2: { transform: "translateX(10px)" },
  s3: { transform: "translateX(-9px)" },
  s4: { transform: "translateX(9px)" },
};

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
  const [ghostOpacity, setGhostOpacity] = useState(0);
  const [ghostX, setGhostX] = useState(0);

  const stableOnComplete = useCallback(() => onComplete?.(), [onComplete]);

  useEffect(() => {
    if (!introMode) return;

    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));

    // First knock — left then right, no ghost
    t(() => setGlitch("s1"), 750);
    t(() => setGlitch("s2"), 830);
    t(() => setGlitch(""),   910);

    // Second knock — with ghost burned at left position
    t(() => {
      setGlitch("s3");
      setGhostX(-9);
      setGhostOpacity(0.45);
    }, 1090);
    t(() => setGlitch("s4"), 1170);
    t(() => {
      setGlitch("");
      // Begin ghost decay — CSS transition handles the fade
      setGhostOpacity(0);
    }, 1250);

    // Glitch dissolution phase
    t(() => setGlitch("g1"), 1600);
    t(() => setGlitch(""),   1640);
    t(() => setGlitch("g2"), 1700);
    t(() => setGlitch(""),   1750);

    t(() => setGlitch("g3"), 1875);
    t(() => setGlitch(""),   1925);

    t(() => setGlitch("g4"), 2175);
    t(() => setGlitch(""),   2215);

    t(() => setGlitch("g1"), 2275);
    t(() => setGlitch(""),   2305);
    t(() => setGlitch("g3"), 2330);
    t(() => setGlitch(""),   2360);
    t(() => setGlitch("g2"), 2380);
    t(() => setGlitch("g4"), 2400);
    t(() => setGlitch("g1"), 2420);

    t(() => {
      setGlitch("");
      setDissolve(true);
    }, 2450);

    t(() => {
      setHidden(true);
      stableOnComplete();
    }, 3050);

    return () => ids.forEach(clearTimeout);
  }, [introMode, stableOnComplete]);

  if (hidden && introMode) return null;

  const isIntro = introMode;
  const showRevealAnim = !isIntro && !skipReveal;
  const allStyles = { ...SHAKE_STYLES, ...GLITCH_STYLES };
  const activeStyle = glitch ? (allStyles[glitch] ?? {}) : {};

  return (
    <div
      ref={showRevealAnim ? (revealRef as React.RefObject<HTMLDivElement>) : undefined}
      className={`min-h-screen flex flex-col items-center justify-center text-center px-8 ${
        showRevealAnim
          ? `transition-opacity duration-[1200ms] ${visible ? "opacity-100" : "opacity-0"}`
          : ""
      }`}
    >
      {/* Ghost afterimage layer — only mounted during introMode */}
      {introMode && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateX(${ghostX}px)`,
            opacity: ghostOpacity,
            transition: "opacity 300ms ease-out",
            pointerEvents: "none",
            filter: "blur(0.5px) saturate(0.3) brightness(1.4)",
            userSelect: "none",
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
