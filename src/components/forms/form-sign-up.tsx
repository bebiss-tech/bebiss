/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "@/components/ui/button";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const FormSignUp = () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crie a sua conta aqui
        </h1>
        <p className="text-muted-foreground text-sm">
          Crie sua conta para começar a usar o Bebiss
        </p>
      </div>

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          void signIn("google", {
            callbackUrl: "/",
          })
        }
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Criar conta com o Google
      </Button>

      <p className="text-muted-foreground px-8 text-center text-xs">
        Ao clicar em <span className="italic">Criar conta com o Google</span>,
        você concorda com nossos{" "}
        <Link
          href="/termos-de-uso"
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
  );
};

export default FormSignUp;
