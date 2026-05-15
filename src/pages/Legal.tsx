import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";

export default function Legal() {
  return (
    <>
      <Helmet>
        <title>Avisos Legais — AxionFly</title>
        <meta name="description" content="Informações rápidas sobre marca, conteúdo e limites de uso da AxionFly, de forma clara e objetiva." />
        <meta property="og:title" content="Avisos Legais — AxionFly" />
        <meta property="og:description" content="Informações rápidas sobre marca, conteúdo e limites de uso da AxionFly." />
        <meta property="og:url" content="https://axionfly.lovable.app/legal" />
        <link rel="canonical" href="https://axionfly.lovable.app/legal" />
      </Helmet>
      <LegalLayout
      eyebrow="Informações Legais"
      title="Avisos Legais"
      description="Informações rápidas sobre marca, conteúdo e limites de uso da AxionFly, de forma clara e objetiva."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "empresa",
          title: "Sobre a AxionFly",
          content: (
            <>
              <p>
                A <strong>AxionFly</strong> é uma plataforma focada em criação de sites com IA,
                prospecção de clientes e apoio à operação comercial. Nossos canais oficiais
                funcionam dentro do ecossistema AxionFly e do domínio <strong>axionfly.site</strong>.
              </p>
              <p>
                Se precisar falar com a equipe, utilize o canal oficial
                <a href="mailto:contato@axionfly.site" className="text-primary hover:underline"> contato@axionfly.site</a>.
              </p>
            </>
          ),
        },
        {
          id: "direitos-autorais",
          title: "Marca e conteúdo",
          content: (
            <>
              <p>
                O nome AxionFly, a identidade visual, os textos, layouts, materiais e recursos da
                plataforma fazem parte da nossa marca e não podem ser copiados ou revendidos sem autorização.
              </p>
              <p>
                Você pode usar a plataforma dentro do seu plano normalmente, mas não pode reproduzir
                a estrutura do produto como se fosse sua.
              </p>
            </>
          ),
        },
        {
          id: "isencao",
          title: "Resultados e uso responsável",
          content: (
            <>
              <p>
                A AxionFly entrega ferramentas para acelerar criação, prospecção e organização comercial,
                mas os resultados dependem da oferta, abordagem e execução de cada usuário.
              </p>
              <p>
                Esperamos um uso responsável da plataforma, sem spam, fraude, abuso ou qualquer prática
                que prejudique outros usuários, clientes finais ou a reputação da marca.
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
                Para manter a qualidade da experiência, a conta deve ser usada de forma pessoal,
                segura e dentro das funcionalidades previstas em seu plano.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Não use a plataforma para spam, golpes ou automações abusivas.</li>
                <li>Mantenha seus dados de acesso protegidos e atualizados.</li>
                <li>Evite qualquer tentativa de copiar, explorar ou comprometer a estrutura do serviço.</li>
                <li>Respeite os limites e recursos incluídos no plano contratado.</li>
              </ul>
            </>
          ),
        },
      ]}
    />
    </>
  );
}
