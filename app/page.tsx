import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12 bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="space-y-6 max-w-4xl px-4 mt-20">
        <div className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full">
          Novo App 2026
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-900">
          Viaje Barato. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Lucre com Milhas.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A plataforma mais segura e moderna do Brasil. Conectamos quem quer viajar com quem tem milhas sobrando, com pagamento via PIX e garantia total.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all">
              Começar Agora
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-50 transition-all">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4 py-16">
        <div className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
            <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-900">Segurança Total</h3>
          <p className="text-slate-500 leading-relaxed">O dinheiro só é liberado para o vendedor após a confirmação da emissão. Garantia de 5 dias pós-venda.</p>
        </div>

        <div className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-900">Pagamento PIX</h3>
          <p className="text-slate-500 leading-relaxed">Receba e pague instantaneamente via PIX. Sem taxas de cartão e sem burocracia.</p>
        </div>

        <div className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
            <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-900">Melhor Cotação</h3>
          <p className="text-slate-500 leading-relaxed">Negocie diretamente no marketplace. Vendedores definem o preço, compradores escolhem a melhor oferta.</p>
        </div>
      </section>
      
      <footer className="w-full py-8 text-center text-slate-400 text-sm">
        © 2026 FacilMilha. Todos os direitos reservados.
      </footer>
    </div>
  );
}
