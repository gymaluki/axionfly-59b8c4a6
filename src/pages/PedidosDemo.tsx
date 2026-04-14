import WhatsAppOrderSystem from "@/components/WhatsAppOrderSystem";

const PedidosDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WhatsAppOrderSystem
          pizzariaName="Pizzaria Demo"
          whatsappNumber="5511999999999"
        />
      </div>
    </div>
  );
};

export default PedidosDemo;
