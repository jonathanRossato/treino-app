import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Pratica musculação há 5 anos",
    content: "Finalmente um app que foca no que importa: carga e consistência. Parei de usar o bloco de notas do celular e agora vejo minha evolução de verdade.",
    rating: 5
  },
  {
    name: "Amanda Costa",
    role: "Focada em hipertrofia",
    content: "A área de fotos privada é genial. Consigo ver exatamente onde meu corpo mudou nas últimas 12 semanas. Muito motivador!",
    rating: 5
  },
  {
    name: "Lucas Mendes",
    role: "Powerlifting amador",
    content: "Os gráficos de progressão de carga são essenciais para o meu treino de força. Simples, direto e funciona perfeitamente.",
    rating: 5
  }
];

export default function SocialProof() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Quem usa, <span className="text-blue-400">evolui</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Junte-se a milhares de atletas que levaram seu treino para o próximo nível.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className="glass p-8 rounded-2xl border border-white/5 relative group hover:-translate-y-1 transition-transform duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-white/90 leading-relaxed mb-6">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
