import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Activity, Calendar, Camera, TrendingUp, Dumbbell, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string | null;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const { data: workouts } = trpc.workouts.list.useQuery();
  const { data: photos } = trpc.photos.list.useQuery();

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return {
        thisWeek: { workouts: 0, volume: 0, exercises: new Set() },
        lastWeek: { workouts: 0, volume: 0, exercises: new Set() },
      };
    }

    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    const thisWeekWorkouts = workouts.filter(w => new Date(w.date) >= thisWeekStart);
    const lastWeekWorkouts = workouts.filter(w => {
      const date = new Date(w.date);
      return date >= lastWeekStart && date <= lastWeekEnd;
    });

    const calculateStats = (workoutList: typeof workouts) => {
      let volume = 0;
      const exercises = new Set<string>();

      workoutList.forEach(workout => {
        if (workout.exercises) {
          workout.exercises.forEach((ex: Exercise) => {
            volume += ex.sets * ex.reps * ex.weight;
            exercises.add(ex.name);
          });
        }
      });

      return {
        workouts: workoutList.length,
        volume,
        exercises,
      };
    };

    return {
      thisWeek: calculateStats(thisWeekWorkouts),
      lastWeek: calculateStats(lastWeekWorkouts),
    };
  }, [workouts]);

  const getChangeIndicator = (current: number, previous: number) => {
    if (previous === 0) return { icon: Minus, color: "text-muted-foreground", text: "—" };
    
    const percentChange = ((current - previous) / previous) * 100;
    
    if (percentChange > 0) {
      return { 
        icon: ArrowUp, 
        color: "text-green-400", 
        text: `+${percentChange.toFixed(0)}%` 
      };
    } else if (percentChange < 0) {
      return { 
        icon: ArrowDown, 
        color: "text-red-400", 
        text: `${percentChange.toFixed(0)}%` 
      };
    } else {
      return { 
        icon: Minus, 
        color: "text-muted-foreground", 
        text: "0%" 
      };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const quickActions = [
    {
      icon: Activity,
      title: "Novo Treino",
      description: "Registre seu treino de hoje",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      action: () => navigate("/workouts/new"),
    },
    {
      icon: Calendar,
      title: "Ver Calendário",
      description: "Acompanhe sua frequência",
      color: "text-green-400",
      bg: "bg-green-400/10",
      action: () => navigate("/calendar"),
    },
    {
      icon: Camera,
      title: "Adicionar Foto",
      description: "Registre sua evolução visual",
      color: "text-pink-400",
      bg: "bg-pink-400/10",
      action: () => navigate("/photos"),
    },
    {
      icon: TrendingUp,
      title: "Ver Progresso",
      description: "Analise seus gráficos",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      action: () => navigate("/progress"),
    },
  ];

  const workoutsChange = getChangeIndicator(weeklyStats.thisWeek.workouts, weeklyStats.lastWeek.workouts);
  const volumeChange = getChangeIndicator(weeklyStats.thisWeek.volume, weeklyStats.lastWeek.volume);
  const exercisesChange = getChangeIndicator(weeklyStats.thisWeek.exercises.size, weeklyStats.lastWeek.exercises.size);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Bem-vindo de volta, {user?.name || "Atleta"}! 💪
          </h1>
          <p className="text-muted-foreground">
            Continue sua jornada de evolução. O que vamos treinar hoje?
          </p>
        </div>

        {/* Weekly Stats with Comparison */}
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-4">
            Resumo da Semana
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Dias Treinados</h3>
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white">{weeklyStats.thisWeek.workouts}</p>
                <div className={`flex items-center gap-1 ${workoutsChange.color}`}>
                  <workoutsChange.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{workoutsChange.text}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                vs. semana passada: {weeklyStats.lastWeek.workouts}
              </p>
            </Card>

            <Card className="glass p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Volume Total</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white">
                  {weeklyStats.thisWeek.volume.toLocaleString()}
                  <span className="text-lg text-muted-foreground ml-1">kg</span>
                </p>
                <div className={`flex items-center gap-1 ${volumeChange.color}`}>
                  <volumeChange.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{volumeChange.text}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                vs. semana passada: {weeklyStats.lastWeek.volume.toLocaleString()} kg
              </p>
            </Card>

            <Card className="glass p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Exercícios Únicos</h3>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white">{weeklyStats.thisWeek.exercises.size}</p>
                <div className={`flex items-center gap-1 ${exercisesChange.color}`}>
                  <exercisesChange.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{exercisesChange.text}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                vs. semana passada: {weeklyStats.lastWeek.exercises.size}
              </p>
            </Card>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="glass p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group border-white/5"
                onClick={action.action}
              >
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-4">
            Visão Geral
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total de Treinos</h3>
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-white">{workouts?.length || 0}</p>
            </Card>

            <Card className="glass p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Fotos de Progresso</h3>
                <Camera className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-3xl font-bold text-white">{photos?.length || 0}</p>
            </Card>

            <Card className="glass p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Últimos 30 Dias</h3>
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                {workouts?.filter(w => {
                  const monthAgo = new Date();
                  monthAgo.setDate(monthAgo.getDate() - 30);
                  return new Date(w.date) >= monthAgo;
                }).length || 0}
              </p>
            </Card>
          </div>
        </div>

        {/* Recent Workouts */}
        <Card className="glass p-8 border-white/5">
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Treinos Recentes
          </h2>
          {workouts && workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.slice(0, 5).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div>
                    <h3 className="font-semibold text-white">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.date).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Você ainda não registrou nenhum treino.
              </p>
              <button
                onClick={() => navigate("/workouts/new")}
                className="text-primary hover:underline font-medium"
              >
                Registrar seu primeiro treino →
              </button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
