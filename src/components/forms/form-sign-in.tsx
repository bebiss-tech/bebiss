/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/icons/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { useToast } from "../ui/use-toast";

type User = {
  name: string;
};

export const loginSchema = z.object({
  email: z.string().email({ message: "Email é obrigatório." }),
  password: z.string().nonempty({ message: "Senha é obrigatória." }),
});

export type LoginInputs = z.infer<typeof loginSchema>;

const FormSignIn = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
        callbackUrl: "/",
      });

      if (response?.ok) {
        router.push("/");
      }

      if (response?.error) {
        throw new Error("Usuário ou senha inválidos.");
      }
    } catch (err: any) {
      toast({
        title: "Erro ao fazer login, tente novamente.",
        description: err?.message,
      });
    } finally {
      setIsLoading(false);
    }
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
          // <Google className="mr-2 h-4 w-4" />
          <FcGoogle className="mr-2 h-5 w-5" />
        )}
        Fazer login com o Google
      </Button>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="text-muted-foreground bg-white px-2">
            ou faça login com email
          </span>
        </div>
      </div> */}

      {/* <form onSubmit={onSubmit}>
        <div className="grid space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="alan@bebiss.com.br"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              data-error={!!errors.email?.message}
              className="data-[error=true]:border-red-500 data-[error=true]:focus-visible:ring-red-300"
              {...register("email")}
            />
            <span className="text-sm text-red-500">
              {errors.email?.message}
            </span>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              placeholder="••••••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              data-error={!!errors.password?.message}
              className="data-[error=true]:border-red-500 data-[error=true]:focus-visible:ring-red-300"
              {...register("password")}
            />
            <span className="text-sm text-red-500">
              {errors.password?.message}
            </span>
          </div>

          <Button disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </div>
      </form> */}

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
