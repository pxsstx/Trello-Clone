import React from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-svw h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-pink-50">
      {children}
      <Toaster />
    </div>
  );
}
