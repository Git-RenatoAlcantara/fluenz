import { Video } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useToast } from "@/hooks/use-toast";
import { upadteVideoAction } from "../_actions/updateVideoAction";


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

    useEffect(() => {
      const video = playerRef.current;
      if (video) {
         const debounceFn = setTimeout(() => {
          setVideoDuration(video.getDuration());
          const frame = video.getInternalPlayer();
          if (frame) {
            const iframe = frame.g;
            iframe.style.borderRadius = "36px";
          }
         }, 500);
          
      }


  }, [playerRef.current])

    useEffect(() => {
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
  },[videoCurrentTime])
  
    
  async function setVideoDateView(){
    await upadteVideoAction(video.id)
  }
    return (
      <div className="w-3/4 h-[calc(100%-150px)]">
        <ReactPlayer
              config={{
                youtube: {
                  playerVars: {
                    rel: 0,            // Desativa vídeos recomendados de outros canais
                    modestbranding: 0, // Remove o logo do YouTube
                    showinfo: 0,       // Oculta informações do vídeo (em versões antigas da API)
                    fs: 0,             // Habilita/desabilita o botão de tela cheia
                    iv_load_policy: 3, // Remove anotações do vídeo
                    controls: 0,
                    autoplay: 0,
                  },
                },
                
              }}
                ref={playerRef}
                muted={false}
                url={video.url}
                height="100%"
                width="100%"
                onDuration={(duration) => setVideoDuration(duration)}
                onProgress={(progress) => setVideoCurrentTime(progress.playedSeconds)}
            />
      </div>
    )
}