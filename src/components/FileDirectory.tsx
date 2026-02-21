import { useState } from "react";

const FILES = [
  {
    name: "field_notes_midwest_q3.txt",
    date: "2024-09-14",
    size: "4.2 KB",
    content: `FIELD NOTES — MIDWEST CORRIDOR
September 2024

Three counties. Same pattern. Independent seed suppliers 
shut out of regional contracts within 18 months of the 
new certification requirements. Certification board has 
four members. Three have direct ties to [REDACTED].

The soil samples from Harlan County don't match the 
reported amendment schedule. Someone is applying compounds 
not listed in the regulatory filings.

Follow up: the Moreno family. They stopped returning calls 
in August. Neighbor says they sold. No public record of sale.

— G.L.S.`,
  },
  {
    name: "timeline_draft_v4.txt",
    date: "2024-11-02",
    size: "1.8 KB",
    content: `TIMELINE — CONSOLIDATION PATTERN

1996 — First patent approval on modified grain variant
1998 — Subsidiary acquisition of 3 regional distributors  
2001 — Lobbying spend triples. New "safety" certification
2003 — Independent suppliers: 340 → 187 (45% reduction)
2007 — Legislative rider attached to farm bill (pg. 847)
2011 — Antitrust inquiry opened. Closed 9 months later.
2014 — [DATA MISSING]
2019 — Market share reaches critical threshold
2023 — "Voluntary" compliance framework announced

Note: The gap in 2014 is not an accident. Three FOIA 
requests returned fully redacted documents.

— G.L.S.`,
  },
  {
    name: "README.txt",
    date: "2024-12-01",
    size: "0.3 KB",
    content: `If you found this, you're paying attention.

These are the notes behind the fiction. Names are changed. 
Dates are shifted. But the patterns are real.

Do your own research. Start with the seed patents.

— G.L.S.`,
  },
];

interface FileDirectoryProps {
  onClose: () => void;
}

export default function FileDirectory({ onClose }: FileDirectoryProps) {
  const [openFile, setOpenFile] = useState<typeof FILES[number] | null>(null);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center animate-fade-in p-4">
      <div className="w-full max-w-[640px] max-h-[80vh] overflow-auto bg-card border border-primary/[0.12] rounded-sm font-mono text-sm text-terminal-green p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-terminal-green/15 pb-4">
          <span className="text-terminal-dim text-xs sm:text-sm break-all">
            /shephard/research/babylon-harvest/
          </span>
          <button
            onClick={onClose}
            className="bg-transparent border border-terminal-green/20 text-terminal-dim px-3 py-1 font-mono text-[0.7rem] cursor-pointer rounded-sm hover:text-terminal-green transition-colors shrink-0 ml-4"
          >
            [CLOSE]
          </button>
        </div>

        {!openFile ? (
          <div>
            <p className="text-terminal-deep mb-5 text-xs">
              3 file(s) — last modified 2024-12-01
            </p>
            {FILES.map((f) => (
              <div
                key={f.name}
                onClick={() => setOpenFile(f)}
                className="py-3 border-b border-terminal-green/[0.06] cursor-pointer flex justify-between items-center transition-colors duration-200 hover:text-[hsl(93,30%,70%)] gap-4"
              >
                <span className="truncate">📄 {f.name}</span>
                <span className="text-terminal-deep text-[0.7rem] shrink-0">
                  {f.size} — {f.date}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setOpenFile(null)}
              className="bg-transparent border-none text-terminal-dim font-mono text-xs cursor-pointer mb-4 p-0 hover:text-terminal-green transition-colors"
            >
              ← back
            </button>
            <p className="text-terminal-deep text-[0.7rem] mb-4">
              {openFile.name} — {openFile.size}
            </p>
            <pre className="whitespace-pre-wrap leading-[1.7] text-[hsl(93,20%,60%)] text-xs sm:text-sm">
              {openFile.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
