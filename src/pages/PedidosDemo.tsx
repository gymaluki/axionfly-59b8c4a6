import { Helmet } from "react-helmet-async";
import WhatsAppOrderSystem from "@/components/WhatsAppOrderSystem";

const PedidosDemo = () => {
  return (
    <>
      <Helmet>
        <title>Demo de Pedidos por WhatsApp — AxionFly</title>
        <meta name="description" content="Veja como funciona o sistema de pedidos por WhatsApp da AxionFly para restaurantes e comércios." />
        <meta property="og:title" content="Demo de Pedidos por WhatsApp — AxionFly" />
        <meta property="og:description" content="Sistema de pedidos por WhatsApp para restaurantes e comércios." />
        <meta property="og:url" content="https://axionfly.lovable.app/pedidos-demo" />
        <link rel="canonical" href="https://axionfly.lovable.app/pedidos-demo" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WhatsAppOrderSystem
          pizzariaName="Pizzaria Demo"
          whatsappNumber="5511999999999"
        />
      </div>
    </>
  );
};

export default PedidosDemo;
