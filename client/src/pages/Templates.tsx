import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Dumbbell, Trash2, Edit, Copy } from "lucide-react";
import ExercisePicker from "@/components/ExercisePicker";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export default function Templates() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: 10, weight: 0, notes: "" },
  ]);
  
  // Exercise Picker state
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);

  const { data: templates, refetch } = trpc.templates.list.useQuery();
  const createTemplate = trpc.templates.create.useMutation({
    onSuccess: () => {
      toast.success("Template criado com sucesso!");
      refetch();
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar template");
    },
  });

  const deleteTemplate = trpc.templates.delete.useMutation({
    onSuccess: () => {
      toast.success("Template excluído com sucesso!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao excluir template");
    },
  });

  const resetForm = () => {
    setTemplateName("");
    setTemplateDescription("");
    setExercises([{ name: "", sets: 3, reps: 10, weight: 0, notes: "" }]);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10, weight: 0, notes: "" }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Nome do template é obrigatório");
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      toast.error("Adicione pelo menos um exercício");
      return;
    }

    createTemplate.mutate({
      name: templateName,
      description: templateDescription || undefined,
      exercises: validExercises,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      deleteTemplate.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Templates de Treino
            </h1>
            <p className="text-muted-foreground">
              Crie modelos reutilizáveis para facilitar o registro de treinos
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Template</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Template Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Nome do Template *
                    </label>
                    <Input
                      placeholder="Ex: Treino A - Peito e Tríceps"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Descrição (opcional)
                    </label>
                    <Textarea
                      placeholder="Descreva o objetivo deste treino..."
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Exercises */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-white">Exercícios</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExercise}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Exercício
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <Card key={index} className="glass p-4 border-white/5">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Input
                              placeholder="Nome do exercício"
                              value={exercise.name}
                              onChange={(e) => updateExercise(index, "name", e.target.value)}
                              className="bg-white/5 border-white/10 text-white flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentExerciseIndex(index);
                                setShowExercisePicker(true);
                              }}
                              className="bg-primary/20 border-primary/30 hover:bg-primary/30 text-primary"
                            >
                              <Dumbbell className="w-4 h-4" />
                            </Button>
                            {exercises.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">
                                Séries
                              </label>
                              <Input
                                type="number"
                                min="1"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value) || 0)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">
                                Reps
                              </label>
                              <Input
                                type="number"
                                min="1"
                                value={exercise.reps}
                                onChange={(e) => updateExercise(index, "reps", parseInt(e.target.value) || 0)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">
                                Carga (kg)
                              </label>
                              <Input
                                type="number"
                                min="0"
                                value={exercise.weight}
                                onChange={(e) => updateExercise(index, "weight", parseInt(e.target.value) || 0)}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>

                          <Input
                            placeholder="Observações (opcional)"
                            value={exercise.notes || ""}
                            onChange={(e) => updateExercise(index, "notes", e.target.value)}
                            className="bg-white/5 border-white/10 text-white text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateTemplate}
                    disabled={createTemplate.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {createTemplate.isPending ? "Criando..." : "Criar Template"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates Grid */}
        {templates && templates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="glass p-6 border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {template.exercises?.length || 0} exercícios
                      </p>
                    </div>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>
                )}

                {template.exercises && template.exercises.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {template.exercises.slice(0, 3).map((exercise: any) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between text-xs p-2 bg-white/5 rounded"
                      >
                        <span className="text-muted-foreground truncate">{exercise.name}</span>
                        <span className="text-white font-medium ml-2 shrink-0">
                          {exercise.sets}×{exercise.reps} @ {exercise.weight}kg
                        </span>
                      </div>
                    ))}
                    {template.exercises.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{template.exercises.length - 3} exercícios
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleteTemplate.isPending}
                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass p-12 border-white/5">
            <div className="text-center">
              <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum template criado
              </h3>
              <p className="text-muted-foreground mb-6">
                Crie templates para facilitar o registro dos seus treinos recorrentes
              </p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      {/* Exercise Picker Modal */}
      <ExercisePicker
        open={showExercisePicker}
        onClose={() => {
          setShowExercisePicker(false);
          setCurrentExerciseIndex(null);
        }}
        onSelect={(exercise) => {
          if (currentExerciseIndex !== null) {
            updateExercise(currentExerciseIndex, "name", exercise.name);
          }
        }}
      />
    </DashboardLayout>
  );
}
