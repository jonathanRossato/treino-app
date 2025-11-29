import { useState, useRef, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Trash2, X, ArrowLeftRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Photos() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPose, setSelectedPose] = useState<"front" | "back" | "side">("front");
  const [week, setWeek] = useState(1);
  const [notes, setNotes] = useState("");
  const [photoDate, setPhotoDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [measurements, setMeasurements] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    leftArm: "",
    rightArm: "",
    leftThigh: "",
    rightThigh: "",
    leftCalf: "",
    rightCalf: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedPhoto1, setSelectedPhoto1] = useState<number | null>(null);
  const [selectedPhoto2, setSelectedPhoto2] = useState<number | null>(null);

  const { data: photos, refetch } = trpc.photos.list.useQuery();
  
  const uploadPhoto = trpc.photos.upload.useMutation({
    onSuccess: () => {
      toast.success("Foto adicionada com sucesso!");
      setIsUploadDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error("Erro ao salvar foto: " + error.message);
    },
  });

  const deletePhoto = trpc.photos.delete.useMutation({
    onSuccess: () => {
      toast.success("Foto removida");
      refetch();
    },
  });

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPose("front");
    setWeek(1);
    setNotes("");
    setPhotoDate(new Date().toISOString().split('T')[0]);
    setMeasurements({
      weight: "",
      chest: "",
      waist: "",
      hips: "",
      leftArm: "",
      rightArm: "",
      leftThigh: "",
      rightThigh: "",
      leftCalf: "",
      rightCalf: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 16 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 16MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Selecione uma foto");
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        
        uploadPhoto.mutate({
          fileData: base64Data,
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          pose: selectedPose,
          week,
          date: new Date(photoDate),
          notes,
          weight: measurements.weight ? parseInt(measurements.weight) : undefined,
          chest: measurements.chest ? parseInt(measurements.chest) : undefined,
          waist: measurements.waist ? parseInt(measurements.waist) : undefined,
          hips: measurements.hips ? parseInt(measurements.hips) : undefined,
          leftArm: measurements.leftArm ? parseInt(measurements.leftArm) : undefined,
          rightArm: measurements.rightArm ? parseInt(measurements.rightArm) : undefined,
          leftThigh: measurements.leftThigh ? parseInt(measurements.leftThigh) : undefined,
          rightThigh: measurements.rightThigh ? parseInt(measurements.rightThigh) : undefined,
          leftCalf: measurements.leftCalf ? parseInt(measurements.leftCalf) : undefined,
          rightCalf: measurements.rightCalf ? parseInt(measurements.rightCalf) : undefined,
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error("Erro ao fazer upload da foto");
    }
  };

  const poseLabels = {
    front: "Frente",
    back: "Costas",
    side: "Lateral",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Galeria de Evolução
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua transformação visual ao longo das semanas
            </p>
          </div>
          <div className="flex gap-3">
            {!isCompareMode && photos && photos.length >= 2 && (
              <Button
                onClick={() => setIsCompareMode(true)}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Comparar Fotos
              </Button>
            )}
            {isCompareMode && (
              <Button
                onClick={() => {
                  setIsCompareMode(false);
                  setSelectedPhoto1(null);
                  setSelectedPhoto2(null);
                }}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar Comparação
              </Button>
            )}
            {!isCompareMode && (
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Camera className="w-4 h-4 mr-2" />
                Adicionar Foto
              </Button>
            )}
          </div>
        </div>

        {/* Compare View */}
        {isCompareMode && selectedPhoto1 && selectedPhoto2 && (
          <Card className="glass border-white/5 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {[selectedPhoto1, selectedPhoto2].map((photoId) => {
                const photo = photos?.find((p) => p.id === photoId);
                if (!photo) return null;
                return (
                  <div key={photo.id} className="space-y-4">
                    <div className="relative aspect-[3/4] bg-white/5 rounded-lg overflow-hidden">
                      <img
                        src={photo.url}
                        alt={`${poseLabels[photo.pose]} - Semana ${photo.week}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-primary">
                          Semana {photo.week}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {poseLabels[photo.pose]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(photo.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {photo.notes && (
                        <p className="text-sm text-white">{photo.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Selection Instructions */}
        {isCompareMode && (!selectedPhoto1 || !selectedPhoto2) && (
          <Card className="glass border-primary/30 p-6">
            <p className="text-center text-white">
              {!selectedPhoto1
                ? "Selecione a primeira foto para comparar"
                : "Selecione a segunda foto para comparar"}
            </p>
          </Card>
        )}

        {/* Photos Grid */}
        {photos && photos.length > 0 && (!isCompareMode || !selectedPhoto1 || !selectedPhoto2) ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => {
              const isSelected = photo.id === selectedPhoto1 || photo.id === selectedPhoto2;
              return (
              <Card 
                key={photo.id} 
                className={`glass border-white/5 overflow-hidden group ${
                  isCompareMode ? "cursor-pointer hover:border-primary/50" : ""
                } ${
                  isSelected ? "border-primary/50 ring-2 ring-primary/30" : ""
                }`}
                onClick={() => {
                  if (isCompareMode) {
                    if (!selectedPhoto1) {
                      setSelectedPhoto1(photo.id);
                    } else if (!selectedPhoto2 && photo.id !== selectedPhoto1) {
                      setSelectedPhoto2(photo.id);
                    }
                  }
                }}
              >
                <div className="relative aspect-[3/4] bg-white/5">
                  <img
                    src={photo.url}
                    alt={`${poseLabels[photo.pose]} - Semana ${photo.week}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePhoto.mutate({ id: photo.id })}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      Semana {photo.week}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {poseLabels[photo.pose]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(photo.date).toLocaleDateString("pt-BR")}
                  </p>
                  {photo.notes && (
                    <p className="text-sm text-white mt-2">{photo.notes}</p>
                  )}
                  {(photo.weight || photo.chest || photo.waist) && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-muted-foreground mb-2">Medidas:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {photo.weight && (
                          <div className="text-white">
                            <span className="text-muted-foreground">Peso:</span> {photo.weight}kg
                          </div>
                        )}
                        {photo.chest && (
                          <div className="text-white">
                            <span className="text-muted-foreground">Peito:</span> {photo.chest}cm
                          </div>
                        )}
                        {photo.waist && (
                          <div className="text-white">
                            <span className="text-muted-foreground">Cintura:</span> {photo.waist}cm
                          </div>
                        )}
                        {photo.hips && (
                          <div className="text-white">
                            <span className="text-muted-foreground">Quadril:</span> {photo.hips}cm
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
            })}
          </div>
        ) : !isCompareMode ? (
          <Card className="glass p-12 border-white/5">
            <div className="text-center">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Você ainda não adicionou nenhuma foto de progresso.
              </p>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                Adicionar primeira foto
              </Button>
            </div>
          </Card>
        ) : null}

        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="glass border-white/10 text-white max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Adicionar Foto de Progresso</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4 overflow-y-auto pr-2">
              {/* File Upload */}
              <div>
                <Label className="text-white mb-2 block">Foto</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                     onClick={() => fileInputRef.current?.click()}>
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetForm();
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Clique para selecionar uma foto (máx. 16MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Data</Label>
                  <Input
                    type="date"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Ângulo</Label>
                  <Select value={selectedPose} onValueChange={(value: any) => setSelectedPose(value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">Frente</SelectItem>
                      <SelectItem value="back">Costas</SelectItem>
                      <SelectItem value="side">Lateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Semana</Label>
                  <Input
                    type="number"
                    value={week}
                    onChange={(e) => setWeek(parseInt(e.target.value) || 1)}
                    min="1"
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>
              </div>

              {/* Medidas Corporais */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-lg">Medidas Corporais (opcional)</Label>
                  <span className="text-xs text-muted-foreground">Peso em kg, demais em cm</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white text-sm">Peso (kg)</Label>
                    <Input
                      type="number"
                      value={measurements.weight}
                      onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
                      placeholder="Ex: 75"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Peito (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({...measurements, chest: e.target.value})}
                      placeholder="Ex: 100"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Cintura (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                      placeholder="Ex: 80"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Quadril (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.hips}
                      onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                      placeholder="Ex: 95"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Braço Esquerdo (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.leftArm}
                      onChange={(e) => setMeasurements({...measurements, leftArm: e.target.value})}
                      placeholder="Ex: 35"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Braço Direito (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.rightArm}
                      onChange={(e) => setMeasurements({...measurements, rightArm: e.target.value})}
                      placeholder="Ex: 35"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Coxa Esquerda (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.leftThigh}
                      onChange={(e) => setMeasurements({...measurements, leftThigh: e.target.value})}
                      placeholder="Ex: 55"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Coxa Direita (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.rightThigh}
                      onChange={(e) => setMeasurements({...measurements, rightThigh: e.target.value})}
                      placeholder="Ex: 55"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Panturrilha Esquerda (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.leftCalf}
                      onChange={(e) => setMeasurements({...measurements, leftCalf: e.target.value})}
                      placeholder="Ex: 38"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Panturrilha Direita (cm)</Label>
                    <Input
                      type="number"
                      value={measurements.rightCalf}
                      onChange={(e) => setMeasurements({...measurements, rightCalf: e.target.value})}
                      placeholder="Ex: 38"
                      className="bg-white/5 border-white/10 text-white mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white">Observações (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Como você está se sentindo? Alguma mudança notável?"
                  className="bg-white/5 border-white/10 text-white mt-2 min-h-[80px]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUploadDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadPhoto.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {uploadPhoto.isPending ? "Salvando..." : "Salvar Foto"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
