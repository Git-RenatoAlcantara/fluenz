import { Bell, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NewVideo } from "@/app/(page)/(authorized)/playlist/_components/new-video-modal";
import { usePathname } from "next/navigation";
import { NewCard } from "@/app/(page)/(authorized)/play/[id]/_components/newCard";
import { NewCardModal } from "@/app/(page)/(authorized)/flashcards/_components/NewCardModal";


export default async function Header({
  newVideo,
  newCard
}:{
  newVideo?: boolean;
  newCard?: boolean;
}) {

  const pathname = usePathname()  

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Projects</h1>
        <div className="text-sm text-gray-400">
          <span className="mx-2">›</span>
          <span>International</span>
          <span className="mx-2">›</span>
          <span>Product Web</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        {pathname === "/flashcards" ? <NewCardModal /> :  <NewVideo/>}
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" alt="User" />
        </Avatar>
      </div>
    </header>
  );
}