import LegalLayout from "@/components/LegalLayout";

export default function Cookies() {
  return (
    <LegalLayout
      eyebrow="Cookies"
      title="Política de Cookies"
      description="Entenda quais cookies utilizamos, com quais finalidades e como você pode gerenciar suas preferências a qualquer momento."
      updatedAt="11 de maio de 2026"
      sections={[
        {
          id: "o-que-sao",
          title: "O que são cookies",
          content: (
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu navegador quando
              você acessa um site. Eles permitem que a plataforma reconheça o dispositivo,
              memorize preferências e ofereça uma experiência mais segura, fluida e
              personalizada.
            </p>
          ),
        },
        {
          id: "tipos",
          title: "Tipos de cookies utilizados",
          content: (
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Essenciais:</strong> indispensáveis para o funcionamento da plataforma, login e segurança.</li>
              <li><strong>Funcionais:</strong> armazenam preferências como idioma, tema e configurações de interface.</li>
              <li><strong>Analíticos:</strong> ajudam a entender como os usuários navegam e interagem com o site.</li>
              <li><strong>Marketing:</strong> utilizados para mensurar campanhas e exibir conteúdos relevantes.</li>
            </ul>
          ),
        },
        {
          id: "essenciais",
          title: "Cookies essenciais",
          content: (
            <p>
              Os cookies essenciais não podem ser desativados, pois são necessários para
              recursos básicos como manter o usuário autenticado, lembrar o estado do carrinho
              de assinaturas e proteger contra fraudes. Sem eles, a plataforma não funciona
              corretamente.
            </p>
          ),
        },
        {
          id: "analiticos",
          title: "Cookies analíticos",
          content: (
            <p>
              Utilizamos ferramentas como Google Analytics e provedores similares para
              entender o comportamento agregado dos usuários, identificar gargalos e melhorar
              continuamente a plataforma. Os dados são tratados de forma agregada e
              pseudonimizada sempre que possível.
            </p>
          ),
        },
        {
          id: "terceiros",
          title: "Cookies de terceiros",
          content: (
            <p>
              Algumas funcionalidades dependem de serviços externos (como vídeos incorporados,
              widgets de chat e processadores de pagamento), que podem instalar seus próprios
              cookies. Esses cookies são regidos pelas políticas de privacidade dos respectivos
              provedores.
            </p>
          ),
        },
        {
          id: "preferencias",
          title: "Preferências do usuário",
          content: (
            <p>
              Você pode aceitar, recusar ou personalizar a utilização de cookies não essenciais
              a qualquer momento, através do banner de consentimento exibido no primeiro acesso
              ou nas configurações do seu navegador.
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
                A desativação de determinados cookies pode comprometer o funcionamento de
                partes da plataforma.
              </p>
            </>
          ),
        },
        {
          id: "atualizacoes",
          title: "Atualizações desta política",
          content: (
            <p>
              Esta Política de Cookies pode ser revisada periodicamente para refletir
              mudanças tecnológicas, regulatórias ou operacionais. Recomendamos que você a
              consulte regularmente.
            </p>
          ),
        },
      ]}
    />
  );
}
