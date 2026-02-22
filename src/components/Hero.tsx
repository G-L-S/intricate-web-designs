import { useState, useEffect, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

interface HeroProps {
  introMode?: boolean;
  onComplete?: () => void;
  skipReveal?: boolean;
}

const SHAKE_STYLES: Record<string, React.CSSProperties> = {
  left: { transform: "translateX(-9px)" },
  right: { transform: "translateX(9px)" },
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
  const [activeStyle, setActiveStyle] = useState<React.CSSProperties>({});
  const [dissolve, setDissolve] = useState(false);
  const [hidden, setHidden] = useState(false);

  const stableOnComplete = useCallback(() => onComplete?.(), [onComplete]);

  useEffect(() => {
    if (!introMode) return;

    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));

    // ~750ms stillness, then two firm knocks
    t(() => setActiveStyle(SHAKE_STYLES.left), 750);
    t(() => setActiveStyle({}), 830);
    t(() => setActiveStyle(SHAKE_STYLES.right), 870);
    t(() => setActiveStyle({}), 950);

    // 200ms pause, then glitch acceleration at ~1150ms
    t(() => setActiveStyle(GLITCH_STYLES.g1), 1150);
    t(() => setActiveStyle({}), 1190);
    t(() => setActiveStyle(GLITCH_STYLES.g2), 1250);
    t(() => setActiveStyle({}), 1300);

    t(() => setActiveStyle(GLITCH_STYLES.g3), 1425);
    t(() => setActiveStyle({}), 1475);

    t(() => setActiveStyle(GLITCH_STYLES.g4), 1725);
    t(() => setActiveStyle({}), 1765);

    // Accelerate
    t(() => setActiveStyle(GLITCH_STYLES.g1), 1825);
    t(() => setActiveStyle({}), 1855);
    t(() => setActiveStyle(GLITCH_STYLES.g3), 1880);
    t(() => setActiveStyle({}), 1910);
    t(() => setActiveStyle(GLITCH_STYLES.g2), 1930);
    t(() => setActiveStyle(GLITCH_STYLES.g4), 1950);
    t(() => setActiveStyle(GLITCH_STYLES.g1), 1970);

    // Dissolve
    t(() => {
      setActiveStyle({});
      setDissolve(true);
    }, 2000);

    t(() => {
      setHidden(true);
      stableOnComplete();
    }, 2600);

    return () => ids.forEach(clearTimeout);
  }, [introMode, stableOnComplete]);

  if (hidden && introMode) return null;

  const isIntro = introMode;
  const showRevealAnim = !isIntro && !skipReveal;

  return (
    <div
      ref={showRevealAnim ? (revealRef as React.RefObject<HTMLDivElement>) : undefined}
      className={`min-h-screen flex flex-col items-center justify-center text-center px-8 ${
        showRevealAnim
          ? `transition-opacity duration-[1200ms] ${visible ? "opacity-100" : "opacity-0"}`
          : ""
      }`}
    >
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
