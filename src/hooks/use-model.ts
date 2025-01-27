"use client";

import { useState, useEffect } from "react";

export function useModel() {
  const [model, setModel] = useState<string>("gpt-4o-mini");

  useEffect(() => {
    setModel(localStorage.getItem('selectedModel') || "gpt-4o-mini");
  }, []);

  return model;
} 