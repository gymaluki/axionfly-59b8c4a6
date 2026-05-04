import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Upload, Trash2, Plus, X, Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

interface MembrosViewProps {
  isAdmin?: boolean;
}

const MembrosView = ({ isAdmin = false }: MembrosViewProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setVideos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async () => {
    if (!title.trim() || !videoFile) {
      toast({ title: "Preencha o título e selecione um vídeo", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = videoFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      console.log("Uploading video file:", fileName, "size:", videoFile.size, "type:", videoFile.type);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, videoFile, { contentType: videoFile.type, upsert: false });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload success:", uploadData);

      const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);

      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase.from("videos").insert({
        title: title.trim(),
        description: description.trim() || null,
        video_url: urlData.publicUrl,
        created_by: user?.id || null,
      });

      if (insertError) {
        console.error("DB insert error:", insertError);
        throw insertError;
      }

      toast({ title: "Vídeo adicionado com sucesso!" });
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setDialogOpen(false);
      fetchVideos();
    } catch (err: any) {
      console.error("Full upload error:", err);
      toast({ title: "Erro ao enviar vídeo", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (video: Video) => {
    try {
      // Extract file name from the public URL
      const urlParts = video.video_url.split("/storage/v1/object/public/videos/");
      const fileName = urlParts.length > 1 ? urlParts[1] : video.video_url.split("/").pop();
      
      if (fileName) {
        const { error: storageError } = await supabase.storage.from("videos").remove([fileName]);
        if (storageError) console.error("Storage delete error:", storageError);
      }

      const { error: dbError } = await supabase.from("videos").delete().eq("id", video.id);
      if (dbError) {
        console.error("DB delete error:", dbError);
        toast({ title: "Erro ao remover vídeo", description: dbError.message, variant: "destructive" });
        return;
      }

      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      toast({ title: "Vídeo removido" });
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({ title: "Erro ao remover vídeo", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Strategy Card */}
      <Card className="bg-gradient-to-br from-[#0d0d14] to-primary/10 border border-white/5 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-foreground tracking-tight">Estratégia para Criar Sites Infinitos</h3>
              <p className="text-[#94a3b8] text-base leading-relaxed max-w-2xl font-medium">
                Aprenda o método oficial para escalar sua produção sem limites. Ao renovar suas contas Lovable, você mantém o fluxo constante de criação. 
                <span className="block mt-2 text-primary font-bold">Use com responsabilidade para garantir seus resultados.</span>
              </p>
            </div>
          </div>
        </CardContent>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Área de Membros</h2>
          <p className="text-sm text-muted-foreground">Assista às aulas e conteúdos exclusivos</p>
        </div>

        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Vídeo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Vídeo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    placeholder="Ex: Aula 1 - Como prospectar clientes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    placeholder="Descreva o conteúdo do vídeo..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arquivo de Vídeo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {videoFile ? videoFile.name : "Selecionar vídeo"}
                  </Button>
                </div>
                <Button
                  className="w-full"
                  variant="neon"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Vídeo"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {videos.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Play className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Nenhum vídeo disponível</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin ? "Adicione o primeiro vídeo clicando no botão acima." : "Em breve novos conteúdos serão adicionados."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="bg-card border-border overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="aspect-video bg-secondary/50 flex items-center justify-center relative">
                <Play className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(video);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <CardContent className="p-4 space-y-1">
                <h3 className="font-semibold text-foreground text-sm line-clamp-1">{video.title}</h3>
                {video.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  {new Date(video.created_at).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          {selectedVideo && (
            <>
              <div className="aspect-video bg-black">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-bold text-foreground">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembrosView;
