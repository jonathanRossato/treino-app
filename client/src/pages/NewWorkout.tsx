import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, FileText, Dumbbell } from "lucide-react";
import ExercisePicker from "@/components/ExercisePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export default function NewWorkout() {
  const [, navigate] = useLocation();
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split("T")[0]);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: 10, weight: 0 },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  // New metrics fields
  const [duration, setDuration] = useState<string>("");
  const [sleepHours, setSleepHours] = useState<string>("");
  const [avgHeartRate, setAvgHeartRate] = useState<string>("");
  const [caloriesBurned, setCaloriesBurned] = useState<string>("");
  
  // Cardio fields
  const [hasCardio, setHasCardio] = useState(false);
  const [cardioType, setCardioType] = useState("");
  const [cardioDuration, setCardioDuration] = useState<string>("");
  const [cardioDistance, setCardioDistance] = useState<string>("");
  const [cardioAvgHR, setCardioAvgHR] = useState<string>("");
  const [cardioPace, setCardioPace] = useState<string>("");
  const [cardioCalories, setCardioCalories] = useState<string>("");
  const [cardioNotes, setCardioNotes] = useState("");
  
  // Exercise Picker state
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);

  const { data: templates } = trpc.templates.list.useQuery();

  const createWorkout = trpc.workouts.create.useMutation({
    onSuccess: () => {
      toast.success("Treino registrado com sucesso!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Erro ao salvar treino: " + error.message);
    },
  });

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 10, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === parseInt(templateId));
    if (template) {
      setWorkoutName(template.name);
      if (template.exercises && template.exercises.length > 0) {
        setExercises(template.exercises.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          notes: ex.notes || "",
        })));
      }
      toast.success("Template carregado!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) {
      toast.error("Por favor, dê um nome ao treino");
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      toast.error("Adicione pelo menos um exercício");
      return;
    }

    createWorkout.mutate({
      name: workoutName,
      date: new Date(workoutDate + 'T12:00:00'),
      notes: workoutNotes,
      duration: duration ? parseInt(duration) : undefined,
      sleepHours: sleepHours ? parseInt(sleepHours) : undefined,
      avgHeartRate: avgHeartRate ? parseInt(avgHeartRate) : undefined,
      caloriesBurned: caloriesBurned ? parseInt(caloriesBurned) : undefined,
      exercises: validExercises,
      cardio: hasCardio && cardioType ? {
        type: cardioType,
        duration: parseInt(cardioDuration),
        distance: cardioDistance ? parseInt(cardioDistance) : undefined,
        avgHeartRate: cardioAvgHR ? parseInt(cardioAvgHR) : undefined,
        pace: cardioPace ? parseInt(cardioPace) : undefined,
        caloriesBurned: cardioCalories ? parseInt(cardioCalories) : undefined,
        notes: cardioNotes,
      } : undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Novo Treino
          </h1>
          <p className="text-muted-foreground">
            Registre os exercícios do seu treino de hoje
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selector */}
          {templates && templates.length > 0 && (
            <Card className="glass p-6 border-white/5 bg-primary/5">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="template" className="text-white mb-2 block">
                    Usar Template (Opcional)
                  </Label>
                  <Select value={selectedTemplate} onValueChange={(value) => {
                    setSelectedTemplate(value);
                    loadTemplate(value);
                  }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione um template..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()} className="text-white">
                          {template.name} ({template.exercises?.length || 0} exercícios)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Workout Info */}
          <Card className="glass p-6 border-white/5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome do Treino</Label>
                <Input
                  id="name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-white">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-white">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="Como você se sentiu? Alguma observação importante?"
                  className="bg-white/5 border-white/10 text-white mt-2 min-h-[80px]"
                />
              </div>
            </div>
          </Card>

          {/* Workout Metrics */}
          <Card className="glass p-6 border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Métricas do Treino (opcional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-white">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 60"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sleepHours" className="text-white">Horas de Sono</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  placeholder="Ex: 8"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="avgHeartRate" className="text-white">FC Média (bpm)</Label>
                <Input
                  id="avgHeartRate"
                  type="number"
                  value={avgHeartRate}
                  onChange={(e) => setAvgHeartRate(e.target.value)}
                  placeholder="Ex: 140"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="caloriesBurned" className="text-white">Calorias Gastas</Label>
                <Input
                  id="caloriesBurned"
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  placeholder="Ex: 450"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-white">
                Exercícios
              </h2>
              <Button
                type="button"
                onClick={addExercise}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Exercício
              </Button>
            </div>

            {exercises.map((exercise, index) => (
              <Card key={index} className="glass p-6 border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Exercício {index + 1}
                    </h3>
                    {exercises.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeExercise(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-white">Nome do Exercício</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, "name", e.target.value)}
                          placeholder="Ex: Supino Reto"
                          className="bg-white/5 border-white/10 text-white flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            setCurrentExerciseIndex(index);
                            setShowExercisePicker(true);
                          }}
                          variant="outline"
                          className="bg-primary/20 border-primary/30 hover:bg-primary/30 text-primary"
                        >
                          <Dumbbell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Séries</Label>
                      <Input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value) || 0)}
                        min="1"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Repetições</Label>
                      <Input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, "reps", parseInt(e.target.value) || 0)}
                        min="1"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Carga (kg)</Label>
                      <Input
                        type="number"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, "weight", parseInt(e.target.value) || 0)}
                        min="0"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Observações</Label>
                      <Input
                        value={exercise.notes || ""}
                        onChange={(e) => updateExercise(index, "notes", e.target.value)}
                        placeholder="Opcional"
                        className="bg-white/5 border-white/10 text-white mt-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Cardio Section */}
          <Card className="glass p-6 border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Cardio (opcional)</h3>
              <Button
                type="button"
                onClick={() => setHasCardio(!hasCardio)}
                variant={hasCardio ? "default" : "outline"}
                size="sm"
                className={hasCardio ? "bg-primary" : "bg-white/5 border-white/10 hover:bg-white/10"}
              >
                {hasCardio ? "Remover Cardio" : "Adicionar Cardio"}
              </Button>
            </div>

            {hasCardio && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardioType" className="text-white">Tipo</Label>
                    <Input
                      id="cardioType"
                      value={cardioType}
                      onChange={(e) => setCardioType(e.target.value)}
                      placeholder="Ex: Corrida, Bicicleta, Esteira"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardioDuration" className="text-white">Duração (minutos)</Label>
                    <Input
                      id="cardioDuration"
                      type="number"
                      value={cardioDuration}
                      onChange={(e) => setCardioDuration(e.target.value)}
                      placeholder="Ex: 30"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardioDistance" className="text-white">Distância (metros)</Label>
                    <Input
                      id="cardioDistance"
                      type="number"
                      value={cardioDistance}
                      onChange={(e) => setCardioDistance(e.target.value)}
                      placeholder="Ex: 5000"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardioAvgHR" className="text-white">FC Média (bpm)</Label>
                    <Input
                      id="cardioAvgHR"
                      type="number"
                      value={cardioAvgHR}
                      onChange={(e) => setCardioAvgHR(e.target.value)}
                      placeholder="Ex: 150"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardioPace" className="text-white">Ritmo (seg/km)</Label>
                    <Input
                      id="cardioPace"
                      type="number"
                      value={cardioPace}
                      onChange={(e) => setCardioPace(e.target.value)}
                      placeholder="Ex: 300"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardioCalories" className="text-white">Calorias Gastas</Label>
                    <Input
                      id="cardioCalories"
                      type="number"
                      value={cardioCalories}
                      onChange={(e) => setCardioCalories(e.target.value)}
                      placeholder="Ex: 300"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardioNotes" className="text-white">Observações</Label>
                  <Textarea
                    id="cardioNotes"
                    value={cardioNotes}
                    onChange={(e) => setCardioNotes(e.target.value)}
                    placeholder="Como foi o cardio?"
                    className="bg-white/5 border-white/10 text-white mt-2 min-h-[60px]"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createWorkout.isPending}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {createWorkout.isPending ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>
        </form>
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
