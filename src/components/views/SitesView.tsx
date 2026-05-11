import { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  Trash2,
  Calendar,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);

  const fetchSavedSites = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("user_sites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedSites(data || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
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
    setTimeout(fetchSavedSites, 2000);
  };

  return (
    <>
      <div className="fixed top-24 right-6 z-40">
        <Sheet onOpenChange={(open) => open && fetchSavedSites()}>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-lg shadow-primary/30 gap-2">
              <History className="w-4 h-4" />
              Meus Sites
              {savedSites.length > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {savedSites.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#0d0d14] border-white/10 text-white overflow-y-auto w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-white font-black text-2xl flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                Meus Sites
              </SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Histórico de sites criados com IA
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout">
                {savedSites.length > 0 ? (
                  savedSites.map((site) => (
                    <motion.div
                      key={site.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-white truncate pr-2">
                          {site.site_name}
                        </h4>
                        <button
                          onClick={() => setSiteToDelete(site.id)}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">
                        <Calendar className="w-3 h-3" />
                        {new Date(site.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 italic mb-3">
                        "{site.prompt}"
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-white/10 hover:bg-primary text-white font-bold rounded-xl"
                        onClick={() => window.open(site.url, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Abrir Site
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <History className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Nenhum site criado ainda.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AIBuildersGrid onSelect={handleCreateSite} />

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
              Esta ação removerá este site do seu histórico.
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
    </>
  );
};

export default SitesView;
