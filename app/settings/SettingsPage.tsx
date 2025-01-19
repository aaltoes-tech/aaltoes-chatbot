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
    <main>
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 mx-3 my-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Settings className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account preferences
              </p>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Account Email</p>
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
                    <FormLabel className="text-gray-700">Display Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your display name" 
                        {...field}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
                      This is your public display name
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
