"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function SelectModel() {
  const { data: session } = useSession();
  const [selectedModel, setSelectedModel] = useState(
    session?.user?.model || "gpt-4o-mini"
  );

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: newModel }),
      });
      if (!response.ok) throw new Error("Failed to update model");
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  return (
    <div className="relative">
      <select
        onChange={handleModelChange}
        value={selectedModel}
        className={cn(
          "appearance-none rounded-lg border border-border bg-background",
          "text-sm font-medium text-foreground hover:bg-accent",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "px-2 py-1.5 pr-7 w-[120px] md:w-auto md:px-3 md:py-1 md:pr-8"
        )}
      >
        {Object.keys(MODELS).map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
}