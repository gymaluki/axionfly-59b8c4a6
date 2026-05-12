import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, CheckCircle2, Lock, Clock, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  order: number;
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  progress?: number;
}

export default function CourseListView() {
  const [modules, setModules] = useState<Module[]>([]);
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
        .eq('user_id', user?.id);

      if (modulesData) {
        const processedModules = modulesData.map((m: any) => {
          const lessons = m.lessons.map((l: any) => ({
            ...l,
            completed: progressData?.find(p => p.lesson_id === l.id)?.completed || false
          })).sort((a: any, b: any) => a.order - b.order);

          const completedCount = lessons.filter((l: any) => l.completed).length;
          const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

          return { ...m, lessons, progress };
        });
        setModules(processedModules);
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
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Minhas Aulas</h1>
        <p className="text-muted-foreground mt-1">Explore os módulos e acompanhe sua jornada.</p>
      </header>

      <Accordion type="multiple" defaultValue={[modules[0]?.id]} className="space-y-4">
        {modules.map((module) => (
          <AccordionItem 
            key={module.id} 
            value={module.id}
            className="bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden px-6"
          >
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex flex-col items-start text-left gap-2 w-full pr-4">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{module.title}</h3>
                  <span className="text-xs font-bold text-muted-foreground">{module.lessons.length} aulas</span>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <Progress value={module.progress} className="h-1.5 flex-1 bg-[#F0F0F0]" />
                  <span className="text-[10px] font-bold text-[#1B3A5C] min-w-[30px]">{module.progress}%</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F0F0F0]/50 transition-colors cursor-pointer group border border-transparent hover:border-[#F0F0F0]"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set('view', 'lesson-player');
                      params.set('id', lesson.id);
                      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-green-50 text-green-500' : 'bg-[#F0F0F0] text-muted-foreground'}`}>
                        {lesson.completed ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${lesson.completed ? 'text-muted-foreground' : 'text-[#1A1A1A]'}`}>{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-medium">{lesson.duration || "15:00"}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
