"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams?.get("next") || "";
  const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login to DesAInR</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Please sign in with your email/password or Google to continue.
        </p>
        <LoginForm onSuccess={() => router.push(nextPath)} />
      </div>
    </div>
  );
}
