import { useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Dumbbell, Upload, Edit, Trash2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: { name: string; mediaUrl?: string }) => void;
}

const MUSCLE_GROUPS = [
  "Todos",
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Abdômen",
];

export default function ExercisePicker({ open, onClose, onSelect }: ExercisePickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("custom");
  
  // Custom exercise form
  const [customName, setCustomName] = useState("");
  const [customMuscleGroup, setCustomMuscleGroup] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState<"iniciante" | "intermediario" | "avancado">("intermediario");
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string>("");
  
  // Edit mode
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // Queries
  const { data: userExercises = [], isLoading: loadingUser, refetch: refetchUserExercises } = trpc.userExercises.list.useQuery();
  
  // Mutations
  const createCustomExercise = trpc.userExercises.create.useMutation({
    onSuccess: () => {
      toast.success("Exercício customizado criado!");
      refetchUserExercises();
      resetCustomForm();
    },
    onError: () => {
      toast.error("Erro ao criar exercício");
    },
  });
  
  const updateCustomExercise = trpc.userExercises.update.useMutation({
    onSuccess: () => {
      toast.success("Exercício atualizado!");
      refetchUserExercises();
      resetCustomForm();
      setEditingExerciseId(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar exercício");
    },
  });
  
  const deleteCustomExercise = trpc.userExercises.delete.useMutation({
    onSuccess: () => {
      toast.success("Exercício excluído!");
      refetchUserExercises();
      setShowDeleteConfirm(null);
    },
    onError: () => {
      toast.error("Erro ao excluir exercício");
    },
  });

  const resetCustomForm = () => {
    setCustomName("");
    setCustomMuscleGroup("");
    setCustomEquipment("");
    setCustomDescription("");
    setCustomDifficulty("intermediario");
    setCustomImageFile(null);
    setCustomImagePreview("");
    setEditingExerciseId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 5MB");
        return;
      }
      setCustomImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCustom = async () => {
    if (!customName || !customMuscleGroup) {
      toast.error("Nome e grupo muscular são obrigatórios");
      return;
    }

    if (editingExerciseId) {
      // Update existing exercise
      updateCustomExercise.mutate({
        id: editingExerciseId,
        name: customName,
        muscleGroup: customMuscleGroup,
        equipment: customEquipment || undefined,
        description: customDescription || undefined,
        difficulty: customDifficulty,
        imageData: customImagePreview || undefined,
      });
    } else {
      // Create new exercise
      createCustomExercise.mutate({
        name: customName,
        muscleGroup: customMuscleGroup,
        equipment: customEquipment || undefined,
        description: customDescription || undefined,
        difficulty: customDifficulty,
        imageData: customImagePreview || undefined,
      });
    }
  };
  
  const handleEditExercise = (exercise: any) => {
    setEditingExerciseId(exercise.id);
    setCustomName(exercise.name);
    setCustomMuscleGroup(exercise.muscleGroup);
    setCustomEquipment(exercise.equipment || "");
    setCustomDescription(exercise.description || "");
    setCustomDifficulty(exercise.difficulty || "intermediario");
    setCustomImagePreview(exercise.mediaUrl || "");
    setActiveTab("create"); // Mudar para a aba de criar/editar
  };
  
  const handleDeleteExercise = (id: number) => {
    setShowDeleteConfirm(id);
  };
  
  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteCustomExercise.mutate({ id: showDeleteConfirm });
    }
  };

  const filteredUserExercises = userExercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Selecionar Exercício</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="custom">Meus Exercícios</TabsTrigger>
              <TabsTrigger value="create">Criar Novo</TabsTrigger>
            </TabsList>



          {/* Custom Exercises Tab */}
          <TabsContent value="custom" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Buscar nos meus exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>

            {loadingUser ? (
              <div className="text-center py-12 text-white/60">Carregando...</div>
            ) : filteredUserExercises.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                Você ainda não criou exercícios customizados
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredUserExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all"
                  >
                    {/* Botões de ação no canto superior direito */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditExercise(exercise);
                        }}
                        className="p-1.5 bg-blue-500/80 hover:bg-blue-500 rounded-md transition-colors"
                        title="Editar exercício"
                      >
                        <Edit className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExercise(exercise.id);
                        }}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors"
                        title="Deletar exercício"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    {/* Card clicável */}
                    <button
                      onClick={() => {
                        onSelect({ name: exercise.name, mediaUrl: exercise.mediaUrl || undefined });
                        onClose();
                      }}
                      className="w-full text-left"
                    >
                      <div className="aspect-square bg-white/5 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        {exercise.mediaUrl ? (
                          <img
                            src={exercise.mediaUrl}
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Dumbbell className="w-12 h-12 text-white/20" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-primary transition-colors">
                          {exercise.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create Custom Tab */}
          <TabsContent value="create" className="space-y-4">
            {editingExerciseId && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center gap-2 text-blue-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Você está editando um exercício existente</span>
                <button
                  onClick={resetCustomForm}
                  className="ml-auto text-xs underline hover:no-underline"
                >
                  Cancelar edição
                </button>
              </div>
            )}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Nome do Exercício *
                </label>
                <Input
                  placeholder="Ex: Supino Inclinado 30°"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Grupo Muscular *
                  </label>
                  <Select value={customMuscleGroup} onValueChange={setCustomMuscleGroup}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MUSCLE_GROUPS.filter((g) => g !== "Todos").map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Equipamento
                  </label>
                  <Input
                    placeholder="Ex: Halteres"
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Dificuldade
                </label>
                <Select value={customDifficulty} onValueChange={(v: any) => setCustomDifficulty(v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Foto/GIF do Exercício
                </label>
                <div className="space-y-3">
                  {customImagePreview ? (
                    <div className="relative aspect-video bg-white/5 rounded-lg overflow-hidden">
                      <img
                        src={customImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setCustomImageFile(null);
                          setCustomImagePreview("");
                        }}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <Upload className="w-8 h-8 text-white/40 mb-2" />
                      <span className="text-sm text-white/60">Clique para fazer upload</span>
                      <span className="text-xs text-white/40 mt-1">PNG, JPG ou GIF (máx. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Descrição
                </label>
                <Textarea
                  placeholder="Como executar o exercício..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleCreateCustom}
                disabled={createCustomExercise.isPending || updateCustomExercise.isPending}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {editingExerciseId ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    {updateCustomExercise.isPending ? "Salvando..." : "Salvar Alterações"}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {createCustomExercise.isPending ? "Criando..." : "Criar Exercício"}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão - renderizado via Portal */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 99999, pointerEvents: 'auto' }}>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 max-w-md mx-4" style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Confirmar Exclusão</h3>
            </div>
            <p className="text-white/70 mb-6">
              Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1 transition-transform active:scale-95"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleteCustomExercise.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 transition-transform active:scale-95"
              >
                {deleteCustomExercise.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
