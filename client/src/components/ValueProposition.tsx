import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ValueProposition() {
  return (
    <section className="py-24 relative">
      <div className="container">
        {/* Section 1: Diary Focus */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[100px]" />
            <div className="relative glass rounded-2xl p-8 border border-white/10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-white font-bold text-lg">Treino A - Costas e Bíceps</h4>
                  <p className="text-sm text-muted-foreground">Último treino: Há 2 dias</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                  Em andamento
                </span>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Puxada Alta", sets: "4x12", load: "55kg", done: true },
                  { name: "Remada Curvada", sets: "4x10", load: "60kg", done: true },
                  { name: "Rosca Direta", sets: "3x12", load: "14kg", done: false },
                  { name: "Rosca Martelo", sets: "3x15", load: "16kg", done: false },
                ].map((ex, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${ex.done ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${ex.done ? 'border-primary bg-primary text-black' : 'border-muted-foreground'}`}>
                        {ex.done && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`font-medium ${ex.done ? 'text-primary' : 'text-white'}`}>{ex.name}</p>
                        <p className="text-xs text-muted-foreground">{ex.sets} • {ex.load}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Foco total no seu treino, <br />
              <span className="text-primary">sem distrações</span>.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Chega de notas soltas no celular ou cadernos velhos. Tenha um diário digital organizado, que lembra suas cargas anteriores e sugere progressões.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Histórico completo de cargas por exercício",
                "Cronômetro de descanso integrado",
                "Calculadora de 1RM automática",
                "Notas de performance para cada série"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="rounded-full px-8 border-white/20 hover:bg-white/10 text-white">
              Conhecer o Diário
            </Button>
          </div>
        </div>

        {/* Section 2: Photo Gallery Focus */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Sua evolução visível, <br />
              <span className="text-blue-400">semana a semana</span>.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A balança mente, o espelho engana, mas as fotos não. Crie uma galeria privada e segura para comparar seu físico e ver onde você realmente evoluiu.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Galeria criptografada e 100% privada",
                "Ferramenta de comparação Antes x Depois",
                "Organização automática por data",
                "Tags por pose (Frente, Costas, Perfil)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg shadow-blue-900/20">
              Começar Galeria Privada
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-[100px]" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`glass rounded-2xl p-2 border border-white/10 aspect-[3/4] flex items-center justify-center relative overflow-hidden group ${i % 2 === 0 ? 'translate-y-8' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                  <div className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-bold text-sm">Semana {i}</p>
                    <p className="text-xs text-muted-foreground">12 Out 2023</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Camera } from "lucide-react";
