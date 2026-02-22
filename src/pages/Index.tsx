import { useState, useCallback, useEffect } from "react";
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
  const [heroVisible, setHeroVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleIntroDone = useCallback(() => setPhase("sizzle"), []);
  const handleSizzleDone = useCallback(() => setPhase("main"), []);

  useEffect(() => {
    if (phase !== "main") return;
    const t1 = setTimeout(() => setHeroVisible(true), 200);
    const t2 = setTimeout(() => setContentVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  return (
    <>
      {phase === "intro" && (
        <Hero introMode onComplete={handleIntroDone} />
      )}

      {phase === "sizzle" && (
        <SizzleReel onComplete={handleSizzleDone} />
      )}

      {phase === "main" && (
        <>
          <div
            className="transition-opacity duration-[600ms] ease-out"
            style={{ opacity: heroVisible ? 1 : 0 }}
          >
            <Hero skipReveal />
          </div>

          <div
            className="transition-opacity duration-[600ms] ease-out"
            style={{ opacity: contentVisible ? 1 : 0 }}
          >
            <NavBar visible={contentVisible} />
            <Pitch />
            <BookShowcase />
            <About />
            <Contact />
            <SiteFooter onEasterEgg={() => setShowFiles(true)} />
          </div>
        </>
      )}

      {showFiles && <FileDirectory onClose={() => setShowFiles(false)} />}
    </>
  );
};

export default Index;
