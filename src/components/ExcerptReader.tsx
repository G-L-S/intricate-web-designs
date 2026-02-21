import { useEffect, useRef, useState, useCallback } from "react";

const EXCERPT = [
  {
    type: "heading" as const,
    text: "Chapter One — The Ledger",
  },
  {
    type: "paragraph" as const,
    text: `He found it on a Tuesday. Not buried in a vault or sealed behind classified headers — just sitting in a lateral file cabinet in the basement of the USDA's Economic Research wing, misfiled between a soybean subsidy audit and a water-table projection from 2014. A plain manila folder, slightly warped from humidity, with no label on the tab.`,
  },
  {
    type: "paragraph" as const,
    text: `Inside were eleven pages of single-spaced type. No letterhead, no signatures. Just columns — company names on the left, acreage on the right, and a third column he didn't recognize at first. It took him three readings to understand what he was looking at: a schedule of seed patent transfers, cross-referenced against land acquisitions in nine states, all dated within the same fiscal quarter. The numbers were too clean. The pattern was too deliberate.`,
  },
  {
    type: "break" as const,
    text: "• • •",
  },
  {
    type: "paragraph" as const,
    text: `Marcus Sable had worked in agricultural policy for eleven years. He had a talent for tedium — the kind of man who could read a three-hundred-page farm bill and find the paragraph that mattered. His colleagues admired this the way one admires a useful machine. He was not invited to dinners. He was invited to review sessions. He had made peace with this.`,
  },
  {
    type: "paragraph" as const,
    text: `But the document in his hands was not tedium. It was architecture. Someone had designed a system for consolidating genetic control over the American food supply, and they had done it so quietly that it looked like weather — like something that had simply happened, season after season, while everyone was arguing about subsidies and ethanol mandates.`,
  },
  {
    type: "paragraph" as const,
    text: `He photocopied the eleven pages. He put the originals back. He walked upstairs, badged through the turnstile, nodded at the guard, and stepped into the pale November light on Independence Avenue. The wind pressed his tie flat against his chest and he stood there for a moment, blinking, trying to understand why the street looked different.`,
  },
  {
    type: "break" as const,
    text: "• • •",
  },
  {
    type: "paragraph" as const,
    text: `It didn't look different, of course. The street was the same. The cars were the same. The woman selling coffee from the cart on the corner was the same woman who had been there every morning for three years. What had changed was the frame — the invisible scaffolding behind everything he thought he understood about how food moved from soil to shelf. He had assumed it was a market. He was beginning to suspect it was a mechanism.`,
  },
  {
    type: "paragraph" as const,
    text: `That night he sat at his kitchen table with the photocopies spread in front of him and a glass of bourbon he forgot to drink. His wife asked him what was wrong and he said "nothing" in a tone that made her leave the room. He traced the columns with his index finger. Nine states. Fourteen companies. One pattern. And at the center of it, a name he had seen before but never thought to question — a holding company registered in Wilmington, Delaware, with no public officers and no website, appearing in footnotes across a decade of filings like a thread stitched through the lining of a coat.`,
  },
  {
    type: "paragraph" as const,
    text: `He wrote the name on a Post-it note and stuck it to the edge of his monitor the next morning. He told himself he would look into it when he had time. He told himself it was probably nothing. He told himself a lot of things that week. None of them turned out to be true.`,
  },
];

interface ExcerptReaderProps {
  open: boolean;
  onClose: () => void;
}

export default function ExcerptReader({ open, onClose }: ExcerptReaderProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mount/unmount with animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else if (mounted) {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "";
      }, 500); // match longest animation duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mounted, onClose]);

  // Scroll progress
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) { setProgress(0); return; }
    setProgress(Math.min(el.scrollTop / scrollable, 1));
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ touchAction: "none" }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-[400ms]"
        style={{
          backgroundColor: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-[92vw] max-w-[680px] h-[82vh] sm:h-auto sm:max-h-[88vh] flex flex-col"
        style={{
          transition: "opacity 500ms ease-out, transform 500ms ease-out",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          boxShadow: "0 25px 80px -12px rgba(0,0,0,0.6), 0 8px 24px -8px rgba(0,0,0,0.4)",
          borderRadius: "2px",
        }}
      >
        {/* Gold progress line */}
        <div
          className="absolute left-0 top-0 w-[2px] origin-top z-20"
          style={{
            height: `${progress * 100}%`,
            backgroundColor: "#c4a35a",
            transition: "height 80ms linear",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 z-30 font-body text-[0.65rem] tracking-[0.15em] uppercase cursor-pointer border-none bg-transparent transition-opacity duration-300"
          style={{
            color: "#8a8279",
            opacity: 0.4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
        >
          close
        </button>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 excerpt-scroll overscroll-contain"
          style={{
            backgroundColor: "#f2ece0",
            borderRadius: "2px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          <style>{`
            .excerpt-scroll::-webkit-scrollbar { display: none; }
          `}</style>
          <div
            className="px-8 sm:px-14 py-14 sm:py-20"
          >
            {EXCERPT.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <p
                    key={i}
                    className="font-display text-center mb-12"
                    style={{
                      color: "#1a1612",
                      fontSize: "0.75rem",
                      fontWeight: 400,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                    }}
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "break") {
                return (
                  <p
                    key={i}
                    className="font-display text-center my-10"
                    style={{
                      color: "#c4a35a",
                      fontSize: "0.9rem",
                      letterSpacing: "0.5em",
                      fontWeight: 300,
                    }}
                  >
                    {block.text}
                  </p>
                );
              }
              return (
                <p
                  key={i}
                  className="font-display mb-6"
                  style={{
                    color: "#1a1612",
                    fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                    fontWeight: 350,
                    lineHeight: 1.95,
                    textIndent: i > 0 && EXCERPT[i - 1]?.type !== "break" && EXCERPT[i - 1]?.type !== "heading" ? "2em" : undefined,
                  }}
                >
                  {block.text}
                </p>
              );
            })}

            {/* End mark */}
            <p
              className="font-display text-center mt-16 mb-4"
              style={{
                color: "#c4a35a",
                fontSize: "0.7rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              End of Excerpt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
