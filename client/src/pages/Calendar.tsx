import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Dumbbell, Calendar as CalendarIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string | null;
}

interface Workout {
  id: number;
  name: string;
  date: Date;
  notes: string | null;
  exercises: Exercise[];
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: workouts } = trpc.workouts.list.useQuery();

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      workouts: Workout[];
    }> = [];

    // Add previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        workouts: [],
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayWorkouts = workouts?.filter((w) => {
        const workoutDate = new Date(w.date);
        return (
          workoutDate.getDate() === day &&
          workoutDate.getMonth() === month &&
          workoutDate.getFullYear() === year
        );
      }) || [];

      days.push({
        date,
        isCurrentMonth: true,
        workouts: dayWorkouts,
      });
    }

    // Add next month's leading days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        workouts: [],
      });
    }

    return days;
  }, [currentDate, workouts]);

  const selectedDayWorkouts = useMemo(() => {
    if (!selectedDate || !workouts) return [];
    return workouts.filter((w) => {
      const workoutDate = new Date(w.date);
      return (
        workoutDate.getDate() === selectedDate.getDate() &&
        workoutDate.getMonth() === selectedDate.getMonth() &&
        workoutDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [selectedDate, workouts]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Calendário de Treinos
            </h1>
            <p className="text-muted-foreground">
              Visualize seus treinos ao longo do mês
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              Hoje
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-white font-semibold min-w-[200px] text-center capitalize">
                {monthName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="text-white hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="glass border-white/5 p-6 lg:col-span-2">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarData.map((day, index) => {
                const hasWorkouts = day.workouts.length > 0;
                const totalVolume = day.workouts.reduce((sum, w) => {
                  return sum + (w.exercises?.reduce((exSum: number, ex: Exercise) => 
                    exSum + ex.sets * ex.reps * ex.weight, 0) || 0);
                }, 0);
                const isSelected =
                  selectedDate &&
                  day.date.getDate() === selectedDate.getDate() &&
                  day.date.getMonth() === selectedDate.getMonth() &&
                  day.date.getFullYear() === selectedDate.getFullYear();

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={cn(
                      "relative aspect-square rounded-lg p-2 transition-all",
                      "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      day.isCurrentMonth ? "text-white" : "text-muted-foreground/50",
                      isToday(day.date) && "ring-2 ring-primary/50",
                      isSelected && "bg-primary/20 ring-2 ring-primary",
                      !day.isCurrentMonth && "opacity-50"
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-sm font-medium">{day.date.getDate()}</span>
                      {hasWorkouts && (
                        <div className="flex-1 flex items-center justify-center mt-1">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              totalVolume > 5000 ? "bg-green-400" :
                              totalVolume > 3000 ? "bg-blue-400" :
                              "bg-primary"
                            )}
                          />
                        </div>
                      )}
                      {day.workouts.length > 1 && (
                        <span className="text-xs text-muted-foreground mt-auto">
                          {day.workouts.length}x
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Volume baixo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-xs text-muted-foreground">Volume médio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground">Volume alto</span>
              </div>
            </div>
          </Card>

          {/* Selected day details */}
          <Card className="glass border-white/5 p-6">
            {selectedDate ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-white">
                      {selectedDate.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                  </div>
                </div>

                {selectedDayWorkouts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayWorkouts.map((workout) => {
                      const totalVolume = workout.exercises?.reduce(
                        (sum: number, ex: Exercise) => sum + ex.sets * ex.reps * ex.weight,
                        0
                      ) || 0;

                      return (
                        <div
                          key={workout.id}
                          className="p-4 bg-white/5 rounded-lg border border-white/5"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 shrink-0">
                              <Dumbbell className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white truncate">
                                {workout.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {workout.exercises?.length || 0} exercícios • {totalVolume.toLocaleString()} kg
                              </p>
                            </div>
                          </div>

                          {workout.notes && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {workout.notes}
                            </p>
                          )}

                          {workout.exercises && workout.exercises.length > 0 && (
                            <div className="space-y-2">
                              {workout.exercises.slice(0, 3).map((exercise: Exercise) => (
                                <div
                                  key={exercise.id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-muted-foreground truncate">
                                    {exercise.name}
                                  </span>
                                  <span className="text-white font-medium ml-2 shrink-0">
                                    {exercise.sets}×{exercise.reps} @ {exercise.weight}kg
                                  </span>
                                </div>
                              ))}
                              {workout.exercises.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center pt-1">
                                  +{workout.exercises.length - 3} exercícios
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum treino registrado neste dia
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Selecione um dia no calendário
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
