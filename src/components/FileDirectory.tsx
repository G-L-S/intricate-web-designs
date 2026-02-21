import { useState, useEffect } from "react";

interface FileEntry {
  filename: string;
  title: string;
  date: string;
  size: string;
  type: string;
  classified: boolean;
  description: string;
}

type SortField = "title" | "date" | "size" | "type";
type SortDir = "asc" | "desc";

function parseSize(s: string): number {
  const match = s.match(/([\d.]+)\s*(KB|MB|GB)/i);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "GB") return val * 1e9;
  if (unit === "MB") return val * 1e6;
  return val * 1e3;
}

function sortFiles(files: FileEntry[], field: SortField, dir: SortDir): FileEntry[] {
  const sorted = [...files].sort((a, b) => {
    if (field === "size") return parseSize(a.size) - parseSize(b.size);
    if (field === "date") return new Date(a.date).getTime() - new Date(b.date).getTime();
    return a[field].localeCompare(b[field]);
  });
  return dir === "desc" ? sorted.reverse() : sorted;
}

interface FileDirectoryProps {
  onClose: () => void;
}

export default function FileDirectory({ onClose }: FileDirectoryProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/files/manifest.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load manifest");
        return r.json();
      })
      .then((data: FileEntry[]) => {
        setFiles(data.filter((f) => !f.classified));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleOpen = (file: FileEntry) => {
    setSelectedFile(file);
    setTextContent(null);

    if (file.type === "text") {
      fetch(`/files/${file.filename}`)
        .then((r) => {
          if (!r.ok) throw new Error("File not found");
          return r.text();
        })
        .then(setTextContent)
        .catch(() => setTextContent("Error: Could not load file."));
    }
  };

  const sortedFiles = sortFiles(files, sortField, sortDir);
  const arrow = sortDir === "asc" ? "▲" : "▼";

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="bg-transparent border-none text-terminal-dim font-mono text-[0.65rem] tracking-[0.08em] cursor-pointer hover:text-terminal-green transition-colors p-0 flex items-center gap-1"
    >
      {label}
      {sortField === field && (
        <span className="text-terminal-green text-[0.55rem]">{arrow}</span>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center animate-fade-in p-4">
      <div className="w-full max-w-[720px] max-h-[85vh] overflow-auto bg-card border border-primary/[0.12] rounded-sm font-mono text-sm text-terminal-green p-6 sm:p-8">
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

        {loading && (
          <p className="text-terminal-dim text-xs animate-pulse">Loading manifest...</p>
        )}

        {error && (
          <p className="text-red-400 text-xs">ERROR: {error}</p>
        )}

        {!loading && !error && !selectedFile && (
          <div>
            <p className="text-terminal-deep mb-4 text-xs">
              {sortedFiles.length} file(s) — last modified{" "}
              {sortedFiles.length > 0
                ? [...files].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
                : "N/A"}
            </p>

            {/* Sort controls */}
            <div className="grid grid-cols-[1fr_80px_60px_60px] sm:grid-cols-[1fr_100px_80px_70px] gap-2 mb-3 pb-2 border-b border-terminal-green/10">
              <SortHeader field="title" label="NAME" />
              <SortHeader field="date" label="DATE" />
              <SortHeader field="size" label="SIZE" />
              <SortHeader field="type" label="TYPE" />
            </div>

            {/* File list */}
            {sortedFiles.map((f) => (
              <div
                key={f.filename}
                onClick={() => handleOpen(f)}
                className="grid grid-cols-[1fr_80px_60px_60px] sm:grid-cols-[1fr_100px_80px_70px] gap-2 py-3 border-b border-terminal-green/[0.06] cursor-pointer transition-colors duration-200 hover:text-[hsl(93,30%,70%)] items-center"
              >
                <span className="truncate text-xs sm:text-sm">📄 {f.title}</span>
                <span className="text-terminal-deep text-[0.65rem]">{f.date}</span>
                <span className="text-terminal-deep text-[0.65rem]">{f.size}</span>
                <span className="text-terminal-deep text-[0.65rem] uppercase">{f.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* File viewer */}
        {selectedFile && (
          <div>
            <button
              onClick={() => setSelectedFile(null)}
              className="bg-transparent border-none text-terminal-dim font-mono text-xs cursor-pointer mb-4 p-0 hover:text-terminal-green transition-colors"
            >
              ← back
            </button>

            <div className="mb-4 border-b border-terminal-green/10 pb-3">
              <p className="text-terminal-green text-sm mb-1">{selectedFile.title}</p>
              <p className="text-terminal-deep text-[0.65rem]">
                {selectedFile.filename} — {selectedFile.size} — {selectedFile.date}
              </p>
              {selectedFile.description && (
                <p className="text-terminal-dim text-xs mt-2 leading-relaxed">
                  {selectedFile.description}
                </p>
              )}
            </div>

            {/* Text file inline viewer */}
            {selectedFile.type === "text" && (
              <pre className="whitespace-pre-wrap leading-[1.7] text-[hsl(93,20%,60%)] text-xs sm:text-sm">
                {textContent ?? "Loading..."}
              </pre>
            )}

            {/* PDF viewer */}
            {selectedFile.type === "pdf" && (
              <div className="mt-2">
                <iframe
                  src={`/files/${selectedFile.filename}`}
                  className="w-full h-[60vh] border border-terminal-green/10 rounded-sm bg-white"
                  title={selectedFile.title}
                />
                <a
                  href={`/files/${selectedFile.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-terminal-dim text-[0.7rem] border border-terminal-green/20 px-3 py-1 rounded-sm hover:text-terminal-green transition-colors"
                >
                  [OPEN IN NEW TAB]
                </a>
              </div>
            )}

            {/* Image viewer */}
            {selectedFile.type === "image" && (
              <div className="mt-2">
                <img
                  src={`/files/${selectedFile.filename}`}
                  alt={selectedFile.title}
                  className="max-w-full border border-terminal-green/10 rounded-sm"
                />
              </div>
            )}

            {/* Download fallback for other types */}
            {!["text", "pdf", "image"].includes(selectedFile.type) && (
              <a
                href={`/files/${selectedFile.filename}`}
                download
                className="inline-block mt-2 text-terminal-dim text-[0.7rem] border border-terminal-green/20 px-3 py-1 rounded-sm hover:text-terminal-green transition-colors"
              >
                [DOWNLOAD]
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
