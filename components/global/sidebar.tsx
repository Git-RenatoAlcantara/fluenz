"use client";
import { Play, Layout, History, ShoppingBag, Target, Skull, Users, Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: Play, label: "Daily Mix", href: "/daily" },
  { icon: Layout, label: "Biblioteca", href: "/playlist" },
  { icon: Brain, label: "Revisão", href: "/review" },
  { icon: Target, label: "Skills", href: "/skills" },
  { icon: Skull, label: "Boss", href: "/boss" },
  { icon: Users, label: "Guild", href: "/guild" },
  { icon: ShoppingBag, label: "Loja", href: "/shop" },
  { icon: History, label: "Histórico", href: "/history" },
];

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex w-20 flex-col items-center py-8 gap-6 bg-slate-950 border-r border-slate-800">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "p-3 rounded-xl transition-all",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                  : "text-slate-400 hover:bg-slate-800"
              )}
              title={item.label}
            >
              <Icon size={24} fill={isActive ? "currentColor" : "none"} />
            </Link>
          );
        })}
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-6 py-3 flex justify-around items-center z-40 sm:hidden shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-indigo-500" : "text-slate-400"
              )}
            >
              <Icon size={22} fill={isActive ? "currentColor" : "none"} />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}