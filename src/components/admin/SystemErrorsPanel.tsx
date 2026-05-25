import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trash2, CheckCheck, RefreshCw, Search, Wifi, WifiOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SystemError {
  id: string;
  created_at: string;
  level: string;
  message: string;
  stack: string | null;
  source: string | null;
  url: string | null;
  user_agent: string | null;
  user_email: string | null;
  user_id: string | null;
  context: any;
  resolved: boolean;
}

// Owner gate is enforced server-side via RLS + is_owner() RPC.

export default function SystemErrorsPanel() {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [live, setLive] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setIsOwner(false);
        return;
      }
      const { data: ownerRes } = await supabase.rpc("is_owner" as never, { check_user_id: data.user.id } as never);
      setIsOwner(ownerRes === true);
    });
  }, []);

  const fetchErrors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("system_errors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else {
      setErrors((data || []) as SystemError[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchErrors();
    const channel = supabase
      .channel("system-errors-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "system_errors" },
        (payload) => {
          setErrors((prev) => [payload.new as SystemError, ...prev].slice(0, 200));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "system_errors" },
        (payload) => {
          setErrors((prev) =>
            prev.map((e) => (e.id === (payload.new as any).id ? (payload.new as SystemError) : e)),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "system_errors" },
        (payload) => {
          setErrors((prev) => prev.filter((e) => e.id !== (payload.old as any).id));
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markResolved = async (id: string, resolved: boolean) => {
    const { error } = await supabase
      .from("system_errors")
      .update({ resolved })
      .eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("system_errors").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
  };

  const clearResolved = async () => {
    const { error } = await supabase.from("system_errors").delete().eq("resolved", true);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "Resolvidos limpos" });
  };

  // Gate: only owner sees this content
  if (isOwner === false) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Esta seção é restrita ao proprietário do sistema.
          </p>
        </CardContent>
      </Card>
    );
  }

  const filtered = errors.filter((e) => {
    if (!showResolved && e.resolved) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.message?.toLowerCase().includes(q) ||
      e.url?.toLowerCase().includes(q) ||
      e.user_email?.toLowerCase().includes(q) ||
      e.source?.toLowerCase().includes(q)
    );
  });

  const unresolvedCount = errors.filter((e) => !e.resolved).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">{unresolvedCount}</p>
            <p className="text-xs text-muted-foreground">Erros ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{errors.length}</p>
            <p className="text-xs text-muted-foreground">Total registrado</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">{errors.filter((e) => e.resolved).length}</p>
            <p className="text-xs text-muted-foreground">Resolvidos</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-2">
            {live ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-bold">{live ? "AO VIVO" : "Offline"}</p>
              <p className="text-xs text-muted-foreground">Realtime</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Bugs e erros do sistema
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filtrar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56 h-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResolved((v) => !v)}
              className="h-9"
            >
              {showResolved ? "Ocultar resolvidos" : "Mostrar resolvidos"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchErrors} className="h-9">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={clearResolved} className="h-9">
              <Trash2 className="w-4 h-4 mr-1" /> Limpar resolvidos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              Nenhum erro registrado. Tudo funcionando! 🎉
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm transition-colors",
                    e.resolved
                      ? "border-border/40 bg-muted/20 opacity-60"
                      : "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase font-bold",
                            e.level === "error"
                              ? "border-destructive/50 text-destructive"
                              : "border-yellow-500/50 text-yellow-500",
                          )}
                        >
                          {e.level}
                        </Badge>
                        {e.source && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {e.source}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(e.created_at).toLocaleString("pt-BR")}
                        </span>
                        {e.user_email && (
                          <span className="text-[10px] text-primary font-bold">
                            {e.user_email}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground font-medium break-words">
                        {e.message}
                      </p>
                      {e.url && (
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">
                          {e.url}
                        </p>
                      )}
                      {e.stack && (
                        <details className="mt-2">
                          <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
                            Ver stack trace
                          </summary>
                          <pre className="mt-1 text-[10px] text-muted-foreground bg-black/40 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                            {e.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px]"
                        onClick={() => markResolved(e.id, !e.resolved)}
                      >
                        <CheckCheck className="w-3 h-3 mr-1" />
                        {e.resolved ? "Reabrir" : "Resolver"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px] border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => remove(e.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
