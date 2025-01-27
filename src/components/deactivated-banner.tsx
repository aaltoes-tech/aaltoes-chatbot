"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "@geist-ui/icons";
import { signOut } from "next-auth/react";

export function DeactivatedBanner() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h1 className="text-xl font-semibold">Account Deactivated</h1>
      <p className="max-w-md text-center text-muted-foreground text-lg">
        Your account has been deactivated. Please contact an administrator if you think this is an error.
      </p>
      <div className="flex gap-2 justify-center w-full max-w-md">
        <Button 
          variant="outline" 
          className="flex-1 hover:bg-accent hover:text-accent-foreground"
          onClick={() => window.location.href = "mailto:yera.slam@aaltoes.com?subject=Aaltoes%20ChatBot:%20Account%20Deactivated%20by%20error"}
        >
          Contact Support
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 hover:bg-accent hover:text-accent-foreground"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}