/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/icons/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";

import Google from "@/components/ui/icons/google";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().nonempty({ message: "Nome é obrigatório." }),
  email: z.string().email({ message: "Email é obrigatório." }),
  password: z
    .string()
    .min(8, { message: "A senha deve conter pelo menos 8 caracteres." }),
});

export type CreateUserInputs = z.infer<typeof createUserSchema>;

const errorsTranslations = {
  "User already exists.": {
    title: "Usuário já existe.",
    description: "Tente realizar login.",
  },
};

const FormSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInputs>({
    resolver: zodResolver(createUserSchema),
  });
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: createUser } = api.users.create.useMutation();

  const onSubmit = handleSubmit((values) => {
    setIsLoading(true);

    createUser(values, {
      onSuccess() {
        toast({
          title: `Bem vindo ${values.name}!`,
          description: "Você será redirecionado para realizar login.",
        });

        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);

        setIsLoading(false);
      },
      onError(err) {
        const message = err.message as keyof typeof errorsTranslations;

        toast({
          title: errorsTranslations[message].title || "Erro ao criar conta.",
          description:
            errorsTranslations[message].description || "Tente novamente.",
        });

        setIsLoading(false);
      },
    });
  });

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crie a sua conta aqui
        </h1>
        <p className="text-muted-foreground text-sm">
          Crie para começar a usar o Bebiss
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
        {/* <Google className="mr-2 h-4 w-4" /> */}
        <FcGoogle className="mr-2 h-5 w-5" />
        Fazer login com o Google
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
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Alan Gabriel"
              type="text"
              autoCapitalize="none"
              autoComplete="nome"
              autoCorrect="off"
              data-error={!!errors.name?.message}
              className="data-[error=true]:border-red-500 data-[error=true]:focus-visible:ring-red-300"
              {...register("name")}
            />
            <span className="text-sm text-red-500">{errors.name?.message}</span>
          </div>
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

          <Button disabled={isLoading} type="submit">
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
        </div>
      </form>
      <p className="text-muted-foreground px-8 text-center text-xs">
        Ao clicar em Entrar, você concorda com nossos{" "}
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
