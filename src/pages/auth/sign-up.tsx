import Image from "next/image";
import Link from "next/link";

import SidebarLogo from "@/components/Sidebar/SidebarLogo";
import Meta from "@/components/layouts/meta";
import { Button, buttonVariants } from "@/components/ui/button";
import Google from "@/components/ui/icons/google";
import Spinner from "@/components/ui/icons/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { signIn } from "next-auth/react";
import { useLayoutEffect, useState } from "react";

type User = {
  name: string;
};

export default function AuthenticationPage() {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setUser(JSON.parse(user) as User);
      }
    }
  }, []);

  const name = (user?.name || "").split(" ").shift();

  const wellcomeMessage = name
    ? `Bem-vindo de volta, ${name}!`
    : `Bem-vindo de volta`;

  return (
    <>
      <Meta title="Criar conta" />

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
          href="/auth/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Crie a sua conta aqui
              </h1>
              <p className="text-muted-foreground text-sm">
                Faça login com o Google
              </p>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() =>
                void signIn("google", {
                  callbackUrl: "/",
                })
              }
            >
              {isLoading ? (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="text-muted-foreground bg-white px-2">
                  ou crie sua conta com email
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit}>
              <div className="grid space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    placeholder="name@example.com"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                  />
                </div>

                <Button disabled={isLoading}>
                  {isLoading && (
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Criar conta
                </Button>
              </div>
            </form>

            <p className="text-muted-foreground px-8 text-center text-xs">
              Ao clicar em Entrar, você concorda com nossos{" "}
              <Link
                href="/termos-de-us0"
                className="hover:text-primary underline underline-offset-4"
              >
                Termos de uso
              </Link>{" "}
              and{" "}
              <Link
                href="/politica-de-privacidade"
                className="hover:text-primary underline underline-offset-4"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
