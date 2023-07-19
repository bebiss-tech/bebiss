import Image from "next/image";
import Link from "next/link";

import SidebarLogo from "@/components/Sidebar/SidebarLogo";
import FormSignIn from "@/components/forms/form-sign-in";
import Meta from "@/components/layouts/meta";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export default function AuthenticationPage() {
  return (
    <>
      <Meta title="Login" />

      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/auth/sign-up"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Criar conta
        </Link>
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />

          <SidebarLogo className="relative z-20" />

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Liberou nossa equipe e telefones para outros temas que
                necessitam de maior atenção. Foi uma ótima tomada de decisão de
                um investimento que está longe de ser um custo.&rdquo;
              </p>
              <footer className="text-sm">Adriane Rezende</footer>
            </blockquote>
          </div>
        </div>

        <div className="lg:p-8">
          <FormSignIn />
        </div>
      </div>
    </>
  );
}
