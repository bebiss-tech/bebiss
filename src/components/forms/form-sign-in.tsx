/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

type User = {
  name: string;
};

const FormSignIn = () => {
  const [user, setUser] = useState<User>({
    name: "",
  });

  useEffect(() => {
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
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {wellcomeMessage}
        </h1>
        <p className="text-muted-foreground text-sm">
          Faça login para começar a usar o Bebiss
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
        Fazer login com o Google
      </Button>

      <p className="text-muted-foreground px-6 text-center text-xs">
        Ao clicar em <span className="italic">Fazer login com o Google</span>,
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

export default FormSignIn;
