import LegalLayout from "@/components/LegalLayout";

export default function Privacidade() {
  return (
    <LegalLayout
      eyebrow="Privacidade"
      title="Política de Privacidade"
      description="Saiba como a AxionFly coleta, utiliza, armazena e protege os dados pessoais dos seus usuários, em conformidade com a LGPD e o GDPR."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "introducao",
          title: "Introdução",
          content: (
            <p>
              A privacidade dos nossos usuários é prioridade. Esta política descreve como
              tratamos dados pessoais coletados através do site, da plataforma e dos demais
              canais oficiais da AxionFly, sempre em conformidade com a Lei Geral de
              Proteção de Dados (LGPD - Lei 13.709/18) e com o Regulamento Geral de
              Proteção de Dados europeu (GDPR).
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
                <li><strong>Cadastro:</strong> nome, e-mail, telefone, documento e dados de pagamento.</li>
                <li><strong>Uso da plataforma:</strong> logs de acesso, IP, navegador, dispositivo e ações realizadas.</li>
                <li><strong>Comunicação:</strong> mensagens trocadas com nossa equipe de suporte e comercial.</li>
                <li><strong>Marketing:</strong> origem do lead, campanhas e interações realizadas.</li>
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
                <li>Personalizar a experiência e oferecer recursos relevantes.</li>
                <li>Cumprir obrigações legais, regulatórias e contratuais.</li>
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
                A AxionFly não vende dados pessoais. Compartilhamos informações apenas com
                operadores estritamente necessários para o funcionamento do serviço:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provedores de infraestrutura em nuvem e hospedagem.</li>
                <li>Gateways e processadoras de pagamento.</li>
                <li>Ferramentas de analytics e suporte ao cliente.</li>
                <li>Autoridades, mediante ordem judicial ou exigência legal.</li>
              </ul>
            </>
          ),
        },
        {
          id: "seguranca",
          title: "Segurança das informações",
          content: (
            <p>
              Adotamos medidas técnicas e administrativas adequadas para proteger os dados
              contra acesso não autorizado, perda, alteração ou destruição. Isso inclui
              criptografia em trânsito (TLS), controle de acesso por papéis, monitoramento
              de logs e backups periódicos. Apesar disso, nenhum sistema é 100% imune e o
              usuário também é responsável por manter suas credenciais seguras.
            </p>
          ),
        },
        {
          id: "retencao",
          title: "Retenção de dados",
          content: (
            <p>
              Os dados são mantidos pelo tempo necessário para cumprir as finalidades para
              as quais foram coletados, observados os prazos legais. Após esse período, os
              dados são anonimizados ou excluídos de forma segura.
            </p>
          ),
        },
        {
          id: "direitos",
          title: "Direitos do titular",
          content: (
            <>
              <p>Em conformidade com a LGPD e o GDPR, você pode a qualquer momento:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Confirmar a existência de tratamento dos seus dados.</li>
                <li>Acessar e solicitar correção de dados incompletos ou desatualizados.</li>
                <li>Solicitar a portabilidade dos dados a outro fornecedor.</li>
                <li>Solicitar a exclusão dos dados pessoais, salvo hipóteses legais de retenção.</li>
                <li>Revogar consentimentos previamente concedidos.</li>
              </ul>
              <p>
                As solicitações devem ser enviadas para
                <a href="mailto:privacidade@axionfly.site" className="text-primary hover:underline"> privacidade@axionfly.site</a>.
              </p>
            </>
          ),
        },
        {
          id: "transferencia",
          title: "Transferência internacional",
          content: (
            <p>
              Para viabilizar o serviço, alguns dados podem ser processados por provedores
              localizados fora do Brasil. Nessas hipóteses, garantimos a adoção de cláusulas
              contratuais e mecanismos de proteção compatíveis com a LGPD e o GDPR.
            </p>
          ),
        },
        {
          id: "alteracoes",
          title: "Alterações nesta política",
          content: (
            <p>
              Podemos atualizar esta Política periodicamente. Mudanças relevantes serão
              comunicadas com antecedência razoável pelos canais oficiais. Recomendamos a
              leitura periódica para se manter informado.
            </p>
          ),
        },
      ]}
    />
  );
}
