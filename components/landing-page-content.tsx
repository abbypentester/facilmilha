import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  Coins, 
  ShieldCheck, 
  Search, 
  FileCheck, 
  Wallet, 
  ArrowRight, 
  CheckCircle2,
  ThumbsUp,
  UserCheck,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LiveOpportunities } from "@/components/live-opportunities";

export function LandingPageContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <LiveOpportunities />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white -z-10" />
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            A revolução das milhas chegou
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-tight">
            Viaje pagando menos. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Lucre com suas milhas.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            O marketplace P2P que conecta viajantes e milheiros com <strong>pagamento protegido (Escrow)</strong>, <strong>perfis verificados</strong> e total transparência.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-50 transition-all w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>

          {/* Trust Bullets */}
          <div className="pt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base font-medium text-slate-600 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Pagamento em Custódia (Escrow)
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Perfis Verificados
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
              Sem Taxas Ocultas
            </div>
          </div>
        </div>
      </section>

      {/* Business Summary (Leitura Rápida) */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Entenda o Modelo FacilMilha</h2>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Plane className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Para Viajantes</h3>
                        <p className="text-slate-600 text-sm">
                            Compram passagens muito mais baratas, emitidas com as milhas de outras pessoas.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Coins className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Para Milheiros</h3>
                        <p className="text-slate-600 text-sm">
                            Monetizam milhas paradas vendendo passagens para quem precisa viajar.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <ShieldCheck className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Segurança Total</h3>
                        <p className="text-slate-600 text-sm">
                            Verificação de perfis e fluxo via PIX com proteção de pagamento.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Como funciona na prática?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simples, transparente e seguro para os dois lados. Escolha seu perfil e veja o passo a passo.
            </p>
          </div>

          <Tabs defaultValue="traveler" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 h-16 p-1 bg-slate-100 rounded-full mb-12">
              <TabsTrigger 
                value="traveler" 
                className="rounded-full text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
              >
                <Plane className="mr-2 h-5 w-5" />
                Quero Viajar
              </TabsTrigger>
              <TabsTrigger 
                value="milheiro" 
                className="rounded-full text-lg font-medium data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all"
              >
                <Coins className="mr-2 h-5 w-5" />
                Tenho Milhas
              </TabsTrigger>
            </TabsList>

            {/* Traveler Journey */}
            <TabsContent value="traveler" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StepCard 
                  number="1"
                  icon={<Search className="w-6 h-6 text-blue-600" />}
                  title="Faça seu Pedido"
                  description="Informe origem, destino e data. Sua solicitação vai para nosso mural de oportunidades."
                />
                <StepCard 
                  number="2"
                  icon={<FileCheck className="w-6 h-6 text-blue-600" />}
                  title="Receba Ofertas"
                  description="Milheiros verificados enviam propostas com o valor final da emissão."
                />
                <StepCard 
                  number="3"
                  icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
                  title="Pagamento Seguro"
                  description="Aceite a melhor oferta e pague via PIX. O dinheiro fica guardado (Escrow) até a emissão."
                />
                <StepCard 
                  number="4"
                  icon={<Plane className="w-6 h-6 text-blue-600" />}
                  title="Boa Viagem!"
                  description="Receba o localizador, confirme no site da cia aérea e libere o pagamento. Pronto!"
                />
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-blue-900">Pronto para economizar?</h3>
                  <p className="text-blue-700">Milhares de viajantes já estão pagando menos em suas passagens.</p>
                </div>
                <Link href="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                    Criar Pedido Grátis
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Milheiro Journey */}
            <TabsContent value="milheiro" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StepCard 
                  number="1"
                  icon={<Search className="w-6 h-6 text-green-600" />}
                  title="Encontre Pedidos"
                  description="Acesse o mural e veja solicitações reais de viajantes prontos para comprar."
                />
                <StepCard 
                  number="2"
                  icon={<Coins className="w-6 h-6 text-green-600" />}
                  title="Envie sua Oferta"
                  description="Defina seu preço e prazo. Sem intermediários, você decide quanto quer ganhar."
                />
                <StepCard 
                  number="3"
                  icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                  title="Emita a Passagem"
                  description="Após o viajante pagar (garantido), você recebe os dados para emitir na cia aérea."
                />
                <StepCard 
                  number="4"
                  icon={<Wallet className="w-6 h-6 text-green-600" />}
                  title="Receba no PIX"
                  description="Envie o comprovante. Assim que o viajante validar, o dinheiro cai na sua conta."
                />
              </div>

              <div className="bg-green-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-green-100">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-green-900">Faça renda extra com milhas</h3>
                  <p className="text-green-700">Monetize seus pontos parados com segurança e rapidez.</p>
                </div>
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
                    Começar a Vender
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Segurança em Primeiro Lugar</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Construímos um ecossistema onde a confiança é a base de tudo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Pagamento Protegido</h3>
              <p className="text-slate-400 leading-relaxed">
                Usamos um sistema de custódia (Escrow). O vendedor só recebe quando o viajante confirma que a passagem é válida.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Perfis Verificados</h3>
              <p className="text-slate-400 leading-relaxed">
                Todos os usuários passam por verificação básica. Milheiros têm reputação e histórico visíveis.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ThumbsUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Transparência Total</h3>
              <p className="text-slate-400 leading-relaxed">
                Sem taxas ocultas. Você vê exatamente quanto vai pagar ou receber antes de fechar qualquer negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Dúvidas Frequentes</h2>
            <p className="text-slate-600">
              Tudo o que você precisa saber para negociar com segurança.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Isso é permitido?</AccordionTrigger>
              <AccordionContent>
                Sim. A comercialização de passagens aéreas emitidas com milhas por terceiros não é ilegal no Brasil. O FacilMilha atua como intermediário para garantir que o acordo entre as partes seja cumprido com segurança.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>E se o milheiro não emitir a passagem?</AccordionTrigger>
              <AccordionContent>
                Seu dinheiro está protegido. O pagamento fica retido em nossa conta de custódia (Escrow) e só é repassado ao vendedor após você confirmar que recebeu o localizador e validou a passagem no site da companhia aérea. Se ele não emitir, você recebe 100% do valor de volta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Quanto tempo leva a emissão?</AccordionTrigger>
              <AccordionContent>
                O prazo é definido na oferta do milheiro (geralmente entre 2h e 24h). Você só deve aceitar ofertas com prazos que atendam sua necessidade.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Quais dados preciso enviar?</AccordionTrigger>
              <AccordionContent>
                Apenas após aceitar uma oferta e realizar o pagamento, você preencherá um formulário seguro com os dados exigidos pela companhia aérea (Nome completo, CPF/Passaporte, Data de Nascimento, etc.). Esses dados são enviados apenas para o milheiro responsável pela emissão.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Como funciona o pagamento?</AccordionTrigger>
              <AccordionContent>
                O pagamento é feito via PIX para garantir agilidade na emissão. O valor fica guardado conosco até a conclusão do processo. O FacilMilha cobra uma pequena taxa de serviço já inclusa no valor final mostrado na oferta.
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-6">
              <AccordionTrigger>E se eu precisar cancelar?</AccordionTrigger>
              <AccordionContent>
                As regras de cancelamento e alteração seguem as políticas da companhia aérea para a tarifa emitida. O FacilMilha intermediará o contato, mas eventuais multas da companhia aérea serão repassadas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="container mx-auto px-4 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Junte-se a milhares de brasileiros que já estão revolucionando a forma de emitir passagens aéreas.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-2xl transition-all hover:scale-105 font-bold w-full sm:w-auto">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
        {number}
      </div>
      <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  )
}
