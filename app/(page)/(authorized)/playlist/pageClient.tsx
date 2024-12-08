"use client"

import cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVideos } from "./_actions/fetchVideos";
import { deleteVideo } from "./_actions/deleteVideo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";


const getYouTubeThumbnail = (url: string): string | null => {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : null;
};

export default function PageClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast()


const {isLoading, data} = useQuery({
    queryKey: ['videos'],
    queryFn: () => fetchVideos(),
})

    
  // Mutação para deletar vídeo
  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({
        queryKey: ['videos'], // Aqui especifica o tipo esperado
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado."
      })
    }
  });

  
  if(isLoading) return <p>Carregando...</p>
 
  if(deleteMutation.isPending) return <p>Removendo vídeo</p>

  if(!deleteMutation.isIdle) return <p>Vídeo is idle</p>
  
   return (
    <ScrollArea className="h-[calc(100%-80px)]">
      <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 gap-2 p-2">
        {data?.videos.map((video, idx) => {
          if(video?.last_view_at === null){
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{  opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className=" p-2 h-fit bg-zinc-800/60 rounded relative flex flex-col justify-end items-center"
              >
                <Link
                  href={`/play/${video.id}`}
                >
                  <img src={getYouTubeThumbnail(video.url) || ""} alt="YouTube Thumbnail" className="w-full rounded-md" />
                </Link>
                <Button
                    onClick={() => deleteMutation.mutate(video.id)}
                  className="w-fit  bg-red-200/50 top-3 right-3 hover:bg-red-500 text-white absolute"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </Button>
              </motion.div>
            )
          }
        })}
      </div>
    </ScrollArea>
   )
}

