import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const mockLines = [
  { type: "h1", text: "Como Emagrecer de Forma Saudável" },
  { type: "h2", text: "Introdução" },
  { type: "p", text: "Neste e-book, você vai aprender as melhores estratégias baseadas em ciência para perder peso de forma sustentável e saudável." },
  { type: "hr" },
  { type: "h2", text: "Capítulo 1 — Entendendo o Metabolismo" },
  { type: "p", text: "O metabolismo é o conjunto de processos químicos que mantêm o corpo vivo. Entender como ele funciona é o primeiro passo..." },
  { type: "h2", text: "Capítulo 2 — Alimentação Inteligente" },
  { type: "p", text: "Não se trata de dietas restritivas, mas sim de escolhas inteligentes no dia a dia..." },
  { type: "h2", text: "Capítulo 3 — O Papel do Exercício Físico" },
  { type: "p", text: "Exercícios não servem apenas para queimar calorias. Eles regulam hormônios, melhoram o humor..." },
  { type: "h2", text: "Capítulo 4 — Mindset e Consistência" },
  { type: "p", text: "A mentalidade é o fator mais importante. Sem consistência, nenhuma estratégia funciona..." },
  { type: "h2", text: "Capítulo 5 — Plano de Ação de 30 Dias" },
  { type: "p", text: "Aqui está seu plano prático para os próximos 30 dias, com metas semanais claras..." },
];

const staggerLine = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const EbooksView = () => {
  const [topic, setTopic] = useState("");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gerador de E-books</h2>
        <p className="text-muted-foreground text-sm mt-1">Crie e-books completos com IA em segundos</p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Ex: Emagrecimento, Finanças, Marketing Digital..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-secondary/50 border-border h-11 flex-1"
        />
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant="neon" size="lg" onClick={handleGenerate} disabled={loading || !topic.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : <BookOpen className="w-4 h-4" />}
            Gerar E-book
          </Button>
        </motion.div>
      </div>

      <div className="glass rounded-xl p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[400px] gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center"
              >
                <BookOpen className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-muted-foreground text-sm">Gerando seu e-book...</p>
            </motion.div>
          ) : !generated ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-[400px] text-muted-foreground space-y-3"
            >
              <BookOpen className="w-10 h-10 opacity-30" />
              <p className="text-sm">Digite um tema e clique em &quot;Gerar E-book&quot;</p>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {mockLines.map((line, i) => (
                <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={staggerLine}>
                  {line.type === "h1" && <h1 className="text-2xl font-bold text-foreground mb-4">{line.text}</h1>}
                  {line.type === "h2" && <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">{line.text}</h2>}
                  {line.type === "p" && <p className="text-muted-foreground leading-relaxed">{line.text}</p>}
                  {line.type === "hr" && <hr className="border-border my-4" />}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EbooksView;
