import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Circle, Trophy, BookOpen, Clock, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProgressView() {
  const [stats, setStats] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*, lessons(*)')
        .order('order', { ascending: true });

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user?.id)
        .eq('completed', true);

      if (modulesData) {
        let totalLessons = 0;
        let completedTotal = progressData?.length || 0;

        const processed = modulesData.map(m => {
          totalLessons += m.lessons.length;
          const completedCount = m.lessons.filter((l: any) => progressData?.some(p => p.lesson_id === l.id)).length;
          const progress = m.lessons.length > 0 ? Math.round((completedCount / m.lessons.length) * 100) : 0;
          return { ...m, completedCount, progress };
        });

        const totalProgress = totalLessons > 0 ? Math.round((completedTotal / totalLessons) * 100) : 0;
        
        setStats({
          totalLessons,
          completedTotal,
          totalProgress,
          // Estimated 15 min per lesson
          timeRemaining: Math.round(((totalLessons - completedTotal) * 15) / 60)
        });
        setModules(processed);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B3A5C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Meu Progresso</h1>
        <p className="text-muted-foreground mt-1">Veja seu desempenho e o que ainda falta conquistar.</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-[#1B3A5C]" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{stats?.totalProgress}%</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Concluído</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{stats?.completedTotal}/{stats?.totalLessons}</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aulas assistidas</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[#F0F0F0] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">{stats?.timeRemaining}h</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tempo restante</p>
        </div>
      </div>

      <div className="p-8 bg-[#1B3A5C] rounded-[2rem] text-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Progresso Geral do Curso</h2>
          <span className="text-2xl font-black">{stats?.totalProgress}%</span>
        </div>
        <Progress value={stats?.totalProgress} className="h-3 bg-white/20" />
        <p className="text-sm opacity-80">Você está quase lá! Faltam apenas {stats?.totalLessons - stats?.completedTotal} aulas para finalizar sua jornada.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Progresso por Módulo</h2>
        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module.id} className="p-6 bg-white rounded-2xl border border-[#F0F0F0] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${module.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-[#F0F0F0] text-muted-foreground'}`}>
                    {module.progress === 100 ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <h3 className="font-bold text-[#1A1A1A]">{module.title}</h3>
                </div>
                <span className="text-sm font-bold text-[#1B3A5C]">{module.progress}%</span>
              </div>
              <Progress value={module.progress} className="h-1.5 bg-[#F0F0F0]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
