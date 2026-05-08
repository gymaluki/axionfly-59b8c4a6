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
import { motion } from "framer-motion";

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
  const [signedVideoUrl, setSignedVideoUrl] = useState<string | null>(null);

  const extractStoragePath = (url: string): string => {
    const marker = "/storage/v1/object/public/videos/";
    const altMarker = "/storage/v1/object/sign/videos/";
    if (url.includes(marker)) return url.split(marker)[1].split("?")[0];
    if (url.includes(altMarker)) return url.split(altMarker)[1].split("?")[0];
    return url.split("/").pop() || url;
  };

  const openVideo = async (video: Video) => {
    setSelectedVideo(video);
    setSignedVideoUrl(null);
    const path = extractStoragePath(video.video_url);
    const { data, error } = await supabase.storage.from("videos").createSignedUrl(path, 3600);
    if (!error && data?.signedUrl) {
      setSignedVideoUrl(data.signedUrl);
    } else {
      console.error("Erro ao gerar URL assinada:", error);
      toast({ title: "Não foi possível carregar o vídeo", variant: "destructive" });
    }
  };
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
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-gradient-to-b from-transparent to-primary/5 rounded-[3rem] border border-white/5">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.1)]">
              <Play className="w-10 h-10 text-primary fill-current" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 border-2 border-primary/30 rounded-full pointer-events-none" 
            />
          </motion.div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">Conteúdos exclusivos chegando em breve</h3>
            <p className="text-[#64748b] font-medium max-w-sm mx-auto leading-relaxed">
              Aulas práticas sobre criação de sites, prospecção e fechamento de contratos de alto valor.
            </p>
          </div>
          {isAdmin && (
            <Button variant="neon" className="shimmer-button mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Primeiro Vídeo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -8 }}
              className="group"
              onClick={() => openVideo(video)}
            >
              <Card className="bg-[#0d0d14]/40 border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-primary/40 cursor-pointer">
                <div className="aspect-video bg-secondary/20 relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                      <Play className="w-12 h-12 text-primary/20 group-hover:text-primary/40 transition-colors" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
                      Aula Premium
                    </span>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">{video.title}</h3>
                  {video.description && (
                    <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">{video.description}</p>
                  )}
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-[10px] text-[#475569] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3" /> {new Date(video.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => { setSelectedVideo(null); setSignedVideoUrl(null); }}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          {selectedVideo && (
            <>
              <div className="aspect-video bg-black flex items-center justify-center">
                {signedVideoUrl ? (
                  <video
                    src={signedVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                ) : (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                )}
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
