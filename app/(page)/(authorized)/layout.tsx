'use server'
import LayoutClient from "./layoutClient"
import db from "@/prisma/prisma"
import { deleteSession, getSession } from "@/lib/session"
import { redirect } from "next/navigation"


export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    
    return (
     <LayoutClient>
      {children}
     </LayoutClient>
    )
}