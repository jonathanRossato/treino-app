import { ClipboardList, TrendingUp, CalendarCheck, Camera } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Registre seus treinos",
    description: "Escolha o treino do dia, os exercícios, séries, repetições e cargas.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    icon: TrendingUp,
    title: "2. Controle a carga",
    description: "Veja como seus pesos aumentam ao longo das semanas com gráficos automáticos.",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20"
  },
  {
    icon: CalendarCheck,
    title: "3. Marque a frequência",
    description: "Calendário visual para saber quando treinou e quais grupos musculares.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  },
  {
    icon: Camera,
    title: "4. Acompanhe no espelho",
    description: "Tire fotos semanais em uma área privada e compare sua evolução real.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative bg-black/20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Como o app cuida da <br />
            <span className="text-primary">sua rotina</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Um fluxo simples pensado para quem treina de verdade. Sem burocracia, apenas resultados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10">
              <div className={`glass p-6 rounded-2xl border ${step.border} hover:bg-white/5 transition-all duration-300 h-full flex flex-col items-center text-center group`}>
                <div className={`w-16 h-16 rounded-full ${step.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)]`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
