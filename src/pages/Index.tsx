import { useState, useCallback } from "react";
import SizzleReel from "@/components/SizzleReel";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Pitch from "@/components/Pitch";
import BookShowcase from "@/components/BookShowcase";
import About from "@/components/About";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import FileDirectory from "@/components/FileDirectory";

type Phase = "intro" | "sizzle" | "main";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [showFiles, setShowFiles] = useState(false);

  const handleIntroDone = useCallback(() => setPhase("sizzle"), []);
  const handleSizzleDone = useCallback(() => setPhase("main"), []);

  return (
    <>
      {phase === "intro" && (
        <Hero introMode onComplete={handleIntroDone} />
      )}

      {phase === "sizzle" && (
        <SizzleReel onComplete={handleSizzleDone} />
      )}

      <div
        className={`transition-opacity duration-1000 delay-200 ${
          phase === "main" ? "opacity-100" : "opacity-0 pointer-events-none fixed inset-0"
        }`}
      >
        <NavBar visible={phase === "main"} />
        {phase !== "intro" && <Hero skipReveal />}
        <Pitch />
        <BookShowcase />
        <About />
        <Contact />
        <SiteFooter onEasterEgg={() => setShowFiles(true)} />
      </div>

      {showFiles && <FileDirectory onClose={() => setShowFiles(false)} />}
    </>
  );
};

export default Index;
