import { useState, useEffect, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

interface HeroProps {
  introMode?: boolean;
  onComplete?: () => void;
}

const GLITCH_STYLES: Record<string, React.CSSProperties> = {
  g1: {
    transform: "translateX(4px) skewX(-0.5deg)",
    textShadow:
      "-3px 0 hsl(0 100% 50% / 0.35), 3px 0 hsl(180 100% 50% / 0.35)",
  },
  g2: {
    transform: "translateX(-5px) skewX(0.3deg)",
    textShadow:
      "2px 0 hsl(0 100% 50% / 0.3), -2px 0 hsl(180 100% 50% / 0.3)",
  },
  g3: {
    transform: "translateX(3px) skewX(-0.2deg)",
    textShadow:
      "-2px 0 hsl(0 100% 50% / 0.4), 3px 0 hsl(180 100% 50% / 0.25)",
  },
  g4: {
    transform: "translateX(-2px) skewX(0.4deg)",
    textShadow:
      "3px 0 hsl(0 100% 50% / 0.3), -3px 0 hsl(180 100% 50% / 0.35)",
  },
};

export default function Hero({ introMode = false, onComplete }: HeroProps) {
  const [revealRef, visible] = useReveal(0.1);
  const [glitch, setGlitch] = useState("");
  const [dissolve, setDissolve] = useState(false);
  const [hidden, setHidden] = useState(false);

  const stableOnComplete = useCallback(() => onComplete?.(), [onComplete]);

  useEffect(() => {
    if (!introMode) return;

    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));

    // Two quick stutters
    t(() => setGlitch("g1"), 3400);
    t(() => setGlitch(""), 3480);
    t(() => setGlitch("g2"), 3600);
    t(() => setGlitch(""), 3700);

    // Third stutter
    t(() => setGlitch("g3"), 3950);
    t(() => setGlitch(""), 4050);

    // Pause... then one more
    t(() => setGlitch("g4"), 4550);
    t(() => setGlitch(""), 4630);

    // Accelerate
    t(() => setGlitch("g1"), 4750);
    t(() => setGlitch(""), 4810);
    t(() => setGlitch("g3"), 4860);
    t(() => setGlitch(""), 4920);
    t(() => setGlitch("g2"), 4960);
    t(() => setGlitch("g4"), 5000);
    t(() => setGlitch("g1"), 5040);

    // Dissolve
    t(() => {
      setGlitch("");
      setDissolve(true);
    }, 5100);

    // Complete after dissolution
    t(() => {
      setHidden(true);
      stableOnComplete();
    }, 5700);

    return () => ids.forEach(clearTimeout);
  }, [introMode, stableOnComplete]);

  if (hidden && introMode) return null;

  const isIntro = introMode;

  return (
    <div
      ref={!isIntro ? (revealRef as React.RefObject<HTMLDivElement>) : undefined}
      className={`min-h-screen flex flex-col items-center justify-center text-center px-8 ${
        !isIntro
          ? `transition-opacity duration-[1200ms] ${visible ? "opacity-100" : "opacity-0"}`
          : ""
      }`}
    >
      <div
        style={{
          ...(glitch ? GLITCH_STYLES[glitch] : {}),
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

        <div className="w-10 h-px bg-primary my-10" />

        <p
          className="font-display font-light italic text-body-muted max-w-[500px] mx-auto"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        >
          The books in the middle — where the storm is still deciding what it
          will destroy.
        </p>

        {!isIntro && (
          <div
            className="mt-16"
            style={{ animation: "pulse-arrow 2.5s ease-in-out infinite" }}
          >
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <path
                d="M10 0 L10 24 M3 17 L10 24 L17 17"
                stroke="hsl(30, 7%, 27%)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
