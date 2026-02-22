import { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, children, className = "" }: SectionProps) {
  const [ref, visible] = useReveal(0.12);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={`transition-opacity duration-[900ms] ease-out ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </section>
  );
}
