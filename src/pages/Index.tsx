import { useState } from "react";
import SizzleReel from "@/components/SizzleReel";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Pitch from "@/components/Pitch";
import BookShowcase from "@/components/BookShowcase";
import About from "@/components/About";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import FileDirectory from "@/components/FileDirectory";

const Index = () => {
  const [sizzleDone, setSizzleDone] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  return (
    <>
      {!sizzleDone && <SizzleReel onComplete={() => setSizzleDone(true)} />}

      <div
        className={`transition-opacity duration-1000 delay-200 ${
          sizzleDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <NavBar visible={sizzleDone} />
        <Hero />
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
