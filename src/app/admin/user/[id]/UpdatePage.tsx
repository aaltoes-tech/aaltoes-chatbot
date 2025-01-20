"use client";

import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { useToast } from "../../../../components/ui/use-toast";
import { UpdateAdminValues, updateAdminSchema } from "../../../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProfile } from "./actions";
import { ArrowLeft, Shield, User } from "lucide-react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
interface UpdatePageProps {
  user: {
    id: string,
    name: string,
    image: string,
    createdAt: Date,
    quota: number,
    role: string,
  }
}

export default function UpdatePage({ user }: UpdatePageProps) {
  const { toast } = useToast();

  const form = useForm<UpdateAdminValues>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      quota: user.quota,
      role: user.role as "Admin" | "User" | undefined,
      id: user.id,
    },
  });

  async function onSubmit(data: UpdateAdminValues) {
    try {
      await updateProfile(data);
      toast({ description: "Profile updated successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{user.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Modify user data
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <div className="relative">
                        <select 
                          {...field} 
                          className="appearance-none w-full border border-border bg-background rounded-lg px-3 py-2
                                   text-foreground 
                                   focus-visible:ring-ring focus-visible:ring-offset-0">
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
                size={14}
              />
                        </div>
                       
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        User&apos;s permission level
                      </FormDescription>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quota ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="max-w-md bg-background"
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        Available message quota
                      </FormDescription>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/admin">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
