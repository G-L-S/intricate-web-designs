import Section from "./Section";

export default function About() {
  return (
    <Section id="about" className="py-40 px-8 max-w-[620px] mx-auto text-center">
      <p className="font-body text-[0.7rem] font-normal text-dim tracking-[0.35em] uppercase mb-12">
        About the Author
      </p>
      <div className="font-display font-light text-synopsis italic leading-[2]"
        style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)" }}
      >
        <p>
          I write about the moments most people skip — the space between
          the first warning and the last chance. The middle of the storm,
          where ordinary men make impossible choices for the people they love.
        </p>
        <p className="mt-6">
          I write under this name because the work matters more than the writer.
          I have no interest in fame, interviews, or the machinery of public life.
        </p>
        <p className="mt-6">
          If you've found your way here, you're the reason I write.
          Read carefully. Trust your instincts. And when the story starts
          feeling a little too familiar — keep reading.
        </p>
        <p className="mt-10 not-italic font-semibold text-primary text-base tracking-[0.08em]">
          — G.L.S.
        </p>
      </div>
    </Section>
  );
}
