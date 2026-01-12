import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LandingPageContent } from "@/components/landing-page-content";

export default async function LandingPage() {
  const session = await auth();
  
  // Se o usuário já estiver logado, redireciona para o dashboard
  if (session) {
    redirect("/dashboard");
  }

  return <LandingPageContent />;
}
