import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutUrl: string | null;
  planName: string;
}

export default function CheckoutModal({ open, onOpenChange, checkoutUrl, planName }: CheckoutModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) setLoading(true);
  }, [open, checkoutUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl h-[90vh] p-0 overflow-hidden border-primary/30 bg-[#03060f]">
        <DialogTitle className="sr-only">Checkout — {planName}</DialogTitle>
        <div className="relative w-full h-full">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#03060f] z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Carregando checkout seguro...
              </p>
            </div>
          )}
          {checkoutUrl && (
            <iframe
              src={checkoutUrl}
              title={`Checkout ${planName}`}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              allow="payment *; clipboard-write"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
