import LegalLayout from "@/components/LegalLayout";

export default function Termos() {
  return (
    <LegalLayout
      eyebrow="Documento Legal"
      title="Termos de Uso"
      description="Condições que regem o acesso, contratação e uso da plataforma AxionFly por todos os usuários."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "aceite",
          title: "Aceite dos termos",
          content: (
            <p>
              Ao criar uma conta, contratar um plano ou utilizar qualquer recurso da AxionFly,
              o usuário declara que leu, compreendeu e concorda integralmente com estes Termos
              de Uso, com a Política de Privacidade e com a Política de Cookies.
            </p>
          ),
        },
        {
          id: "conta",
          title: "Conta e acesso",
          content: (
            <>
              <p>
                Para utilizar a plataforma, é necessário criar uma conta com informações
                verdadeiras, completas e atualizadas. O acesso é pessoal e intransferível.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>O usuário é responsável por manter a confidencialidade de suas credenciais.</li>
                <li>É proibido compartilhar a conta com terceiros sem autorização contratual.</li>
                <li>Atividades realizadas com sua conta são de sua inteira responsabilidade.</li>
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
                <li>Utilizar a plataforma em conformidade com a legislação aplicável.</li>
                <li>Não realizar ações que comprometam a segurança ou estabilidade do serviço.</li>
                <li>Não utilizar a plataforma para finalidades ilegais, fraudulentas ou abusivas.</li>
                <li>Respeitar os direitos de propriedade intelectual da AxionFly e de terceiros.</li>
              </ul>
            </>
          ),
        },
        {
          id: "propriedade",
          title: "Propriedade intelectual",
          content: (
            <p>
              Todos os direitos sobre a plataforma, seu código-fonte, design, marca, conteúdo
              e funcionalidades pertencem à AxionFly. A contratação concede ao usuário apenas
              uma licença limitada, não exclusiva e revogável de uso, restrita ao plano ativo.
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
                <li>Decisões tomadas pelo usuário com base em dados gerados pela plataforma.</li>
                <li>Indisponibilidades causadas por terceiros, manutenções programadas ou força maior.</li>
                <li>Conteúdo gerado, importado ou tratado pelo próprio usuário.</li>
              </ul>
            </>
          ),
        },
        {
          id: "pagamentos",
          title: "Pagamentos e renovação",
          content: (
            <p>
              As assinaturas são processadas por meio de gateways de pagamento certificados.
              A renovação ocorre de forma automática conforme a periodicidade contratada,
              salvo cancelamento expresso pelo usuário antes do vencimento do ciclo vigente.
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
                O cancelamento encerra a renovação automática, mas mantém o acesso até o
                final do período já pago.
              </p>
              <p>
                A AxionFly poderá suspender ou encerrar contas que violem estes Termos,
                pratiquem fraudes ou comprometam a segurança da plataforma e de outros usuários.
              </p>
            </>
          ),
        },
        {
          id: "alteracoes",
          title: "Alterações dos termos",
          content: (
            <p>
              Estes Termos podem ser atualizados periodicamente. Alterações relevantes serão
              comunicadas por e-mail ou através da plataforma. O uso continuado após a
              publicação implica aceitação da versão mais recente.
            </p>
          ),
        },
        {
          id: "foro",
          title: "Lei aplicável e foro",
          content: (
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica
              eleito o foro da comarca da sede da AxionFly como competente para dirimir
              quaisquer controvérsias, com renúncia expressa a qualquer outro.
            </p>
          ),
        },
      ]}
    />
  );
}
