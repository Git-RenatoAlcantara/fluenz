import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { AppBar } from "./_components/app-bar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full overflow-hidden">
      <SidebarProvider>
        <AppSidebar/>
        <div className="w-screen">
          <AppBar />
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default RootLayout;
