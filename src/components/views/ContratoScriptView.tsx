import { useState } from "react";
import { FileText, MessageSquare, Copy, Check, Download } from "lucide-react";
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
    titulo: "Primeira abordagem (após encontrar o lead)",
    mensagens: [
      "Olá, {nome}! Tudo bem? Me chamo [seu nome] e trabalho com criação de sites profissionais para empresas como a sua.",
      "Vi que a {empresa} ainda não tem um site ou o site atual pode ser melhorado. Posso te mostrar como um site moderno pode trazer mais clientes?",
      "Sem compromisso, só quero te mostrar algumas ideias! Posso te enviar um exemplo rápido?",
    ],
  },
  {
    titulo: "Quando o cliente pergunta o preço",
    mensagens: [
      "Ótima pergunta, {nome}! O investimento varia conforme o que você precisa, mas nossos sites começam a partir de R$ 497.",
      "Inclui design profissional, responsivo pra celular, otimizado pro Google e pronto pra receber clientes. Quer que eu monte uma proposta personalizada?",
    ],
  },
  {
    titulo: "Quando o cliente diz que vai pensar",
    mensagens: [
      "Entendo perfeitamente, {nome}! É uma decisão importante mesmo.",
      "Só pra te ajudar: seus concorrentes já estão online e capturando clientes que poderiam ser seus. Quanto mais tempo sem um site, mais oportunidades passam.",
      "Que tal a gente agendar uma conversa rápida de 10 minutos? Posso te mostrar exatamente como ficaria o site da {empresa}.",
    ],
  },
  {
    titulo: "Quando o cliente diz que é caro",
    mensagens: [
      "Entendo, {nome}! Mas pensa comigo: quantos clientes novos por mês um site profissional pode trazer?",
      "Se o site trouxer pelo menos 2 ou 3 clientes novos, o investimento já se paga no primeiro mês. É um investimento, não um gasto.",
      "E o melhor: você paga uma vez e o site trabalha pra você 24 horas por dia, 7 dias por semana.",
    ],
  },
  {
    titulo: "Fechamento / Call to Action",
    mensagens: [
      "Então, {nome}, posso reservar uma vaga pra começar o site da {empresa} essa semana?",
      "Tenho apenas {X} vagas disponíveis esse mês. Garanto que vai ficar muito satisfeito(a) com o resultado!",
      "Pra começar, preciso apenas do logotipo e algumas informações básicas. Posso te enviar um formulário rápido?",
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Contrato Gerado</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copiarTexto(contratoGerado, "contrato")}
                  className="gap-2"
                >
                  {copiedIdx === "contrato" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedIdx === "contrato" ? "Copiado!" : "Copiar tudo"}
                </Button>
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
