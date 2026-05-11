import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Sparkles,
  ExternalLink,
  RotateCcw,
  Globe,
  Plus,
  Trash2,
  Calendar,
  Layout,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AIBuildersGrid from "@/components/AIBuildersGrid";
import AIBuilderPicker from "@/components/AIBuilderPicker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SavedSite {
  id: string;
  site_name: string;
  prompt: string;
  url: string;
  created_at: string;
}

const SitesView = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [savedSites, setSavedSites] = useState<SavedSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);

  const fetchSavedSites = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_sites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedSites(data || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedSites();
  }, [fetchSavedSites]);

  const handleDeleteSite = async () => {
    if (!siteToDelete) return;

    try {
      const { error } = await supabase
        .from("user_sites")
        .delete()
        .eq("id", siteToDelete);

      if (error) throw error;

      toast.success("Site removido do histórico");
      setSavedSites(prev => prev.filter(site => site.id !== siteToDelete));
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Erro ao remover site");
    } finally {
      setSiteToDelete(null);
    }
  };

  const handleCreateSite = (prompt: string) => {
    setCurrentPrompt(prompt);
    setShowPicker(true);
    // Refresh history after a short delay to allow the new site to be saved
    setTimeout(fetchSavedSites, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Layout className="w-8 h-8 text-primary" />
            Criador de Sites
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Crie sites profissionais com IA ou gerencie seus projetos salvos
          </p>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 mb-6">
          <TabsTrigger 
            value="create" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Site
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6"
            onClick={fetchSavedSites}
          >
            <History className="w-4 h-4 mr-2" />
            Meus Sites ({savedSites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0 outline-none">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
            <AIBuildersGrid onSelect={handleCreateSite} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
                ))
              ) : savedSites.length > 0 ? (
                savedSites.map((site) => (
                  <motion.div
                    key={site.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-primary/50 transition-colors rounded-3xl group">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-black text-white truncate pr-4">
                            {site.site_name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-400 -mt-1 -mr-1"
                            onClick={() => setSiteToDelete(site.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(site.created_at).toLocaleDateString("pt-BR")}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 italic">
                          "{site.prompt}"
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          className="w-full bg-white/10 hover:bg-primary text-white font-bold rounded-xl transition-all group-hover:bg-primary"
                          onClick={() => window.open(site.url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir Site
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <History className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Nenhum site criado ainda</h3>
                    <p className="text-muted-foreground">Comece agora criando seu primeiro site profissional com IA.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      const tabs = document.querySelectorAll('[role="tab"]');
                      (tabs[0] as HTMLElement)?.click();
                    }}
                    className="bg-primary text-white font-bold px-8"
                  >
                    Criar meu primeiro site
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      <AIBuilderPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        prompt={currentPrompt}
      />

      <AlertDialog open={!!siteToDelete} onOpenChange={() => setSiteToDelete(null)}>
        <AlertDialogContent className="bg-[#0d0d14] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-black">Remover do Histórico?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              Esta ação removerá este site do seu histórico. Você ainda poderá acessá-lo se tiver o link do Lovable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white border-white/10 hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSite}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SitesView;
