import { Dumbbell, LineChart, Calendar, Camera, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Diário de Treinos",
    description: "Crie fichas, registre exercícios, séries, repetições e cargas em poucos cliques.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: LineChart,
    title: "Progressão de Carga",
    description: "Visualize gráficos claros da sua evolução de força em cada exercício.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Calendar,
    title: "Calendário de Rotina",
    description: "Acompanhe sua consistência mensal e nunca perca o dia de treino.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Camera,
    title: "Fotos de Evolução",
    description: "Compare seu físico semana a semana com ferramentas de antes e depois.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: Lock,
    title: "100% Privado",
    description: "Suas fotos e dados são seus. Área segura e criptografada.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: TrendingUp,
    title: "Painel de Metas",
    description: "Defina objetivos e acompanhe o quanto falta para alcançá-los.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Tudo o que você precisa para <br />
            <span className="text-primary">evoluir de verdade</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ferramentas profissionais simplificadas para quem leva o treino a sério, mas não quer perder tempo com planilhas complexas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group glass p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/5"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
