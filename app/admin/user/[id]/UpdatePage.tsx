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
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { updateProfile } from "./actions";
import { ArrowLeft, Shield, User } from "lucide-react";
import Link from "next/link";

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
  const session = useSession();

  const form = useForm<UpdateAdminValues>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      quota: user.quota,
      role: user.role as "Admin" | "User" | undefined,
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
    <main className="min-h-screen  py-10 h-200">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Update User</h1>
                <p className="text-sm text-gray-500 mt-1">
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
                        <select 
                          {...field} 
                          className="w-full  border border-gray-200 bg-white rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </FormControl>
                      <FormDescription>user&apos;s permission level</FormDescription>
                      <FormMessage />
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
                          className="max-w-md"
                        />
                      </FormControl>
                      <FormDescription>Available message quota</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/admin">
                    <Button
                      type="button"
                      variant="outline"
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
