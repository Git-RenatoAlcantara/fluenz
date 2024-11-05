import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 // Função para formatar o tempo do vídeo
 export const formatVideoTime = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = (timeInSeconds % 1).toFixed(3).substring(2);

  return `${minutes.toString()}:${seconds
    .toString()
    .padStart(2, "0")}`;
};