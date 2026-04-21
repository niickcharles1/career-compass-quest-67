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
    a: "Nope. Our methodology is developed by career professionals and verified by 5,000+ students to give you actionable career paths — not just labels like “you’re an introvert.”",
  },
  {
    q: "Does it cost anything?",
    a: "You can take the initial test 100% free, with no credit card required. Try it without the risk and only upgrade if you want the full deep-dive report.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We are GDPR compliant, use SSL encryption end-to-end, and we will never sell your personal information to third parties.",
  },
  {
    q: "What if my dream job isn’t in your database?",
    a: "Our algorithm covers 400+ modern career paths, including emerging roles in AI, climate, and the creator economy. If something is missing, we add it monthly.",
  },
  {
    q: "I’m already in college. Is this still useful?",
    a: "Yes. Many students take the test mid-degree to validate their direction, choose a specialisation, or discover an adjacent field that fits them better.",
  },
];

export function FAQ() {
  return (
    <section className="bg-warm py-24 md:py-32">
      <div className="container mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-3 text-balance text-4xl font-medium leading-tight md:text-5xl">
            Real questions, <span className="italic">honest</span> answers.
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-card px-6 shadow-card"
            >
              <AccordionTrigger className="py-5 text-left text-lg font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
