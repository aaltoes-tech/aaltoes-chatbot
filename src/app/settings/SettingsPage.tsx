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
import { Settings, User as UserIcon } from "lucide-react";
import NavBar from "../../components/NavBar";
import Quota from "../../components/quota";

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
    <main className="bg-background">
      <NavBar />
      <div className="max-w-2xl mx-auto px-2 my-5 overflow-auto">
        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account preferences
              </p>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <div className="p-1 bg-background rounded-full shadow-sm">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate...">{user.email}</p>
                <p className="text-xs text-muted-foreground/80">Account Email</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
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
                        className="bg-background"
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
    </main>
  );
}
