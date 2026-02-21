import Section from "./Section";

export default function Pitch() {
  return (
    <Section className="py-32 px-8 max-w-[700px] mx-auto text-center">
      <p
        className="font-display font-light text-foreground italic leading-[1.8]"
        style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}
      >
        Most thrillers start at the explosion or end at the rescue.
        These books live in the space between — the middle of the
        storm, where a man with a family and a conscience has to
        decide what he's willing to lose to protect what matters.
      </p>
    </Section>
  );
}
