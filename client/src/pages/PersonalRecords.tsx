import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trophy, TrendingUp, Calendar, Search, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ExercisePR {
  exerciseName: string;
  maxWeight: number;
  date: Date;
  sets: number;
  reps: number;
}

export default function PersonalRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: workouts } = trpc.workouts.list.useQuery();

  // Calculate PRs from workouts
  const personalRecords: ExercisePR[] = [];
  const exerciseMap = new Map<string, ExercisePR>();

  workouts?.forEach((workout) => {
    workout.exercises?.forEach((exercise) => {
      const existing = exerciseMap.get(exercise.name);
      if (!existing || exercise.weight > existing.maxWeight) {
        exerciseMap.set(exercise.name, {
          exerciseName: exercise.name,
          maxWeight: exercise.weight,
          date: workout.date,
          sets: exercise.sets,
          reps: exercise.reps,
        });
      }
    });
  });

  personalRecords.push(...Array.from(exerciseMap.values()));
  personalRecords.sort((a, b) => b.maxWeight - a.maxWeight);

  const filteredRecords = personalRecords.filter((record) =>
    record.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalExercises = personalRecords.length;
  const totalWeight = personalRecords.reduce((sum, r) => sum + r.maxWeight, 0);
  const avgWeight = totalExercises > 0 ? Math.round(totalWeight / totalExercises) : 0;
  const topPR = personalRecords[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Recordes Pessoais
          </h1>
          <p className="text-muted-foreground">
            Acompanhe suas maiores cargas por exercício
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de PRs</p>
                <p className="text-2xl font-bold text-white">{totalExercises}</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 border border-primary/30">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carga Média</p>
                <p className="text-2xl font-bold text-white">{avgWeight} kg</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/30">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maior PR</p>
                <p className="text-2xl font-bold text-white">
                  {topPR ? `${topPR.maxWeight} kg` : "-"}
                </p>
                {topPR && (
                  <p className="text-xs text-muted-foreground truncate">
                    {topPR.exerciseName}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar exercício..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
          />
        </div>

        {/* PRs List */}
        {filteredRecords.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredRecords.map((record, index) => (
              <Card
                key={record.exerciseName}
                className="glass border-white/5 p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {index === 0 && (
                        <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      )}
                      {index === 1 && (
                        <Trophy className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      {index === 2 && (
                        <Trophy className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      )}
                      <h3 className="text-lg font-semibold text-white truncate">
                        {record.exerciseName}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Carga Máxima</span>
                        <span className="text-xl font-bold text-primary">
                          {record.maxWeight} kg
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Séries x Reps</span>
                        <span className="text-white">
                          {record.sets} x {record.reps}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-white/5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(record.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass p-12 border-white/5">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhum recorde encontrado para essa busca."
                  : "Você ainda não tem recordes pessoais. Comece a treinar!"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
