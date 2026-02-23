import Section from "./Section";

export default function Pitch() {
  return (
    <Section className="py-32 px-8 max-w-[700px] mx-auto text-center">
      <p
        className="font-display font-light text-foreground italic leading-[1.8]"
        style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}
      >
        Markets rise. Countries fall. Policies shift. Leaders change. Accidents... happen. The world runs on systems most people will never question.
        <br /><br />
        Jack Mallory never questioned them — until they came for his family.
        <br /><br />
        Something vast. Hidden in plain sight. For generations, they shaped the institutions the world depends on — food, money, power — not from the outside, but from within. Quietly. Legally. Irreversibly.
        <br /><br />
        One man. One hard drive. And humanity's last stand compressed into a father's fight to protect what matters.
        <br /><br />
        They've planned for everything. Except him.
      </p>
    </Section>
  );
}
