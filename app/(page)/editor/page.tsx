"use client";

import { Button } from "@/components/ui/button";
import { AppSidebar } from "../_components/app-sidebar";
import { useState } from "react";
import { VideoEditor } from "../_components/video-editor";

export default function Home() {
  const [open, setOpen] = useState(false);
  const onClickSidebar = () => {
    setOpen(!open);
  };

  return <VideoEditor />;
}
