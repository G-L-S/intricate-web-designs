import { useState } from "react";

interface SiteFooterProps {
  onEasterEgg: () => void;
}

export default function SiteFooter({ onEasterEgg }: SiteFooterProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <footer className="pt-16 pb-12 px-8 border-t border-body-muted/[0.06] text-center">
      <p className="font-body text-[0.65rem] text-deep tracking-[0.1em] mb-6">
        © 2025 G.L. Shephard. All rights reserved.
      </p>
      <button
        onClick={onEasterEgg}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-transparent border-none cursor-default font-mono text-[0.55rem] tracking-[0.15em] p-2 transition-colors duration-[600ms]"
        style={{ color: hovered ? "hsl(93, 17%, 30%)" : "hsl(34, 7%, 10%)" }}
      >
        REF: BH-7742-SIGMA
      </button>
    </footer>
  );
}
