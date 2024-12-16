"use client";
import cookies from "js-cookie";
import { BarChart2, Users, NotebookPen ,FolderKanban, Users2, Library, Mail, Settings, Home, GalleryVerticalEnd, GalleryHorizontalEnd, LayoutDashboard, SquarePlay } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: SquarePlay, label: "Videos", href: "/playlist" },
  { icon: GalleryHorizontalEnd, label: "Flashcard", href: "/flashcards" },
  { icon: NotebookPen, label: "Exercicios", href: "/exercise" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Mail, label: "Contacts", href: "/contacts" },
];

export default function Sidebar() {

  const userId = cookies.get("userId");
  
  const pathname = usePathname()
  const [active, setActive] = useState(pathname);

  return (
    <div className="w-20 bg-[#141517] h-full flex flex-col items-center py-4 border-r border-gray-800">
      <div className="mb-8">
        <span className="text-blue-500 font-bold">SOY</span>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                active === item.href ? "bg-blue-500/20 text-blue-500" : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
              onClick={() => setActive(item.href)}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button className="flex items-center justify-center w-12 h-12 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}