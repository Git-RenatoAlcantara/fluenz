'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchVideo } from './_actions/fetchVideo'
import { Player } from './_components/player'
import { Video } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'

export default function VideoClient({
    params
}: {
    params: { id: string }
}){

    const fetchDataOptions = {
        id: parseInt(params.id)
    }

    const {isLoading, data} = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: () => fetchVideo(fetchDataOptions),
    })


    const video = data?.result

    if(isLoading){
        return <p>Carregando...</p>
    }
    return (
        <div className=' h-full flex flex-col items-center'>
            <div className='flex w-3/4 py-5 items-center space-x-5'>
                <Link
                    href={"/playlist"}
                >
                    <ArrowLeftCircle size={38}/>
                </Link>
                <span>Voltar</span>
            </div>
            {video ? (
                <Player video={data?.result as Video}/>
            ) : (
                <p>Vazio</p>
            )}
        </div>
    )
}