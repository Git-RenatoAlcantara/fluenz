import { SidebarTrigger } from "@/components/ui/sidebar";
import { useVideoPlayer } from "@/app/store/useVideoPlayer";
import { Button } from "@/components/ui/button";
import { SaveVideo } from "./save-video";
import { NewVideo } from "./new-video";

export function AppBar() {
  const onClickSave = () => {};

  return (
    <nav className="bg-background border-b">
      <div className=" max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center">
          <SidebarTrigger />
          <div className="w-full flex justify-end">
            <div className="flex">
              <SaveVideo />
              <NewVideo />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
