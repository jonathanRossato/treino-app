import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dumbbell, Calendar, Edit, Trash2, Search, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string | null;
}

export default function WorkoutHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<any | null>(null);
  const [deletingWorkoutId, setDeletingWorkoutId] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const { data: workouts, refetch } = trpc.workouts.list.useQuery();
  
  const createWorkout = trpc.workouts.create.useMutation({
    onSuccess: () => {
      toast.success("Treino duplicado com sucesso!");
      navigate("/workouts/new");
    },
    onError: (error) => {
      toast.error("Erro ao duplicar treino: " + error.message);
    },
  });

  const deleteWorkout = trpc.workouts.delete.useMutation({
    onSuccess: () => {
      toast.success("Treino excluído com sucesso!");
      setDeletingWorkoutId(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao excluir treino: " + error.message);
    },
  });

  const updateWorkout = trpc.workouts.update.useMutation({
    onSuccess: () => {
      toast.success("Treino atualizado com sucesso!");
      setEditingWorkout(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar treino: " + error.message);
    },
  });

  const filteredWorkouts = workouts?.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (workout: any) => {
    setEditingWorkout({
      id: workout.id,
      name: workout.name,
      date: new Date(workout.date).toISOString().split("T")[0],
      notes: workout.notes || "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingWorkout) return;

    updateWorkout.mutate({
      id: editingWorkout.id,
      name: editingWorkout.name,
      date: new Date(editingWorkout.date),
      notes: editingWorkout.notes,
    });
  };

  const handleDelete = (id: number) => {
    deleteWorkout.mutate({ id });
  };

  const handleDuplicate = (workout: any) => {
    const exercises = workout.exercises?.map((ex: Exercise) => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      notes: ex.notes || undefined,
    })) || [];

    createWorkout.mutate({
      name: `${workout.name} (Cópia)`,
      date: new Date(),
      notes: workout.notes || undefined,
      exercises,
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedWorkoutId(expandedWorkoutId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Histórico de Treinos
            </h1>
            <p className="text-muted-foreground">
              Visualize, edite e gerencie todos os seus treinos registrados
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do treino..."
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Workouts List */}
        {filteredWorkouts && filteredWorkouts.length > 0 ? (
          <div className="space-y-4">
            {filteredWorkouts.map((workout) => {
              const isExpanded = expandedWorkoutId === workout.id;
              const totalVolume = workout.exercises?.reduce(
                (sum: number, ex: Exercise) => sum + ex.sets * ex.reps * ex.weight,
                0
              ) || 0;

              return (
                <Card key={workout.id} className="glass border-white/5 overflow-hidden">
                  {/* Workout Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30">
                            <Dumbbell className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {workout.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(workout.date).toLocaleDateString("pt-BR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {workout.notes && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {workout.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-6 mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Exercícios</p>
                            <p className="text-lg font-semibold text-white">
                              {workout.exercises?.length || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Volume Total</p>
                            <p className="text-lg font-semibold text-white">
                              {totalVolume.toLocaleString()} kg
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(workout)}
                          disabled={createWorkout.isPending}
                          className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                          title="Duplicar treino"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(workout)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          title="Editar treino"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingWorkoutId(workout.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          title="Excluir treino"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(workout.id)}
                          className="text-muted-foreground hover:text-white"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Exercises */}
                  {isExpanded && workout.exercises && workout.exercises.length > 0 && (
                    <div className="border-t border-white/5 bg-white/5 p-6">
                      <h4 className="text-sm font-semibold text-white mb-4">
                        Exercícios Realizados
                      </h4>
                      <div className="space-y-3">
                        {workout.exercises.map((exercise: Exercise, index: number) => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                                {index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {exercise.name}
                                </p>
                                {exercise.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {exercise.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-right">
                                <p className="text-muted-foreground text-xs">Séries</p>
                                <p className="text-white font-semibold">{exercise.sets}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-muted-foreground text-xs">Reps</p>
                                <p className="text-white font-semibold">{exercise.reps}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-muted-foreground text-xs">Carga</p>
                                <p className="text-white font-semibold">{exercise.weight}kg</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="glass p-12 border-white/5">
            <div className="text-center">
              <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Nenhum treino encontrado com esse nome."
                  : "Você ainda não registrou nenhum treino."}
              </p>
            </div>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingWorkout} onOpenChange={() => setEditingWorkout(null)}>
          <DialogContent className="glass border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Editar Treino</DialogTitle>
            </DialogHeader>

            {editingWorkout && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-white">Nome do Treino</Label>
                  <Input
                    value={editingWorkout.name}
                    onChange={(e) =>
                      setEditingWorkout({ ...editingWorkout, name: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label className="text-white">Data</Label>
                  <Input
                    type="date"
                    value={editingWorkout.date}
                    onChange={(e) =>
                      setEditingWorkout({ ...editingWorkout, date: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label className="text-white">Observações</Label>
                  <Textarea
                    value={editingWorkout.notes}
                    onChange={(e) =>
                      setEditingWorkout({ ...editingWorkout, notes: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white mt-2 min-h-[80px]"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingWorkout(null)}
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={updateWorkout.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {updateWorkout.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deletingWorkoutId}
          onOpenChange={() => setDeletingWorkoutId(null)}
        >
          <AlertDialogContent className="glass border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Excluir Treino
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita
                e todos os exercícios associados serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingWorkoutId && handleDelete(deletingWorkoutId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteWorkout.isPending ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
