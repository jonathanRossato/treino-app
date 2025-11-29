import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Hero() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleCreateDiary = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col gap-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Novo App de Treino</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white">
            Seu diário de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">evolução física</span>
            <span className="text-primary">.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
            Registre seus treinos, acompanhe sua progressão de carga e veja sua evolução semana a semana com fotos privadas e métricas claras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              size="lg" 
              onClick={handleCreateDiary}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg h-14 px-8 rounded-full shadow-[0_0_30px_-10px_var(--color-primary)] hover:shadow-[0_0_40px_-10px_var(--color-primary)] transition-all duration-300 group"
            >
              Criar meu diário agora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/5 hover:text-white font-medium text-lg h-14 px-8 rounded-full backdrop-blur-sm"
            >
              Ver como funciona
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Focado em musculação</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Fotos 100% privadas</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Evolução em gráficos</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visuals */}
        <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
          {/* Main Dashboard Card */}
          <div className="relative z-20 w-full max-w-md glass rounded-2xl p-6 border border-white/10 shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500">
            {/* Mockup Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">Treino de Peito</h3>
                <p className="text-xs text-muted-foreground">Hoje, 18:30</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Mockup List */}
            <div className="space-y-4">
              {[
                { name: "Supino Reto", sets: "4x10", weight: "80kg", progress: "+2kg" },
                { name: "Supino Inclinado", sets: "3x12", weight: "60kg", progress: "+0kg" },
                { name: "Crucifixo", sets: "3x15", weight: "18kg", progress: "+2kg" },
              ].map((exercise, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{exercise.name}</p>
                    <p className="text-xs text-muted-foreground">{exercise.sets}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{exercise.weight}</p>
                    <p className="text-xs text-primary">{exercise.progress}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mockup Chart Area */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between items-end h-24 gap-2">
                {[40, 65, 50, 80, 60, 90, 100].map((h, i) => (
                  <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-primary transition-all duration-1000 ease-out"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">Volume Semanal</p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -right-4 top-20 z-30 glass p-4 rounded-xl animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Supino Reto</p>
                <p className="text-sm font-bold text-white">+5kg essa semana</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-8 bottom-32 z-30 glass p-4 rounded-xl animate-bounce-slow delay-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Foto Semanal</p>
                <p className="text-sm font-bold text-white">Registrada com sucesso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
