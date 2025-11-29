import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Twitter, Youtube } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="glass rounded-3xl p-12 md:p-24 text-center border border-white/10 relative overflow-hidden group">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-700" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Comece a evoluir <br />
              <span className="text-primary">hoje mesmo</span>.
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Pare de treinar no escuro. Tenha controle total sobre suas cargas, frequência e resultados. O plano Grátis é vitalício.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg h-14 px-10 rounded-full shadow-[0_0_30px_-10px_var(--color-primary)] hover:shadow-[0_0_40px_-10px_var(--color-primary)] transition-all duration-300"
              >
                Criar conta grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/20 text-white hover:bg-white/5 hover:text-white font-medium text-lg h-14 px-10 rounded-full backdrop-blur-sm"
              >
                Ver planos PRO
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              Sem cartão de crédito necessário. Cancele quando quiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                <span className="text-primary font-display font-bold text-xl">T</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                TREINO<span className="text-primary">.</span>
              </span>
            </a>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              A plataforma definitiva para quem leva o treino a sério. Registre, analise e evolua com dados reais e fotos privadas.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Produto</h4>
            <ul className="space-y-4">
              {["Funcionalidades", "Planos", "Depoimentos", "FAQ", "Changelog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              {["Termos de Uso", "Privacidade", "Cookies", "Contato"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Treino App. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
