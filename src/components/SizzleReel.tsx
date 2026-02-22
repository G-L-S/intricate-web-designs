import { useState, useEffect, useRef, useCallback } from "react";

const PHRASES = [
  { text: "...seeds were sown.", hold: 2200 },
  { text: "Threshed and winnowed.", hold: 2000 },
  { text: "Cast off the chaff.", hold: 2000 },
  { text: "The Harvest is coming.", hold: 1800 },
];

interface SizzleReelProps {
  onComplete: () => void;
}

export default function SizzleReel({ onComplete }: SizzleReelProps) {
  const [phase, setPhase] = useState(-1);
  const [textVis, setTextVis] = useState(false);
  const [fading, setFading] = useState(false);
  const skipRef = useRef(false);

  const skip = useCallback(() => {
    if (skipRef.current) return;
    skipRef.current = true;
    setFading(true);
    setTimeout(onComplete, 800);
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      await wait(1200);
      for (let i = 0; i < PHRASES.length; i++) {
        if (cancelled || skipRef.current) return;
        setPhase(i);
        setTextVis(true);
        await wait(PHRASES[i].hold);
        if (cancelled || skipRef.current) return;
        setTextVis(false);
        await wait(500);
      }
      if (cancelled || skipRef.current) return;
      setPhase(10);
      setTextVis(true);
      await wait(3200);
      if (cancelled || skipRef.current) return;
      setPhase(11);
      await wait(2400);
      if (cancelled || skipRef.current) return;
      skip();
    })();

    return () => { cancelled = true; };
  }, [skip]);

  const isTitle = phase === 10 || phase === 11;

  return (
    <div
      onClick={skip}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-[800ms]"
      style={{
        background: "#000",
        opacity: fading ? 0 : 1,
      }}
    >
      {phase >= 0 && phase < 10 && (
        <p
          className="font-display text-foreground font-light italic tracking-wide text-center px-8 transition-all duration-700 ease-out"
          style={{
            fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
            opacity: textVis ? 1 : 0,
            transform: textVis ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
          }}
        >
          {PHRASES[phase]?.text}
        </p>
      )}

      {isTitle && (
        <div
          className="text-center transition-all duration-1000 ease-out"
          style={{
            opacity: textVis ? 1 : 0,
            transform: textVis ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <h1
            className="font-display font-semibold text-primary tracking-[0.12em] uppercase m-0"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.2rem)" }}
          >
            Babylon's Harvest
          </h1>
          <p className="font-body font-light tracking-[0.3em] uppercase mt-5 transition-opacity duration-700"
            style={{
              fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
              opacity: phase === 11 ? 1 : 0,
              color: "hsl(var(--body-muted))",
            }}
          >
            G.L. Shephard
          </p>
        </div>
      )}

      <span className="absolute bottom-8 right-10 font-body text-[0.7rem] text-dim tracking-[0.15em] uppercase">
        Click to skip
      </span>
    </div>
  );
}
