'use client'
import { Video } from "@prisma/client";
import db from "@/prisma/prisma"
import { getSession } from "@/lib/session";
import  Router  from "next/navigation";
import PageClient from "./pageClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default async function Playlist(){
   
  return (
    <PageClient/>
  )
}