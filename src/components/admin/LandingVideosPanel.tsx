import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Monitor, Smartphone, Upload, Save } from "lucide-react";

const KEY_DESKTOP = "demo_video_desktop_url";
const KEY_MOBILE = "demo_video_mobile_url";

export default function LandingVideosPanel() {
  const [desktopUrl, setDesktopUrl] = useState("");
  const [mobileUrl, setMobileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"desktop" | "mobile" | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", [KEY_DESKTOP, KEY_MOBILE]);
      data?.forEach((row) => {
        if (row.key === KEY_DESKTOP) setDesktopUrl(row.value ?? "");
        if (row.key === KEY_MOBILE) setMobileUrl(row.value ?? "");
      });
      setLoading(false);
    })();
  }, []);

  const save = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return false;
    }
    toast.success("Salvo com sucesso");
    return true;
  };

  const handleUpload = async (file: File, kind: "desktop" | "mobile") => {
    setUploading(kind);
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const path = `${kind}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("landing-videos")
        .upload(path, file, { upsert: true, contentType: file.type || "video/mp4" });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("landing-videos").getPublicUrl(path);
      const url = data.publicUrl;
      if (kind === "desktop") setDesktopUrl(url);
      else setMobileUrl(url);
      await save(kind === "desktop" ? KEY_DESKTOP : KEY_MOBILE, url);
    } catch (e: any) {
      toast.error("Erro no upload: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  const Row = ({
    kind,
    icon: Icon,
    label,
    url,
    setUrl,
    storageKey,
  }: {
    kind: "desktop" | "mobile";
    icon: any;
    label: string;
    url: string;
    setUrl: (v: string) => void;
    storageKey: string;
  }) => (
    <div className="space-y-3 rounded-lg border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      {url && (
        <video
          src={url}
          className="w-full max-h-[260px] rounded-md bg-black object-contain"
          muted
          controls
        />
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL do vídeo (.mp4)"
          className="bg-black/40 border-white/10 text-xs"
        />
        <Button
          size="sm"
          onClick={() => save(storageKey, url)}
          className="shrink-0"
        >
          <Save className="h-4 w-4 mr-1" /> Salvar URL
        </Button>
      </div>
      <div>
        <Label
          htmlFor={`upload-${kind}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/20"
        >
          <Upload className="h-4 w-4" />
          {uploading === kind ? "Enviando..." : "Enviar novo vídeo"}
        </Label>
        <input
          id={`upload-${kind}`}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f, kind);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Vídeos da Landing Page</CardTitle>
        <CardDescription className="text-xs">
          Faça upload ou cole a URL do vídeo do Computador e do Celular. Atualiza
          ao vivo na home.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <>
            <Row
              kind="desktop"
              icon={Monitor}
              label="Vídeo Computador"
              url={desktopUrl}
              setUrl={setDesktopUrl}
              storageKey={KEY_DESKTOP}
            />
            <Row
              kind="mobile"
              icon={Smartphone}
              label="Vídeo Celular"
              url={mobileUrl}
              setUrl={setMobileUrl}
              storageKey={KEY_MOBILE}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
