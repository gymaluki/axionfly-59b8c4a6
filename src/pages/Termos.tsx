import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";

export default function Termos() {
  return (
    <>
      <Helmet>
        <title>Termos de Uso — AxionFly</title>
        <meta name="description" content="Regras simples para uso da AxionFly, contratação de planos e manutenção de uma experiência segura para todos." />
        <meta property="og:title" content="Termos de Uso — AxionFly" />
        <meta property="og:description" content="Regras simples para uso da AxionFly, contratação de planos e manutenção de uma experiência segura." />
        <meta property="og:url" content="https://axionfly.lovable.app/termos" />
        <link rel="canonical" href="https://axionfly.lovable.app/termos" />
      </Helmet>
      <LegalLayout
      eyebrow="Termos"
      title="Termos de Uso"
      description="Regras simples para uso da AxionFly, contratação de planos e manutenção de uma experiência segura para todos."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "aceite",
          title: "Ao usar a plataforma",
          content: (
            <p>
              Ao criar uma conta, contratar um plano ou utilizar qualquer recurso da AxionFly,
              você concorda com estes Termos, com a Política de Privacidade e com a Política de Cookies.
            </p>
          ),
        },
        {
          id: "conta",
          title: "Conta e acesso",
          content: (
            <>
              <p>
                Para usar a AxionFly, é necessário manter seus dados corretos e sua conta protegida.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>O acesso é pessoal e vinculado ao plano contratado.</li>
                <li>Você é responsável pelas atividades realizadas com sua conta.</li>
                <li>Não compartilhe credenciais sem autorização expressa da plataforma.</li>
              </ul>
            </>
          ),
        },
        {
          id: "responsabilidades",
          title: "Responsabilidades do usuário",
          content: (
            <>
              <p>O usuário se compromete a:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Usar a plataforma de forma ética, segura e dentro da lei.</li>
                <li>Não prejudicar a estabilidade, segurança ou reputação do serviço.</li>
                <li>Não utilizar a AxionFly para práticas ilegais, fraudulentas ou abusivas.</li>
                <li>Respeitar a marca, o conteúdo e a propriedade intelectual da AxionFly.</li>
              </ul>
            </>
          ),
        },
        {
          id: "propriedade",
          title: "Propriedade intelectual",
          content: (
            <p>
              A contratação dá direito de uso da plataforma conforme o plano ativo, mas não transfere
              a propriedade do produto, da marca, do design ou da tecnologia utilizada pela AxionFly.
            </p>
          ),
        },
        {
          id: "limitacoes",
          title: "Limitações de responsabilidade",
          content: (
            <>
              <p>
                A AxionFly não se responsabiliza por:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Resultados comerciais específicos como faturamento ou número de vendas.</li>
                <li>Decisões comerciais tomadas a partir das informações da plataforma.</li>
                <li>Indisponibilidades causadas por terceiros, manutenção ou fatores externos.</li>
                <li>Conteúdo, abordagem comercial ou uso feito diretamente pelo usuário.</li>
              </ul>
            </>
          ),
        },
        {
          id: "pagamentos",
          title: "Pagamentos e renovação",
          content: (
            <p>
              Planos recorrentes podem ser renovados automaticamente conforme o ciclo contratado.
              Se não quiser renovar, basta cancelar antes da próxima cobrança.
            </p>
          ),
        },
        {
          id: "cancelamento",
          title: "Cancelamento e suspensão",
          content: (
            <>
              <p>
                O usuário pode cancelar sua assinatura a qualquer momento dentro do painel.
                O cancelamento interrompe novas cobranças e mantém o acesso até o fim do período já pago.
              </p>
              <p>
                A AxionFly poderá suspender contas em caso de fraude, abuso, violação destes termos
                ou risco à segurança da plataforma.
              </p>
            </>
          ),
        },
        {
          id: "alteracoes",
          title: "Alterações dos termos",
          content: (
            <p>
              Estes Termos podem ser atualizados para refletir melhorias, mudanças operacionais
              ou exigências legais. Ao continuar usando a plataforma, você concorda com a versão vigente.
            </p>
          ),
        },
      ]}
    />
    </>
  );
}
