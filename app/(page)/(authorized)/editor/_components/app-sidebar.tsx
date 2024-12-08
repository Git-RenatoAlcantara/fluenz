"use client";

import { motion } from "framer-motion";
import React from "react";
import { Calendar, Home, Inbox, Search, Settings, Logs, LayoutDashboard, FilePen, GalleryHorizontal } from "lucide-react"

import Link from "next/link";

// Menu items.
const sidebarItems = [
  { icon: Home, url: "#", label: "Home" },
  {
    label: "Estudar",
    url: "/playlist",
    icon: FilePen,
  },
  {
    label: "Registros",
    url: "/dashboard",
    icon: Logs,
  },
  {
    label: "Flashcards",
    url: "/flashcards",
    icon: GalleryHorizontal,
  },
]


export function AppSidebar() {
  return (
     <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 border-r h-screen border-gray-200 dark:border-gray-700 p-4 flex flex-col bg-white dark:bg-secondary"
    >
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
        <h1 className="font-semibold text-xl text-gray-900 dark:text-white">Untitled UI</h1>
      </div>

      <nav className="flex-1">
        {sidebarItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer
              hover:bg-gray-100 dark:hover:bg-gray-800
              ${item.label === "Messages" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
          >
            <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <Link href={item.url} className="flex-1 text-gray-900 dark:text-gray-100">{item.label}</Link>
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 px-3 py-2">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">Frankie Sullivan</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">@frankie</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
