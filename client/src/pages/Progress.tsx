import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Calendar, Dumbbell, Target, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Progress() {
  const [selectedExercise, setSelectedExercise] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30");
  
  const { data: workouts } = trpc.workouts.list.useQuery();

  // Process data for charts
  const { exerciseData, volumeData, exerciseList, stats } = useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return { exerciseData: [], volumeData: [], exerciseList: [], stats: { totalWorkouts: 0, totalVolume: 0, avgVolume: 0, consistency: 0 } };
    }

    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredWorkouts = workouts.filter(w => new Date(w.date) >= cutoffDate);

    // Get all unique exercises
    const exercises = new Set<string>();
    filteredWorkouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach((ex: any) => exercises.add(ex.name));
      }
    });

    const exerciseList = Array.from(exercises);

    // Prepare data for line chart (weight progression)
    const exerciseProgressMap = new Map<string, Map<string, number>>();
    
    filteredWorkouts.forEach(workout => {
      const date = new Date(workout.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      if (workout.exercises) {
        workout.exercises.forEach((ex: any) => {
          if (selectedExercise === "all" || ex.name === selectedExercise) {
            if (!exerciseProgressMap.has(ex.name)) {
              exerciseProgressMap.set(ex.name, new Map());
            }
            const dateMap = exerciseProgressMap.get(ex.name)!;
            const currentMax = dateMap.get(date) || 0;
            dateMap.set(date, Math.max(currentMax, ex.weight));
          }
        });
      }
    });

    // Convert to chart data
    const exerciseData: any[] = [];
    const allDates = new Set<string>();
    
    filteredWorkouts.forEach(w => {
      allDates.add(new Date(w.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    });

    const sortedDates = Array.from(allDates).sort((a, b) => {
      const [dayA, monthA] = a.split('/').map(Number);
      const [dayB, monthB] = b.split('/').map(Number);
      return (monthA * 100 + dayA) - (monthB * 100 + dayB);
    });

    sortedDates.forEach(date => {
      const dataPoint: any = { date };
      exerciseProgressMap.forEach((dateMap, exerciseName) => {
        if (dateMap.has(date)) {
          dataPoint[exerciseName] = dateMap.get(date);
        }
      });
      if (Object.keys(dataPoint).length > 1) {
        exerciseData.push(dataPoint);
      }
    });

    // Prepare data for volume chart (total volume per workout)
    const volumeData = filteredWorkouts.map(workout => {
      let totalVolume = 0;
      if (workout.exercises) {
        workout.exercises.forEach((ex: any) => {
          totalVolume += ex.sets * ex.reps * ex.weight;
        });
      }
      return {
        date: new Date(workout.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        volume: totalVolume,
        name: workout.name,
      };
    }).reverse();

    // Calculate stats
    const totalWorkouts = filteredWorkouts.length;
    const totalVolume = volumeData.reduce((sum, d) => sum + d.volume, 0);
    const avgVolume = totalWorkouts > 0 ? Math.round(totalVolume / totalWorkouts) : 0;
    
    // Consistency: percentage of days with workouts
    const uniqueDays = new Set(filteredWorkouts.map(w => new Date(w.date).toDateString())).size;
    const consistency = Math.round((uniqueDays / days) * 100);

    return { 
      exerciseData, 
      volumeData, 
      exerciseList, 
      stats: { totalWorkouts, totalVolume, avgVolume, consistency } 
    };
  }, [workouts, selectedExercise, timeRange]);

  const colors = [
    "#10b981", // green
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Progresso e Evolução
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua evolução de carga e volume ao longo do tempo
            </p>
          </div>

          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Última semana</SelectItem>
                <SelectItem value="30">Último mês</SelectItem>
                <SelectItem value="90">3 meses</SelectItem>
                <SelectItem value="180">6 meses</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Todos exercícios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos exercícios</SelectItem>
                {exerciseList.map(ex => (
                  <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass p-6 border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total de Treinos</h3>
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalWorkouts}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Últimos {timeRange} dias
            </p>
          </Card>

          <Card className="glass p-6 border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Volume Total</h3>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.totalVolume.toLocaleString()}
              <span className="text-lg text-muted-foreground ml-1">kg</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Séries × Reps × Carga
            </p>
          </Card>

          <Card className="glass p-6 border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Média por Treino</h3>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.avgVolume.toLocaleString()}
              <span className="text-lg text-muted-foreground ml-1">kg</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Volume médio
            </p>
          </Card>

          <Card className="glass p-6 border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Consistência</h3>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.consistency}
              <span className="text-lg text-muted-foreground ml-1">%</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Dias com treino
            </p>
          </Card>
        </div>

        {/* Charts */}
        {workouts && workouts.length > 0 ? (
          <>
            {/* Weight Progression Chart */}
            <Card className="glass p-6 border-white/5">
              <h2 className="text-xl font-display font-bold text-white mb-6">
                Evolução de Carga
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Carga (kg)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    {selectedExercise === "all" ? (
                      exerciseList.slice(0, 6).map((exerciseName, index) => (
                        <Line
                          key={exerciseName}
                          type="monotone"
                          dataKey={exerciseName}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ))
                    ) : (
                      <Line
                        type="monotone"
                        dataKey={selectedExercise}
                        stroke={colors[0]}
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {selectedExercise === "all" && exerciseList.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {exerciseList.slice(0, 6).map((exerciseName, index) => (
                    <div key={exerciseName} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-xs text-muted-foreground">{exerciseName}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Volume Chart */}
            <Card className="glass p-6 border-white/5">
              <h2 className="text-xl font-display font-bold text-white mb-6">
                Volume por Treino
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`${value} kg`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill={colors[1]} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        ) : (
          <Card className="glass p-12 border-white/5">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Você ainda não tem dados suficientes para visualizar gráficos.
              </p>
              <p className="text-sm text-muted-foreground">
                Registre seus treinos para acompanhar sua evolução!
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
