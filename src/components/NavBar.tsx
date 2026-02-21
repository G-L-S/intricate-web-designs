import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavBarProps {
  visible: boolean;
}

const links = [
  { label: "Books", id: "books" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export default function NavBar({ visible }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[900] flex items-center justify-between transition-all duration-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
      } ${scrolled ? "backdrop-blur-xl border-b border-primary/[0.08]" : "border-b border-transparent"}`}
      style={{
        padding: scrolled ? "1rem 2.5rem" : "1.8rem 2.5rem",
        background: scrolled ? "hsla(220, 43%, 3%, 0.92)" : "transparent",
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-transparent border-none cursor-pointer font-display text-lg font-semibold text-primary tracking-[0.15em] uppercase"
      >
        G.L.S.
      </button>

      {/* Desktop links */}
      <div className="hidden sm:flex gap-10">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => scrollTo(l.id)}
            className="bg-transparent border-none cursor-pointer font-body text-xs font-normal text-body-muted tracking-[0.2em] uppercase transition-colors duration-300 hover:text-foreground"
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden bg-transparent border-none cursor-pointer text-body-muted"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col items-center gap-6 py-8 sm:hidden animate-fade-in border-b border-primary/[0.08]"
          style={{ background: "hsla(220, 43%, 3%, 0.97)" }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="bg-transparent border-none cursor-pointer font-body text-xs font-normal text-body-muted tracking-[0.2em] uppercase transition-colors duration-300 hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
