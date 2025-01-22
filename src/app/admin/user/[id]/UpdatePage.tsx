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
import {
  UpdateAdminValues,
  updateAdminSchema,
} from "../../../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProfile } from "./actions";
import { ArrowLeft, Shield, User } from "@geist-ui/icons";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useSidebar } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";


interface UpdatePageProps {
  user: {
    id: string;
    name: string;
    image: string;
    createdAt: Date;
    quota: number;
    role: string;
    active: boolean;
  };
}

export default function UpdatePage({ user }: UpdatePageProps) {
  const { toast } = useToast();
  const session = useSession();
  const { open, openMobile, isMobile } = useSidebar();


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
  const toggleUserActive = async (username: string, userId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/user/${userId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (!response.ok) {
        throw new Error();
      } else {
        toast({ description: `Account of ${username} was ${active ? ' activated' : ' deactivated'} successfully` });
      }
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to update user status" });
    }
  };
  


  return (
    <div className="mx-auto max-w-4xl px-4 pt-8">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Admin Dashboard
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground">Modify user data</p>
            </div>
          </div>

          {isMobile &&( <div className="flex items-center gap-4 pt-4">
            Account is {user.active ? "active" : "inactive"}:
            <Switch 
                      disabled={user.id === session?.data?.user?.id}
                      defaultChecked={user.active}
              onCheckedChange={(checked) => toggleUserActive(user.name || "User", user.id, checked)}
            />
          </div>)}
        
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <Slider onValueChange={(value) => field.onChange(value[0])} value={[field.value]} defaultValue={[field.value]} max={10} step={0.5} className="border-border max-w-md bg-background"/>
                    </FormControl>
                    <FormDescription className="text-muted-foreground  text-lg">
                      Available message quota: $ {field.value}
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
  );
}
