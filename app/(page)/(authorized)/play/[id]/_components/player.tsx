import { Video } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useToast } from "@/hooks/use-toast";
import { upadteVideoAction } from "../_actions/updateVideoAction";
import { updateWatchTime } from "../_actions/updateWatchTime";
import { updateVideoDuration } from "../_actions/updateVideoDuration";
import { useQueryClient } from "@tanstack/react-query";


export const Player = ({
    video
}: {
    video: Video
}) => {
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0)
    const [videoProgress, setVideoProgress] = useState<number>(0)
    const playerRef = useRef<ReactPlayer>(null);
    const { toast } = useToast();
    const [showToast, setShowToast] = useState(false)
    const [durationUpdated, setDurationUpdated] = useState(false)
    const queryClient = useQueryClient()

    // Verificar se é vídeo local ou YouTube
    const isLocalVideo = video.url.startsWith('/videos/');

    useEffect(() => {
      const player = playerRef.current;
      if (player) {
         const debounceFn = setTimeout(() => {
          const duration = player.getDuration();
          setVideoDuration(duration);
          
          // Salvar duração no banco de dados se ainda não foi salva
          if (duration > 0 && (!video.duration || video.duration === 0)) {
            updateVideoDuration(video.id, duration);
          }
          
          // Aplicar border radius apenas para vídeos do YouTube (iframe)
          if (!isLocalVideo) {
            const frame = player.getInternalPlayer();
            if (frame && frame.g) {
              const iframe = frame.g;
              iframe.style.borderRadius = "36px";
            }
          }
         }, 500);
         
         return () => clearTimeout(debounceFn);
      }
  }, [playerRef.current, isLocalVideo])

    useEffect(() => {
      if (videoDuration <= 0) {
        setVideoProgress(0);
        return;
      }
      
      const newPosPercentage = (videoCurrentTime / videoDuration) * 100;
      if(Math.round(newPosPercentage) > 90){
        if(video && !showToast){
          toast({
            title: "Vídeo diário assistido."
          })
          setVideoDateView()
          setShowToast(true);
        }
      }
      setVideoProgress(newPosPercentage);
  },[videoCurrentTime, videoDuration])
  
    
  async function setVideoDateView(){
    // Salvar duração antes de atualizar o vídeo
    if (videoDuration > 0) {
      await updateVideoDuration(video.id, videoDuration)
    }
    
    // Registrar tempo assistido
    await updateWatchTime(videoDuration)
    
    // Atualizar vídeo e progresso do usuário (XP, mana, etc)
    await upadteVideoAction(video.id)
    
    // Atualizar perfil do usuário no cache
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
  }
    return (
      <div className="w-full max-w-6xl">
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50">
          <ReactPlayer
                config={{
                  youtube: {
                    playerVars: {
                      rel: 0,
                      modestbranding: 0,
                      showinfo: 0,
                      fs: 1,
                      iv_load_policy: 3,
                      controls: 1,
                      autoplay: 0,
                    },
                  },
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    }
                  }
                }}
                  ref={playerRef}
                  controls={true}
                  muted={false}
                  url={video.url}
                  height="100%"
                  width="100%"
                  onDuration={(duration) => setVideoDuration(duration)}
                  onProgress={(progress) => setVideoCurrentTime(progress.playedSeconds)}
              />
        </div>
        
        {/* Progress Bar */}
        {videoDuration > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progresso do vídeo</span>
              <span>{isNaN(videoProgress) ? 0 : Math.round(videoProgress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${isNaN(videoProgress) ? 0 : videoProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTime(videoCurrentTime)}</span>
              <span>{formatTime(videoDuration)}</span>
            </div>
          </div>
        )}
      </div>
    )
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}