import LegalLayout from "@/components/LegalLayout";

export default function Legal() {
  return (
    <LegalLayout
      eyebrow="Informações Legais"
      title="Avisos Legais"
      description="Informações institucionais, direitos autorais e responsabilidades relacionadas ao uso da plataforma AxionFly."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "empresa",
          title: "Identificação da empresa",
          content: (
            <>
              <p>
                A AxionFly é uma plataforma SaaS de geração de leads e automação comercial,
                operada e mantida sob a marca <strong>AxionFly</strong>. O acesso à plataforma é
                disponibilizado através do domínio <strong>axionfly.site</strong>.
              </p>
              <p>
                Para questões institucionais, comerciais ou jurídicas, utilize o canal oficial
                <a href="mailto:contato@axionfly.site" className="text-primary hover:underline"> contato@axionfly.site</a>.
              </p>
            </>
          ),
        },
        {
          id: "direitos-autorais",
          title: "Direitos autorais e propriedade intelectual",
          content: (
            <>
              <p>
                Todo o conteúdo exibido na plataforma — incluindo logotipos, textos, layouts,
                ícones, imagens, vídeos, código-fonte, marca, identidade visual e materiais de
                marketing — é de propriedade exclusiva da AxionFly ou licenciado para uso por ela.
              </p>
              <p>
                É proibida qualquer forma de reprodução, distribuição, modificação, engenharia
                reversa ou exploração comercial sem autorização prévia e por escrito.
              </p>
            </>
          ),
        },
        {
          id: "isencao",
          title: "Isenção de responsabilidade",
          content: (
            <>
              <p>
                A AxionFly fornece ferramentas que apoiam o processo comercial do usuário,
                porém não garante resultados específicos de vendas, faturamento ou conversão.
                Os resultados dependem de diversos fatores externos como nicho, oferta, esforço
                e estratégia adotada por cada cliente.
              </p>
              <p>
                Não nos responsabilizamos por uso indevido da plataforma, violações de leis
                aplicáveis pelo usuário ou prejuízos decorrentes de decisões comerciais
                tomadas com base em dados gerados pela ferramenta.
              </p>
            </>
          ),
        },
        {
          id: "uso",
          title: "Uso da plataforma",
          content: (
            <>
              <p>
                A utilização da plataforma deve respeitar a legislação brasileira vigente,
                incluindo a LGPD, o Marco Civil da Internet e o Código de Defesa do Consumidor.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>É vedado o uso para envio de spam ou comunicações não autorizadas.</li>
                <li>É proibida a coleta de dados em desacordo com as leis de proteção de dados.</li>
                <li>Não é permitido praticar engenharia reversa, scraping ou ataques à infraestrutura.</li>
                <li>O acesso é pessoal e intransferível, vinculado ao plano contratado.</li>
              </ul>
            </>
          ),
        },
        {
          id: "contato-juridico",
          title: "Contato jurídico",
          content: (
            <>
              <p>
                Notificações extrajudiciais, solicitações de remoção de conteúdo, ordens
                judiciais e demais comunicações de natureza legal devem ser encaminhadas para
                <a href="mailto:juridico@axionfly.site" className="text-primary hover:underline"> juridico@axionfly.site</a>,
                acompanhadas de documentação que comprove a legitimidade do solicitante.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
