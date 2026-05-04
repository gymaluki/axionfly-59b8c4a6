import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Globe, ArrowUpRight } from 'lucide-react';

export const DashboardMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="relative mx-auto max-w-5xl mt-12 px-4"
    >
      <div className="relative group">
        {/* Glow behind */}
        <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />
        
        {/* Mockup Container */}
        <div className="relative rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
          {/* Header bar */}
          <div className="h-10 border-b border-primary/10 bg-muted/30 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="mx-auto bg-background/50 rounded-md px-3 py-0.5 text-[10px] text-muted-foreground font-mono">
              axionfly.site/dashboard
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-background/50 border border-primary/10 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Novos Leads</p>
                  <p className="text-xl font-black text-foreground">1.284</p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-background/50 border border-primary/10 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +8%
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sites Criados</p>
                  <p className="text-xl font-black text-foreground">542</p>
                </div>
              </div>
            </div>
            
            {/* Main Graph */}
            <div className="md:col-span-2 p-5 rounded-xl bg-background/50 border border-primary/10 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-foreground">Receita Estimada</h4>
                <div className="flex gap-1">
                  <div className="w-8 h-1 rounded-full bg-primary" />
                  <div className="w-8 h-1 rounded-full bg-primary/20" />
                </div>
              </div>
              
              <div className="flex items-end justify-between h-32 gap-2 mt-auto">
                {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 1 + i * 0.1, ease: "easeOut" }}
                    className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-sm relative group/bar"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      R$ {height * 10}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day) => (
                  <span key={day} className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating element 1 */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 p-4 rounded-xl glass border-primary/30 shadow-xl hidden md:block"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Contratos</p>
              <p className="text-lg font-black text-foreground">R$ 15.400</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
