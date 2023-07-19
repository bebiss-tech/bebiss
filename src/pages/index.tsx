import Meta from "@/components/layouts/meta";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Meta />

      <section className="relative flex min-h-screen items-center bg-grid-slate-50">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="mb-4 text-base font-bold tracking-[-0.02em] text-emerald-500">
            Otimize os processos do dia a dia
          </p>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-800">
            Sistema de confirmação de agendamentos e gestão de agenda.
          </h1>
          <p className="mt-6 max-w-xl  text-slate-600">
            Agenda organizada e compromissos pontuais. Simplifique sua rotina
            com nosso Sistema de Confirmação e Gestão de Agendamentos.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button>
              <span>Começar agora</span>
            </Button>
            <Link href="/auth/sign-in">
              <Button variant="link">
                <span>Fazer login</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
