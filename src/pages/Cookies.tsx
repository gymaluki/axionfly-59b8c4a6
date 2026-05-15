import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Política de Cookies — AxionFly</title>
        <meta name="description" content="Veja de forma objetiva como usamos cookies para manter a plataforma funcionando melhor, com mais segurança e personalização." />
        <meta property="og:title" content="Política de Cookies — AxionFly" />
        <meta property="og:description" content="Veja como usamos cookies para manter a plataforma funcionando melhor, com mais segurança e personalização." />
        <meta property="og:url" content="https://axionfly.lovable.app/cookies" />
        <link rel="canonical" href="https://axionfly.lovable.app/cookies" />
      </Helmet>
      <LegalLayout
      eyebrow="Cookies"
      title="Política de Cookies"
      description="Veja de forma objetiva como usamos cookies para manter a plataforma funcionando melhor, com mais segurança e personalização."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "o-que-sao",
          title: "O que são cookies",
          content: (
            <p>
              Cookies são pequenos arquivos salvos no navegador para lembrar preferências,
              manter sessões ativas e ajudar a melhorar sua navegação.
            </p>
          ),
        },
        {
          id: "tipos",
          title: "Tipos de cookies utilizados",
          content: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Essenciais:</strong> necessários para login, segurança e funcionamento básico.</li>
              <li><strong>Funcionais:</strong> lembram preferências e ajustes da experiência.</li>
              <li><strong>Analíticos:</strong> ajudam a entender o uso da plataforma e melhorar desempenho.</li>
              <li><strong>Marketing:</strong> apoiam mensuração de campanhas e origem de acessos.</li>
            </ul>
          ),
        },
        {
          id: "essenciais",
          title: "Cookies essenciais",
          content: (
            <p>
              Alguns cookies são indispensáveis para manter sua sessão ativa, proteger acessos
              e garantir que a plataforma funcione corretamente.
            </p>
          ),
        },
        {
          id: "analiticos",
          title: "Cookies analíticos",
          content: (
            <p>
              Usamos cookies analíticos para entender comportamento de navegação, identificar pontos
              de melhoria e evoluir a experiência de forma contínua.
            </p>
          ),
        },
        {
          id: "terceiros",
          title: "Cookies de terceiros",
          content: (
            <p>
              Alguns recursos podem depender de serviços externos, como meios de pagamento,
              análise de tráfego ou conteúdos incorporados, que podem usar seus próprios cookies.
            </p>
          ),
        },
        {
          id: "preferencias",
          title: "Preferências do usuário",
          content: (
            <p>
              Sempre que disponível, você pode ajustar cookies não essenciais nas permissões do site
              ou diretamente nas configurações do navegador.
            </p>
          ),
        },
        {
          id: "gerenciamento",
          title: "Como gerenciar cookies",
          content: (
            <>
              <p>Você pode controlar e excluir cookies diretamente no seu navegador:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies.</li>
                <li><strong>Safari:</strong> Preferências → Privacidade → Gerenciar dados de sites.</li>
                <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies e dados de sites.</li>
                <li><strong>Edge:</strong> Configurações → Cookies e permissões do site.</li>
              </ul>
              <p>
                Desativar cookies essenciais pode afetar partes importantes da plataforma.
              </p>
            </>
          ),
        },
        {
          id: "atualizacoes",
          title: "Atualizações desta política",
          content: (
            <p>
              Esta política pode ser revisada ao longo do tempo para refletir ajustes técnicos
              e melhorias no funcionamento da plataforma.
            </p>
          ),
        },
      ]}
    />
    </>
  );
}
