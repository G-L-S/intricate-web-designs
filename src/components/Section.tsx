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
      className={`transition-all duration-[900ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
    >
      {children}
    </section>
  );
}
