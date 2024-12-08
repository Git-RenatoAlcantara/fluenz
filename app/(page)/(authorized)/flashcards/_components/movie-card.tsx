import { cn } from "@/lib/utils";
import { motion } from "framer-motion"

export const MovieCard = ({
    setMovieAnimation,
    reasonLabel,
}:{
    setMovieAnimation: (status: boolean) => void;
    reasonLabel: {
        sei: boolean;
        naoSei: boolean;
    };
}) => {

    return (
        <motion.div 
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: 300, opacity: 0 }} // Movimenta para a direita e desaparece
        transition={{ duration: 0.8 }} // Define a duração da animação
        onAnimationComplete={() =>setMovieAnimation(false)}
        className={cn(
            `w-full h-[380px] text-2xl mb-10 font-bold text-green-500 flex items-center justify-center relative   border`,
            reasonLabel.naoSei && "text-red-500"
        )}>
         {reasonLabel.sei && ( <span className="text-2xl">Sei</span>)}
         {reasonLabel.naoSei && ( <span className="text-2xl">Não sei</span>)}
        </motion.div>
    )
}