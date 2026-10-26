import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs: { question: string; answer: string }[] = [
  {
    question: "What is ChessVolt?",
    answer:
      "ChessVolt is a personal chess practice platform. It brings game analysis, opening training, puzzles, and curated studies into one place so you can practice what matters most to you.",
  },
  {
    question: "How do I import my games?",
    answer:
      "Just enter your Chess.com or Lichess username. ChessVolt fetches your recent games and highlights the positions where you went wrong so you can practice them.",
  },
  {
    question: "What is the Volt Tracker?",
    answer:
      "The Volt Tracker is your personal practice collection. Save games, opening variations, puzzles, and studies you want to revisit, and keep them together for your next session.",
  },
  {
    question: "What is a Volt Score?",
    answer:
      "Each saved item has a Volt Score that grows as you practice it on different days. It helps you see what you have learned well and what needs another look.",
  },
  {
    question: "Do I need to be an experienced player?",
    answer:
      "Not at all. ChessVolt works for players of every level. Whether you are learning your first openings or sharpening your tactics, you choose what to practice.",
  },
  {
    question: "Is ChessVolt free to use?",
    answer: "Yes, you can sign up and start practicing for free.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="py-20">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <header className="mb-10 text-center">
          <p className="text-muted-foreground mb-4 flex items-center justify-center gap-2 text-sm font-semibold tracking-widest uppercase sm:text-xs">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ffd04b]" />
            Frequently Asked Questions
          </p>
          <h2
            id="faq-heading"
            className="text-secondary-foreground text-[42px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[56px]"
          >
            Frequently asked <span className="text-primary">questions</span>
          </h2>
        </header>
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-secondary-foreground text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
