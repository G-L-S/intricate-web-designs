import { useState } from "react";
import Section from "./Section";
import ExcerptReader from "./ExcerptReader";

const BOOKS = {
  harvest: {
    title: "Babylon's Harvest",
    status: "Available Now",
    tagline: "The first book in The March to Babylon series",
    synopsis: `In the shadow of boardrooms that decide what the world eats, one man stumbles onto the architecture of control — a conspiracy woven into the very seeds planted in American soil. What begins as a career in agricultural policy becomes a desperate flight when he realizes the ledger he's kept could dismantle everything they've built. But they know he has it. And the only thing standing between his family and erasure is his willingness to keep moving.`,
    themes: ["Corporate consolidation", "Genetic sovereignty", "The cost of knowing"],
    isTeaser: false,
  },
  ledger: {
    title: "Babylon's Ledger",
    status: "Coming Soon",
    tagline: "The second book in The March to Babylon series",
    synopsis: `The money was never about money. When the trail from Babylon's Harvest leads into the architecture of the global monetary order, the stakes shift from one man's survival to the machinery that keeps nations in debt and populations compliant. The shepherd is still running — but now he understands the size of the field.`,
    themes: ["Monetary control", "Sovereign debt architecture", "The next domino"],
    isTeaser: true,
  },
};

type BookKey = keyof typeof BOOKS;

export default function BookShowcase() {
  const [active, setActive] = useState<BookKey>("harvest");
  const [excerptOpen, setExcerptOpen] = useState(false);
  const book = BOOKS[active];

  return (
    <Section id="books" className="py-24 px-4 sm:px-8 max-w-[900px] mx-auto">
      <p className="font-body text-[0.7rem] font-normal text-dim tracking-[0.35em] uppercase text-center mb-12">
        The Series
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-16 flex-wrap">
        {(Object.entries(BOOKS) as [BookKey, typeof BOOKS[BookKey]][]).map(([key, b]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`font-display tracking-[0.05em] text-base px-8 py-3 rounded-sm cursor-pointer transition-all duration-300 ${
              active === key
                ? "bg-primary/[0.08] border border-primary/25 font-semibold text-primary"
                : "bg-transparent border border-body-muted/15 font-normal text-body-muted hover:text-foreground"
            }`}
          >
            {b.title}
          </button>
        ))}
      </div>

      {/* Book detail card */}
      <div className="border border-primary/10 rounded-sm bg-card/60 relative overflow-hidden"
        style={{ padding: "clamp(2rem, 5vw, 4rem)" }}
      >
        {/* Status badge */}
        <div
          className={`absolute top-6 right-6 font-body text-[0.6rem] font-medium tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm border ${
            book.isTeaser
              ? "text-body-muted border-body-muted/20"
              : "text-primary border-primary/20"
          }`}
        >
          {book.status}
        </div>

        <h2
          className="font-display font-light text-foreground tracking-[0.04em] mb-2"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
        >
          {book.title}
        </h2>
        <p className="font-body text-xs font-light text-accent tracking-[0.1em] mb-10">
          {book.tagline}
        </p>

        {/* Cover placeholder */}
        <div
          className={`w-full max-w-[220px] mx-auto mb-4 flex items-center justify-center rounded-sm ${
            book.isTeaser ? "border-body-muted/10" : "border-primary/[0.12]"
          } border`}
          style={{
            aspectRatio: "2/3",
            background: book.isTeaser
              ? "repeating-linear-gradient(0deg, hsla(40,7%,51%,0.03) 0px, hsla(40,7%,51%,0.03) 2px, transparent 2px, transparent 12px)"
              : "linear-gradient(145deg, hsla(215,48%,25%,0.3), hsla(215,32%,7%,0.8))",
          }}
        >
          <span className={`font-display text-sm italic ${book.isTeaser ? "text-dim" : "text-accent"}`}>
            {book.isTeaser ? "[ Classified ]" : "Cover forthcoming"}
          </span>
        </div>

        {/* Synopsis */}
        <p
          className={`font-display font-light leading-[1.85] mt-6 ${
            book.isTeaser ? "text-accent blur-[0.5px] select-none" : "text-synopsis"
          }`}
          style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)" }}
        >
          {book.synopsis}
        </p>

        {/* Themes */}
        <div className="flex flex-wrap gap-2.5 mt-8">
          {book.themes.map((t) => (
            <span
              key={t}
              className="font-body text-[0.65rem] font-normal text-accent tracking-[0.1em] px-3 py-1.5 border border-body-muted/[0.12] rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTAs */}
        {!book.isTeaser && (
          <div className="mt-10 flex gap-4 flex-wrap">
            <button
              onClick={() => setExcerptOpen(true)}
              className="bg-primary/10 border border-primary/30 rounded-sm px-8 py-3.5 font-body text-[0.7rem] font-medium text-primary tracking-[0.18em] uppercase cursor-pointer transition-all duration-300 hover:bg-primary/[0.18]"
            >
              Read an Excerpt
            </button>
            <button className="bg-transparent border border-body-muted/20 rounded-sm px-8 py-3.5 font-body text-[0.7rem] font-normal text-body-muted tracking-[0.18em] uppercase cursor-pointer transition-colors duration-300 hover:text-foreground">
              Order Now
            </button>
          </div>
        )}

        {book.isTeaser && (
          <p className="font-body text-[0.7rem] font-light text-dim tracking-[0.1em] mt-10 italic">
            Release details to follow. The trail continues.
          </p>
        )}
      </div>
      <ExcerptReader open={excerptOpen} onClose={() => setExcerptOpen(false)} />
    </Section>
  );
}
