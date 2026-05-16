import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Copy, CheckCircle2, Send, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const DEFAULT_TOKEN = "WGf4zznFpWp3Th6DMLc2dGUkEXUfxBEgFs3K";

interface SaleRow {
  id: string;
  email: string;
  amount: number;
  status: string;
  plan: string;
  payment_method: string;
  affiliate_slug: string | null;
  payload: any;
  created_at: string;
  transaction_id: string;
}

export default function WebhookManagerPanel() {
  const [token, setToken] = useState<string>(() => localStorage.getItem("cakto_webhook_token_preview") || DEFAULT_TOKEN);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; status: number; body: string } | null>(null);
  const [events, setEvents] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openEvent, setOpenEvent] = useState<SaleRow | null>(null);
  const [testEmail, setTestEmail] = useState("teste-painel@axionfly.site");
  const [testPlan, setTestPlan] = useState<"monthly" | "lifetime">("monthly");
  const [testAffiliate, setTestAffiliate] = useState("");

  const webhookUrl = `${SUPABASE_URL}/functions/v1/cakto-webhook?token=${token}`;

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("platform_sales")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) toast.error("Erro ao carregar eventos: " + error.message);
    else setEvents((data || []) as SaleRow[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const sendTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const txId = `painel_test_${Date.now()}`;
      const payload = {
        event: "purchase_approved",
        data: {
          id: txId,
          status: "approved",
          amount: testPlan === "lifetime" ? 497 : 97,
          payment_method: "pix",
          customer: { email: testEmail },
          product: { name: testPlan === "lifetime" ? "Axionfly Vitalicio" : "Axionfly Mensal" },
          ...(testAffiliate ? { affiliate_id: testAffiliate } : {}),
        },
      };
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await resp.text();
      setTestResult({ ok: resp.ok, status: resp.status, body: text });
      if (resp.ok) {
        toast.success(`Webhook respondeu ${resp.status}`);
        setTimeout(fetchEvents, 800);
      } else {
        toast.error(`Webhook falhou: ${resp.status}`);
      }
    } catch (e: any) {
      setTestResult({ ok: false, status: 0, body: e.message });
      toast.error("Erro: " + e.message);
    } finally {
      setTesting(false);
    }
  };

  const saveTokenLocal = () => {
    localStorage.setItem("cakto_webhook_token_preview", token);
    toast.success("Token atualizado neste painel. Para vincular ao backend, atualize o secret CAKTO_WEBHOOK_TOKEN no Lovable Cloud.");
  };

  return (
    <div className="space-y-6">
      {/* Config do webhook */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Webhook da Cakto</CardTitle>
          <CardDescription className="text-xs">
            Configure a URL e o token. Cole a URL completa no painel da Cakto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Token (chave secreta)</Label>
            <div className="flex gap-2">
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="bg-black/20 border-white/10 font-mono text-xs"
              />
              <Button onClick={saveTokenLocal} variant="outline" className="bg-white/5 border-white/10">
                Salvar
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Esta troca atualiza apenas a URL exibida aqui. Para o servidor aceitar o novo token, atualize o secret <code className="bg-black/40 px-1 rounded">CAKTO_WEBHOOK_TOKEN</code> em Lovable Cloud.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">URL do webhook (cole na Cakto)</Label>
            <div className="flex gap-2">
              <Input value={webhookUrl} readOnly className="bg-black/20 border-white/10 font-mono text-xs" />
              <Button onClick={copyUrl} variant="outline" className="bg-white/5 border-white/10">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teste do webhook */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Testar Webhook</CardTitle>
          <CardDescription className="text-xs">
            Dispara uma compra aprovada falsa para verificar se o webhook está respondendo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email de teste</Label>
              <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="bg-black/20 border-white/10 text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plano</Label>
              <select
                value={testPlan}
                onChange={(e) => setTestPlan(e.target.value as any)}
                className="w-full h-10 rounded-md bg-black/20 border border-white/10 px-3 text-xs"
              >
                <option value="monthly">Mensal</option>
                <option value="lifetime">Vitalício</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Código afiliado (opcional)</Label>
              <Input value={testAffiliate} onChange={(e) => setTestAffiliate(e.target.value)} placeholder="ex: Lghn3ieU" className="bg-black/20 border-white/10 text-xs" />
            </div>
          </div>

          <Button onClick={sendTest} disabled={testing} className="bg-primary text-primary-foreground">
            <Send className="w-4 h-4 mr-2" />
            {testing ? "Enviando..." : "Disparar teste"}
          </Button>

          {testResult && (
            <div className={`p-3 rounded-md border text-xs font-mono ${testResult.ok ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
              <div className="font-black mb-1">HTTP {testResult.status} {testResult.ok ? "OK" : "FALHA"}</div>
              <pre className="whitespace-pre-wrap break-all opacity-80">{testResult.body}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de eventos */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimos eventos recebidos</CardTitle>
            <CardDescription className="text-xs">Tudo que chegou no webhook (Cakto + Perfect Pay).</CardDescription>
          </div>
          <Button onClick={fetchEvents} variant="outline" size="sm" className="bg-white/5 border-white/10">
            <RefreshCw className="w-3 h-3 mr-2" /> Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-xs text-muted-foreground">Carregando...</div>
          ) : events.length === 0 ? (
            <div className="py-10 text-center text-xs text-muted-foreground">Nenhum evento ainda. Dispare um teste acima.</div>
          ) : (
            <div className="space-y-2">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-md bg-black/20 border border-white/5 hover:bg-black/30 transition">
                  <Badge className={
                    ev.status === "paid" || ev.status === "active"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }>
                    {ev.status}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{ev.email}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">
                      {ev.transaction_id} · {ev.plan} · R$ {Number(ev.amount).toFixed(2)}
                      {ev.affiliate_slug && <span className="text-primary"> · aff:{ev.affiliate_slug}</span>}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(ev.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setOpenEvent(ev)} className="h-7 w-7 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!openEvent} onOpenChange={(o) => !o && setOpenEvent(null)}>
        <DialogContent className="max-w-2xl bg-[#0a0f1f] border-white/10">
          <DialogHeader>
            <DialogTitle>Payload do evento</DialogTitle>
          </DialogHeader>
          {openEvent && (
            <Textarea
              readOnly
              value={JSON.stringify(openEvent.payload, null, 2)}
              className="font-mono text-[11px] bg-black/40 border-white/10 min-h-[400px]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
