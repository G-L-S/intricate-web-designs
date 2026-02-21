import { useReveal } from "@/hooks/useReveal";

export default function Hero() {
  const [ref, visible] = useReveal(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`min-h-screen flex flex-col items-center justify-center text-center px-8 transition-opacity duration-[1200ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="font-body text-[0.7rem] font-normal text-dim tracking-[0.35em] uppercase mb-8">
        The March to Babylon
      </p>

      <h1
        className="font-display font-light text-foreground tracking-[0.06em] uppercase m-0"
        style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.95 }}
      >
        G.L.<br />Shephard
      </h1>

      <div className="w-10 h-px bg-primary my-10" />

      <p
        className="font-display font-light italic text-body-muted max-w-[500px]"
        style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
      >
        The books in the middle — where the storm is still deciding what it will destroy.
      </p>

      <div className="mt-16" style={{ animation: "pulse-arrow 2.5s ease-in-out infinite" }}>
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
          <path d="M10 0 L10 24 M3 17 L10 24 L17 17" stroke="hsl(30, 7%, 27%)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
