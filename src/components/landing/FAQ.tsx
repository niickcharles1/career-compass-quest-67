import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this just another personality test?",
    a: "No. Personality tests give you a label. We give you a decision framework with real numbers — salary curves, market data, lifestyle trade-offs — built with 47 career consultants and verified against 5,000+ real student outcomes.",
  },
  {
    q: "How is this different from a career advisor?",
    a: "Career advisors are slow, generic, and biased toward whatever they know. Your Choice is structured, personalised, and unbiased — you get a comparison engine in 5 minutes, not a 30-minute slot in three weeks.",
  },
  {
    q: "Does it actually cost anything?",
    a: "The structured assessment and your top 3 paths are free. The deep-dive comparison report (10-year projections, full skill stacks, side-by-side comparisons across all 12 dimensions) is a one-time upgrade.",
  },
  {
    q: "What if my path isn't in your database?",
    a: "We map 400+ careers, including emerging roles in AI, climate, and the creator economy. If something is missing, our consultants add it monthly — and our scoring still places you near adjacent paths.",
  },
  {
    q: "I'm already in college. Is this still useful?",
    a: "Yes. Many students take it mid-degree to pressure-test their choice, pick a specialisation, or spot an adjacent path that fits better. The comparison engine works for any decision, not just the first one.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. GDPR compliant, SSL encrypted end-to-end, and we never sell your data. You can delete your profile at any time.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-b border-border bg-mist py-24 md:py-32">
      <div className="container mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-electric">
            FAQ
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl leading-[1.05] md:text-5xl">
            Honest answers. No fluff.
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-12 space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="overflow-hidden rounded-lg border border-border bg-card px-5 shadow-card"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
