import LegalLayout from "@/components/LegalLayout";

export default function Privacidade() {
  return (
    <LegalLayout
      eyebrow="Privacidade"
      title="Política de Privacidade"
      description="Entenda de forma simples quais dados a AxionFly usa, por que usa e como protegemos essas informações."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "introducao",
          title: "Nosso compromisso",
          content: (
            <p>
              A AxionFly trata dados com foco em segurança, melhoria da experiência e operação da plataforma.
              Coletamos apenas o que faz sentido para entregar acesso, suporte, faturamento e evolução do produto.
            </p>
          ),
        },
        {
          id: "coleta",
          title: "Coleta de dados",
          content: (
            <>
              <p>Coletamos os seguintes tipos de informação:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Cadastro:</strong> nome, e-mail e informações necessárias para sua conta.</li>
                <li><strong>Uso:</strong> dados de navegação, dispositivo e interações com a plataforma.</li>
                <li><strong>Atendimento:</strong> mensagens enviadas para suporte, comercial ou contato.</li>
                <li><strong>Pagamento:</strong> informações ligadas à assinatura e cobranças.</li>
              </ul>
            </>
          ),
        },
        {
          id: "uso",
          title: "Uso das informações",
          content: (
            <>
              <p>Utilizamos os dados coletados para:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Operar, manter e aprimorar a plataforma.</li>
                <li>Processar pagamentos e gerenciar assinaturas.</li>
                <li>Enviar comunicações transacionais e de suporte.</li>
                <li>Personalizar a experiência e melhorar recursos.</li>
                <li>Prevenir fraudes, abusos e acessos indevidos.</li>
              </ul>
            </>
          ),
        },
        {
          id: "compartilhamento",
          title: "Compartilhamento de dados",
          content: (
            <>
              <p>
                A AxionFly não vende seus dados. Quando necessário, compartilhamos informações apenas com
                parceiros que ajudam a operar a plataforma:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Serviços de hospedagem e infraestrutura.</li>
                <li>Provedores de pagamento e cobrança.</li>
                <li>Ferramentas de atendimento, análise e estabilidade.</li>
                <li>Autoridades, quando houver exigência legal.</li>
              </ul>
            </>
          ),
        },
        {
          id: "seguranca",
          title: "Segurança das informações",
          content: (
            <p>
              Aplicamos medidas técnicas e operacionais para reduzir riscos de acesso indevido,
              perda ou uso incorreto das informações. Mesmo assim, também é importante que você
              mantenha sua conta e suas credenciais protegidas.
            </p>
          ),
        },
        {
          id: "retencao",
          title: "Retenção de dados",
          content: (
            <p>
              Mantemos os dados pelo tempo necessário para operar sua conta, cumprir obrigações
              legais e preservar a continuidade do serviço. Depois disso, os dados podem ser excluídos
              ou anonimizados de forma segura.
            </p>
          ),
        },
        {
          id: "direitos",
          title: "Direitos do titular",
          content: (
            <>
              <p>Você pode solicitar, sempre que fizer sentido:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Acesso e correção de dados cadastrais.</li>
                <li>Informações sobre como seus dados são usados.</li>
                <li>Solicitação de exclusão, quando aplicável.</li>
                <li>Atualização ou revisão de informações da conta.</li>
              </ul>
              <p>
                Para isso, entre em contato pelo e-mail
                <a href="mailto:contato@axionfly.site" className="text-primary hover:underline"> contato@axionfly.site</a>.
              </p>
            </>
          ),
        },
        {
          id: "alteracoes",
          title: "Alterações nesta política",
          content: (
            <p>
              Esta política pode ser atualizada para refletir melhorias no produto, ajustes operacionais
              ou mudanças de contexto. A versão mais recente estará sempre disponível nesta página.
            </p>
          ),
        },
      ]}
    />
  );
}
