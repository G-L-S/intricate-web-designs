import Section from "./Section";

export default function Contact() {
  return (
    <Section id="contact" className="pt-32 pb-16 px-8 max-w-[500px] mx-auto text-center">
      <p className="font-body text-[0.7rem] font-normal text-dim tracking-[0.35em] uppercase mb-8">
        Contact
      </p>
      <p className="font-display text-lg font-light text-body-muted leading-[1.8] mb-8">
        For press inquiries, rights, or correspondence.
      </p>
      <a
        href="mailto:contact@themarchobabylon.com"
        className="font-body text-sm font-normal text-primary tracking-[0.08em] no-underline border-b border-primary/30 pb-0.5 transition-colors duration-300 hover:border-primary/60"
      >
        contact@themarchobabylon.com
      </a>
    </Section>
  );
}
