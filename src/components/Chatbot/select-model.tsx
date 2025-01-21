"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SelectModel() {
  const { data: session, update } = useSession();
  const [selectedModel, setSelectedModel] = useState(
    session?.user?.model || "gpt-4o-mini"
  );

  const handleModelChange = async (newModel: string) => {
    setSelectedModel(newModel);
    await update({ user: { model: newModel } });
  };

  return (
    <div className="relative">
      <Select onValueChange={handleModelChange} value={selectedModel}>
        <SelectTrigger className={cn(
         "w-full resize-none rounded-lg border bg-background text-base text-foreground",
            "placeholder:text-muted-foreground/60"
        )}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(MODELS).map((model) => (
            <SelectItem key={model} value={model}>
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}