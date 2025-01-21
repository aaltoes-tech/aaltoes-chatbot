"use client";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { UpdateProfileValues, updateProfileSchema } from "../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { updateProfile } from "./actions";
import { Settings, User as UserIcon } from "@geist-ui/icons";
import Quota from "../../components/quota";
import { cn } from "../../lib/utils";

interface SettingsPageProps {
  user: User;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const { toast } = useToast();
  const session = useSession();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name || "" },
  });

  async function onSubmit(data: UpdateProfileValues) {
    try {
      await updateProfile(data);
      toast({ description: "Profile updated successfully." });
      session.update();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  }

  return (
    <div className="mx-auto my-5 max-w-2xl overflow-auto px-2">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3 border-b border-border pb-6">
          <div className="rounded-lg bg-primary/10 p-2">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account preferences
            </p>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <div className="rounded-full bg-background p-1 shadow-sm">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="truncate... text-sm font-medium text-foreground">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground/80">Account Email</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your display name"
                      {...field}
                      className={cn(
                        "w-full resize-none rounded-lg border bg-background text-base text-foreground",
                        "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "px-4 py-3.5 pr-12",
                        "shadow-sm transition-shadow duration-200",
                        "focus:shadow-md",
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Quota />
    </div>
  );
}
