import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "#home" },
    { name: "Funcionalidades", href: "#features" },
    { name: "Diário", href: "#diary" },
    { name: "Progresso", href: "#progress" },
    { name: "Planos", href: "#plans" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/50 transition-all duration-300">
            <span className="text-primary font-display font-bold text-xl">T</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            TREINO<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">Olá, {user?.name || 'Atleta'}</span>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-6 shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_25px_-5px_var(--color-primary)] transition-all duration-300"
              >
                Ir para Dashboard
              </Button>
            </>
          ) : (
            <>
              <a href={getLoginUrl()} className="text-sm font-medium text-white hover:text-primary transition-colors">
                Entrar
              </a>
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-6 shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_25px_-5px_var(--color-primary)] transition-all duration-300"
              >
                Começar Grátis
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-muted-foreground hover:text-white py-2 border-b border-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            {isAuthenticated ? (
              <Button 
                onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full bg-primary text-primary-foreground font-bold rounded-lg py-6"
              >
                Ir para Dashboard
              </Button>
            ) : (
              <>
                <a 
                  href={getLoginUrl()}
                  className="text-center py-3 text-white font-medium border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </a>
                <Button 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="w-full bg-primary text-primary-foreground font-bold rounded-lg py-6"
                >
                  Começar Grátis
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
