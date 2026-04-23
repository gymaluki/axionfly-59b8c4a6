import { AIBuilderPicker } from "@/components/AIBuilderPicker";

const samplePrompt =
  "Crie um site institucional moderno para uma empresa de tecnologia chamada AxionFly, com hero, lista de features, depoimentos e formulário de contato.";

/**
 * Página isolada renderizada dentro de um iframe pela página /qa-grid.
 * Mantém o picker sempre aberto para inspeção do layout em larguras reais.
 */
const QAGridFrame = () => {
  return (
    <div className="min-h-screen bg-background">
      <AIBuilderPicker open onClose={() => {}} prompt={samplePrompt} />
    </div>
  );
};

export default QAGridFrame;
