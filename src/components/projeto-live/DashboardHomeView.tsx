import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayCircle, CheckCircle2, Clock, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardHomeView({ userName = "Aluno" }: { userName?: string }) {
  const [progress, setProgress] = useState(0);
  const [lastLesson, setLastLesson] = useState<any>(null);

  useEffect(() => {
    // Fetch user progress and last lesson here
    const fetchProgress = async () => {
      const { data: lessons } = await supabase.from('lessons').select('id');
      const { data: completed } = await supabase.from('user_progress').select('id').eq('completed', true);
      
      if (lessons && lessons.length > 0) {
        setProgress(Math.round(((completed?.length || 0) / lessons.length) * 100));
      }

      const { data: lastP } = await supabase
        .from('user_progress')
        .select('lesson_id, lessons(*)')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (lastP) {
        setLastLesson(lastP.lessons);
      } else {
        // Fallback to first lesson if no progress
        const { data: first } = await supabase.from('lessons').select('*').order('order', { ascending: true }).limit(1).maybeSingle();
        setLastLesson(first);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Olá, {userName} 👋</h1>
        <p className="text-muted-foreground">Bem-vindo de volta ao seu painel de estudos.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#1B3A5C]" />
              Progresso Geral
            </h2>
            <span className="text-sm font-bold text-[#1B3A5C]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#F0F0F0]" />
          <p className="text-xs text-muted-foreground">Você concluiu {progress}% do curso até agora. Continue assim!</p>
        </div>

        {lastLesson && (
          <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B3A5C]">Continuar de onde parei</span>
              <h2 className="text-lg font-bold text-[#1A1A1A] line-clamp-1">{lastLesson.title}</h2>
            </div>
            <Button 
              className="mt-4 w-full bg-[#1B3A5C] hover:bg-[#1B3A5C]/90 text-white rounded-xl h-11"
              onClick={() => {
                // Navigate to lesson player
                const params = new URLSearchParams(window.location.search);
                params.set('view', 'lesson-player');
                params.set('id', lastLesson.id);
                window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Assistir Agora
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Módulos do Curso</h2>
          <Button variant="link" className="text-[#1B3A5C] font-bold text-sm">Ver tudo <ArrowRight className="w-4 h-4 ml-1" /></Button>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder modules - in a real app these would be fetched */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-[#F0F0F0] hover:border-[#1B3A5C]/20 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center mb-4 group-hover:bg-[#1B3A5C]/5 transition-colors">
                <Clock className="w-5 h-5 text-muted-foreground group-hover:text-[#1B3A5C]" />
              </div>
              <h3 className="font-bold text-[#1A1A1A] mb-1">Módulo {i}</h3>
              <p className="text-xs text-muted-foreground">Em breve conteúdo completo</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
