"use client"

import { useEffect, useState } from 'react';
import Calendar from './_components/Calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Flame, Target, TrendingUp, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchVideos } from '../playlist/_actions/fetchVideos';

export default function DashboardClient(){
    const { data } = useQuery({
        queryKey: ['videos'],
        queryFn: () => fetchVideos(),
    })

    const totalVideos = data?.videos?.length || 0;
    const watchedVideos = data?.videos?.filter(v => v.last_view_at !== null)?.length || 0;
    const unwatchedVideos = totalVideos - watchedVideos;
    const completionRate = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;
    const stats = [
        {
            title: "Total de Vídeos",
            value: totalVideos,
            description: "Vídeos na sua biblioteca",
            icon: Video,
            color: "text-indigo-400",
            bgColor: "bg-indigo-500/20"
        },
        {
            title: "Vídeos Assistidos",
            value: watchedVideos,
            description: "Completos (>90%)",
            icon: Target,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/20"
        },
        {
            title: "Para Assistir",
            value: unwatchedVideos,
            description: "Vídeos pendentes",
            icon: Flame,
            color: "text-orange-400",
            bgColor: "bg-orange-500/20"
        },
        {
            title: "Taxa de Conclusão",
            value: `${completionRate}%`,
            description: "Do total de vídeos",
            icon: TrendingUp,
            color: "text-purple-400",
            bgColor: "bg-purple-500/20"
        }
    ];

    return (
        <div className="p-6 pb-20 sm:pb-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-120px)]">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-slate-100"
                    >
                        Dashboard
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400"
                    >
                        Acompanhe seu progresso e estatísticas de aprendizado
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">
                                            {stat.title}
                                        </CardTitle>
                                        <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                            <Icon className={`h-4 w-4 ${stat.color}`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {stat.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Calendar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Calendário de Atividades</CardTitle>
                            <CardDescription className="text-slate-400">
                                Visualize seus dias de estudo e mantenha a consistência
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}