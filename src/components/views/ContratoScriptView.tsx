import { useState } from "react";
import { FileText, MessageSquare, Copy, Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

const contratoTemplate = (dados: {
  nomeCliente: string;
  nomeEmpresa: string;
  valor: string;
  descricao: string;
  prazo: string;
}) => `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO WEB

CONTRATANTE: ${dados.nomeCliente}
CONTRATADO(A): ${dados.nomeEmpresa}

1. OBJETO DO CONTRATO
O presente contrato tem por objeto a prestação de serviços de desenvolvimento de website profissional, conforme descrito abaixo:

Descrição do serviço: ${dados.descricao || "Criação de site institucional responsivo com design moderno"}

2. VALOR E FORMA DE PAGAMENTO
Valor total: R$ ${dados.valor}
Forma de pagamento: 50% na assinatura do contrato e 50% na entrega final.

3. PRAZO DE ENTREGA
O prazo de entrega é de ${dados.prazo || "7 dias úteis"} a contar da data de assinatura deste contrato e recebimento do conteúdo necessário.

4. OBRIGAÇÕES DO CONTRATANTE
- Fornecer todo o conteúdo necessário (textos, imagens, logotipo) dentro de 3 dias úteis;
- Realizar o pagamento nas condições acordadas;
- Fornecer feedback dentro de 48h após cada entrega parcial.

5. OBRIGAÇÕES DO CONTRATADO
- Desenvolver o site conforme especificações acordadas;
- Entregar o projeto dentro do prazo estipulado;
- Realizar até 2 (duas) rodadas de revisão sem custo adicional;
- Fornecer suporte técnico por 30 dias após a entrega.

6. PROPRIEDADE INTELECTUAL
Após o pagamento integral, todos os direitos sobre o site serão transferidos ao CONTRATANTE.

7. RESCISÃO
Em caso de cancelamento pelo CONTRATANTE, o valor já pago não será devolvido. Em caso de atraso do CONTRATADO superior a 15 dias, o CONTRATANTE pode rescindir com devolução integral.

8. FORO
Fica eleito o foro da comarca do CONTRATANTE para dirimir quaisquer dúvidas.

Data: ${new Date().toLocaleDateString("pt-BR")}

_______________________________
${dados.nomeCliente} - CONTRATANTE

_______________________________
${dados.nomeEmpresa} - CONTRATADO(A)`;

interface ScriptItem {
  titulo: string;
  mensagens: string[];
}

const scriptsVendas: ScriptItem[] = [
  {
    titulo: "Primeira abordagem (quebra-gelo)",
    mensagens: [
      "Oi, {nome}! Tudo bem? 😊 Me chamo [seu nome], vi o perfil da {empresa} e achei muito bacana o trabalho de vocês!",
      "Eu ajudo negócios como o seu a atrair mais clientes pela internet com um site profissional. Já pensou em ter uma presença online que realmente traz resultado?",
      "Posso te mostrar como ficaria um site pra {empresa}, sem compromisso nenhum! O que acha?",
    ],
  },
  {
    titulo: "Quando o cliente pergunta o preço",
    mensagens: [
      "Boa pergunta, {nome}! O valor depende do que você precisa, mas pra te dar uma ideia: os projetos começam a partir de R$ 497.",
      "Isso já inclui design profissional, site responsivo (fica bonito no celular também), otimização pro Google e tudo pronto pra receber clientes.",
      "Mas o mais importante: o site se paga rápido. Com 2 ou 3 clientes novos que chegam por ele, já valeu o investimento. Quer que eu monte uma proposta sob medida pra {empresa}?",
    ],
  },
  {
    titulo: "Quando o cliente diz que vai pensar",
    mensagens: [
      "Claro, {nome}! Faz total sentido pensar com calma. 😉",
      "Só queria te deixar uma reflexão: enquanto a {empresa} não tá online, seus concorrentes já estão lá capturando os clientes que poderiam ser seus. Cada dia sem site é oportunidade passando.",
      "Que tal a gente marcar uma conversa rápida de 10 minutinhos? Te mostro exatamente como ficaria o site e você decide com mais clareza. Pode ser?",
    ],
  },
  {
    titulo: "Quando o cliente acha caro",
    mensagens: [
      "Entendo totalmente, {nome}. Mas deixa eu te fazer uma pergunta: quanto vale um cliente novo pra {empresa}?",
      "Se o site trouxer pelo menos 2 clientes novos por mês — e vai trazer — o investimento se paga logo no primeiro mês. Não é um gasto, é o melhor vendedor que você pode ter: trabalha 24h, não tira férias e não pede aumento. 😄",
      "E o melhor: você paga uma vez e o retorno vem todo mês. É o investimento com melhor custo-benefício que existe pra quem quer crescer.",
    ],
  },
  {
    titulo: "Follow-up (se não respondeu)",
    mensagens: [
      "Oi, {nome}! Tudo certo? 😊 Passei aqui só pra saber se conseguiu pensar sobre o site da {empresa}.",
      "Sei que a rotina é corrida, mas não queria que você perdesse a oportunidade. Ainda tenho vaga disponível essa semana pra começar o projeto.",
      "Se preferir, posso te mandar um exemplo de site parecido com o que ficaria pra {empresa}. Assim você visualiza melhor! Me avisa. 🚀",
    ],
  },
  {
    titulo: "Fechamento (hora de fechar!)",
    mensagens: [
      "Então, {nome}, bora transformar a {empresa} em referência online? Posso reservar sua vaga pra essa semana!",
      "Pra começar é super simples: preciso só do logotipo e algumas informações básicas. Te mando um formulário rápido e a gente já inicia!",
      "Ah, e fica tranquilo(a): tem garantia de satisfação. Se não curtir o resultado, a gente ajusta até ficar do jeitinho que você quer. 💪",
    ],
  },
];

const ContratoScriptView = () => {
  const [tab, setTab] = useState<"contrato" | "script">("contrato");
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  // Contrato state
  const [nomeCliente, setNomeCliente] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [contratoGerado, setContratoGerado] = useState("");

  // Script state
  const [nomeScript, setNomeScript] = useState("");
  const [empresaScript, setEmpresaScript] = useState("");

  const gerarContrato = () => {
    if (!nomeCliente.trim() || !valor.trim()) {
      toast.error("Preencha pelo menos o nome do cliente e o valor.");
      return;
    }
    const texto = contratoTemplate({ nomeCliente, nomeEmpresa, valor, descricao, prazo });
    setContratoGerado(texto);
    toast.success("Contrato gerado com sucesso!");
  };

  const baixarPDF = () => {
    if (!contratoGerado) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", pageWidth / 2, 25, { align: "center" });
    doc.text("DE DESENVOLVIMENTO WEB", pageWidth / 2, 33, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Split text removing the title (first line)
    const lines = contratoGerado.split("\n").slice(2);
    let y = 48;

    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      const trimmed = line.trim();
      if (/^\d+\./.test(trimmed)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        y += 4;
      } else if (trimmed.startsWith("CONTRATANTE:") || trimmed.startsWith("CONTRATADO")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      }

      const wrapped = doc.splitTextToSize(trimmed || " ", maxWidth);
      for (const wl of wrapped) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(wl, margin, y);
        y += lineHeight;
      }
    }

    doc.save(`contrato-${nomeCliente.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    toast.success("PDF baixado com sucesso!");
  };

  const copiarTexto = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiedIdx(id);
    toast.success("Copiado!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const personalizarMsg = (msg: string) => {
    return msg
      .replace(/\{nome\}/g, nomeScript || "{nome}")
      .replace(/\{empresa\}/g, empresaScript || "{empresa}");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Contrato & Script de Vendas</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gere contratos profissionais e tenha frases prontas para fechar vendas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={tab === "contrato" ? "neon" : "outline"}
          onClick={() => setTab("contrato")}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Gerador de Contrato
        </Button>
        <Button
          variant={tab === "script" ? "neon" : "outline"}
          onClick={() => setTab("script")}
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Script de Vendas
        </Button>
      </div>

      {tab === "contrato" && (
        <motion.div
          key="contrato"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Contrato</CardTitle>
              <CardDescription>Preencha os campos e gere seu contrato profissional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome do Cliente *</label>
                  <Input
                    placeholder="Ex: João Silva"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sua Empresa / Seu Nome</label>
                  <Input
                    placeholder="Ex: AxionFly Digital"
                    value={nomeEmpresa}
                    onChange={(e) => setNomeEmpresa(e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Valor do Serviço (R$) *</label>
                  <Input
                    placeholder="Ex: 997"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Prazo de Entrega</label>
                  <Input
                    placeholder="Ex: 7 dias úteis"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descrição do Serviço</label>
                <Textarea
                  placeholder="Ex: Criação de site institucional com 5 páginas, formulário de contato e integração com WhatsApp"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="bg-secondary/50 border-border min-h-[80px]"
                />
              </div>
              <Button variant="neon" size="lg" onClick={gerarContrato} className="gap-2">
                <FileText className="w-4 h-4" />
                Gerar Contrato
              </Button>
            </CardContent>
          </Card>

          {contratoGerado && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg">Contrato Gerado</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="neon"
                    size="sm"
                    onClick={baixarPDF}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copiarTexto(contratoGerado, "contrato")}
                    className="gap-2"
                  >
                    {copiedIdx === "contrato" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedIdx === "contrato" ? "Copiado!" : "Copiar tudo"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-foreground/90 bg-secondary/30 rounded-lg p-4 font-mono leading-relaxed max-h-[500px] overflow-auto">
                  {contratoGerado}
                </pre>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {tab === "script" && (
        <motion.div
          key="script"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 bg-card border border-border rounded-lg p-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nome do lead</label>
              <Input
                placeholder="Ex: Maria"
                value={nomeScript}
                onChange={(e) => setNomeScript(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Empresa do lead</label>
              <Input
                placeholder="Ex: Salão da Maria"
                value={empresaScript}
                onChange={(e) => setEmpresaScript(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>

          {(!nomeScript.trim() || !empresaScript.trim()) && (
            <p className="text-xs text-amber-400/80 px-1">
              ⚠ Preencha o nome e empresa acima para as mensagens ficarem prontas para copiar e enviar direto.
            </p>
          )}

          <div className="space-y-4">
            {scriptsVendas.map((script, sIdx) => (
              <Card key={sIdx} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {script.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {script.mensagens.map((msg, mIdx) => {
                    const id = `${sIdx}-${mIdx}`;
                    const texto = personalizarMsg(msg);
                    return (
                      <div
                        key={mIdx}
                        className="flex items-start gap-3 bg-secondary/20 rounded-lg p-3 group"
                      >
                        <p className="flex-1 text-sm text-foreground/90 leading-relaxed">{texto}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
                          onClick={() => copiarTexto(texto, id)}
                        >
                          {copiedIdx === id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContratoScriptView;
