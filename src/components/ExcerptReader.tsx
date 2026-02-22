import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { CHAPTERS, type Block } from "@/data/excerptChapters";

interface ExcerptReaderProps {
  open: boolean;
  onClose: () => void;
}

function BlockRenderer({ block, index, prevBlock }: { block: Block; index: number; prevBlock?: Block }) {
  if (block.type === "chapter") {
    return (
      <h2
        key={index}
        className="font-display text-center mb-4 mt-4"
        style={{ color: "#1a1612", fontSize: "1.4rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "subheading") {
    return (
      <p
        key={index}
        className="font-display text-center mb-14 italic"
        style={{ color: "#1a1612", fontSize: "1.05rem", fontWeight: 350, letterSpacing: "0.06em" }}
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "break") {
    return (
      <p
        key={index}
        className="font-display text-center my-10"
        style={{ color: "#c4a35a", fontSize: "0.9rem", letterSpacing: "0.5em", fontWeight: 300 }}
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "timestamp") {
    return (
      <p
        key={index}
        className="font-display text-center my-8 italic"
        style={{ color: "#8a8279", fontSize: "0.85rem", fontWeight: 400, letterSpacing: "0.08em" }}
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "dialogue") {
    return (
      <p
        key={index}
        className="font-display mb-6 italic"
        style={{
          color: "#1a1612",
          fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
          fontWeight: 350,
          lineHeight: 1.95,
          textIndent: prevBlock && prevBlock.type === "dialogue" ? "2em" : undefined,
        }}
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "memo-heading") {
    return (
      <p
        key={index}
        className="font-display mb-4 mt-8"
        style={{ color: "#1a1612", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}
      >
        {block.text}
      </p>
    );
  }
  if (block.type === "memo-list") {
    return (
      <p
        key={index}
        className="font-display mb-4 pl-6"
        style={{
          color: "#1a1612",
          fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
          fontWeight: 350,
          lineHeight: 1.85,
          borderLeft: "2px solid #c4a35a",
          paddingLeft: "1rem",
        }}
      >
        {block.text}
      </p>
    );
  }
  // paragraph
  const shouldIndent = prevBlock && prevBlock.type === "paragraph";
  return (
    <p
      key={index}
      className="font-display mb-6"
      style={{
        color: "#1a1612",
        fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
        fontWeight: 350,
        lineHeight: 1.95,
        textIndent: shouldIndent ? "2em" : undefined,
      }}
    >
      {block.text}
    </p>
  );
}

export default function ExcerptReader({ open, onClose }: ExcerptReaderProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setActiveChapter(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else if (mounted) {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "";
      }, 500);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mounted, onClose]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) { setProgress(0); return; }
    setProgress(Math.min(el.scrollTop / scrollable, 1));

    // Detect active chapter
    const scrollTop = el.scrollTop + 100;
    for (let i = chapterRefs.current.length - 1; i >= 0; i--) {
      const ref = chapterRefs.current[i];
      if (ref && ref.offsetTop <= scrollTop) {
        setActiveChapter(i);
        break;
      }
    }
  }, []);

  const scrollToChapter = (index: number) => {
    const ref = chapterRefs.current[index];
    if (ref && scrollRef.current) {
      scrollRef.current.scrollTo({ top: ref.offsetTop - 20, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ touchAction: "none" }}>
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
          style={{ height: `${progress * 100}%`, backgroundColor: "#c4a35a", transition: "height 80ms linear" }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 z-30 font-body text-[0.65rem] tracking-[0.15em] uppercase cursor-pointer border-none bg-transparent transition-opacity duration-300"
          style={{ color: "#8a8279", opacity: 0.4 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
        >
          close
        </button>

        {/* Chapter navigation */}
        <div
          className="flex gap-1 px-4 py-3 border-b overflow-x-auto"
          style={{
            backgroundColor: "#eae4d8",
            borderColor: "#d9d2c4",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {CHAPTERS.map((ch, i) => (
            <button
              key={i}
              onClick={() => scrollToChapter(i)}
              className="font-body whitespace-nowrap px-3 py-1.5 rounded-sm text-[0.65rem] tracking-[0.12em] uppercase cursor-pointer border-none transition-all duration-200"
              style={{
                backgroundColor: activeChapter === i ? "#c4a35a" : "transparent",
                color: activeChapter === i ? "#f2ece0" : "#8a8279",
                fontWeight: activeChapter === i ? 600 : 400,
              }}
            >
              {ch.shortTitle}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 excerpt-scroll overscroll-contain"
          style={{
            backgroundColor: "#f2ece0",
            borderRadius: "0 0 2px 2px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          <style>{`.excerpt-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="px-8 sm:px-14 py-14 sm:py-20">
            {CHAPTERS.map((chapter, ci) => (
              <div key={ci} ref={(el) => { chapterRefs.current[ci] = el; }}>
                {ci > 0 && (
                  <div className="my-16 flex justify-center">
                    <div style={{ width: "60px", height: "1px", backgroundColor: "#c4a35a" }} />
                  </div>
                )}
                {chapter.blocks.map((block, bi) => (
                  <BlockRenderer
                    key={`${ci}-${bi}`}
                    block={block}
                    index={bi}
                    prevBlock={bi > 0 ? chapter.blocks[bi - 1] : undefined}
                  />
                ))}
              </div>
            ))}

            {/* End mark */}
            <p
              className="font-display text-center mt-16 mb-4"
              style={{ color: "#c4a35a", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 400 }}
            >
              End of Excerpt
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
