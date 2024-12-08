import { motion } from "framer-motion"
import Link from "next/link"

const getYouTubeThumbnail = (url: string): string | null => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : null;
};


const videos: {
    id: "",
    url: ""
}[] = [];

export const VideoGrid =() => {

    return (
        <div className="grid grid-cols-4 gap-2 p-2">
        {videos.map((video, idx) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{  opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className=" p-2 h-fit bg-zinc-800/60 rounded flex flex-col justify-end items-center"
            >
                  <Link
                    href={`/play/`}
                  >
                    <img src={getYouTubeThumbnail(video.url) || ""} alt="YouTube Thumbnail" className="w-full rounded-md" />
                  </Link>
            </motion.div>
        ))}
    </div>
    )
}