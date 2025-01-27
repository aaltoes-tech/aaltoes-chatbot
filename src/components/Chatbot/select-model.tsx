"use client";

import { useState, useEffect } from "react";
import { MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SelectModel() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedModel') || "gpt-4o-mini";
    }
    return "gpt-4o-mini";
  });

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('selectedModel', selectedModel);
    }
  }, [selectedModel]);

  const handleModelChange = async (newModel: string) => {
    setSelectedModel(newModel);
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
        <SelectContent className="bg-background border-border">
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