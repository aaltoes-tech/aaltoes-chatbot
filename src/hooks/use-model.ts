"use client";

import { useState, useEffect } from "react";

export function useModel() {
  const [model, setModel] = useState<string>("gpt-4o-mini");

  useEffect(() => {
    // Initial value
    setModel(localStorage.getItem('selectedModel') || "gpt-4o-mini");

    // Listen for changes
    const handleStorageChange = () => {
      setModel(localStorage.getItem('selectedModel') || "gpt-4o-mini");
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return model;
} 