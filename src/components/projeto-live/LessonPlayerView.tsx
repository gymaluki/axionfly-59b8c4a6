import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LessonPlayerView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("id");
  const [lesson, setLesson] = useState<any>(null);
  const [moduleLessons, setModuleLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!lessonId) return;

    const fetchData = async () => {
      setLoading(true);
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*, modules(*)')
        .eq('id', lessonId)
        .maybeSingle();

      if (lessonData) {
        setLesson(lessonData);
        
        // Fetch all lessons in the same module
        const { data: siblingLessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', lessonData.module_id)
          .order('order', { ascending: true });
        
        setModuleLessons(siblingLessons || []);

        // Check if completed
        const { data: { user } } = await supabase.auth.getUser();
        const { data: progress } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', user?.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();
        
        setIsCompleted(progress?.completed || false);
      }
      setLoading(false);
    };

    fetchData();
  }, [lessonId]);

  const toggleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newValue = !isCompleted;
      
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: newValue,
          completed_at: newValue ? new Date().toISOString() : null
        }, { onConflict: 'user_id,lesson_id' });

      if (error) throw error;
      
      setIsCompleted(newValue);
      toast({
        title: newValue ? "Aula concluída! 🎉" : "Aula marcada como pendente.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar progresso",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const navigateToLesson = (id: string) => {
    setSearchParams({ view: 'lesson-player', id });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B3A5C]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Aula não encontrada.</p>
        <Button variant="link" onClick={() => setSearchParams({ view: 'aulas' })}>Voltar para a lista</Button>
      </div>
    );
  }

  const currentIndex = moduleLessons.findIndex(l => l.id === lessonId);
  const prevLesson = moduleLessons[currentIndex - 1];
  const nextLesson = moduleLessons[currentIndex + 1];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">
      {/* Left Column: Player */}
      <div className="flex-1 space-y-6">
        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#F0F0F0]">
          {/* Simple embed or video tag based on URL */}
          {lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be') ? (
             <iframe 
                src={`https://www.youtube.com/embed/${lesson.video_url.split('v=')[1] || lesson.video_url.split('/').pop()}`}
                className="w-full h-full"
                allowFullScreen
             />
          ) : (
            <video src={lesson.video_url} controls className="w-full h-full" />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B3A5C]">{lesson.modules?.title}</span>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">{lesson.title}</h1>
            </div>
            <Button 
              onClick={toggleComplete}
              variant={isCompleted ? "outline" : "default"}
              className={`rounded-xl px-6 h-11 font-bold ${isCompleted ? 'border-green-200 text-green-600 bg-green-50' : 'bg-[#1B3A5C] hover:bg-[#1B3A5C]/90 text-white'}`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null}
              {isCompleted ? "Concluída" : "Marcar como concluída"}
            </Button>
          </div>

          <p className="text-[#4A4A4A] leading-relaxed max-w-3xl">
            {lesson.description || "Nenhuma descrição disponível para esta aula."}
          </p>

          <div className="flex items-center justify-between pt-8 border-t border-[#F0F0F0]">
            <Button 
              variant="ghost" 
              disabled={!prevLesson}
              onClick={() => navigateToLesson(prevLesson.id)}
              className="text-sm font-bold text-[#1B3A5C]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Aula anterior
            </Button>
            <Button 
              variant="ghost" 
              disabled={!nextLesson}
              onClick={() => navigateToLesson(nextLesson.id)}
              className="text-sm font-bold text-[#1B3A5C]"
            >
              Próxima aula <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Playlist */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <h3 className="font-bold text-[#1A1A1A] px-2">Aulas do Módulo</h3>
        <div className="space-y-1 bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden p-2">
          {moduleLessons.map((l, index) => (
            <button
              key={l.id}
              onClick={() => navigateToLesson(l.id)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${l.id === lessonId ? 'bg-[#F0F0F0] text-[#1A1A1A]' : 'hover:bg-[#F0F0F0]/50 text-muted-foreground'}`}
            >
              <div className="w-6 h-6 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${l.id === lessonId ? 'text-[#1B3A5C]' : ''}`}>{l.title}</p>
                <span className="text-[10px] font-medium opacity-60">{l.duration || "15:00"}</span>
              </div>
              {l.id === lessonId && <PlayCircle className="w-4 h-4 text-[#1B3A5C] shrink-0 self-center" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
