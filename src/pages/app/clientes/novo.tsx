/* eslint-disable @typescript-eslint/no-misused-promises */
import Select from "@/components/Select";
import TextField from "@/components/TextField";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/contexts/Company";
import { api } from "@/utils/api";
import { cpfMask, dateMask, phoneMask, removeMask } from "@/utils/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Client } from "@prisma/client";
import { ArrowLeft, BadgeInfo, Stars } from "lucide-react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createClientSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Nome deve ter no mínimo 3 caracteres",
    })
    .max(150, {
      message: "Nome deve ter no máximo 150 caracteres",
    })
    .nonempty({
      message: "Nome é obrigatório",
    }),
  phone: z
    .string({
      required_error: "Telefone é obrigatório",
    })
    .nonempty({ message: "Telefone é obrigatório" })
    .refine(
      (phone) => {
        return removeMask(phone).length === 11;
      },
      {
        message: "Telefone inválido",
      }
    ),
  secundaryPhone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        return removeMask(phone).length === 11;
      },
      {
        message: "Telefone inválido",
      }
    ),
  email: z
    .string()
    .or(z.string().email({ message: "E-mail inválido" }))
    .optional(),
  cpf: z
    .string()
    .refine(
      (cpf) => {
        if (!cpf) return true;

        return removeMask(cpf).length === 11;
      },
      {
        message: "CPF inválido",
      }
    )
    .optional(),
  birthday: z
    .string()
    .length(10, {
      message: "Data de nascimento inválida",
    })
    .optional(),
  gender: z.enum(["male", "famale", "uninformed"]).optional(),
});

type Inputs = z.infer<typeof createClientSchema>;

export default function NewClient() {
  const router = useRouter();
  const { company } = useCompany();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    resolver: zodResolver(createClientSchema),
  });

  const { isLoading, mutateAsync: createClient } =
    api.clients.createClient.useMutation();

  const onSubmit = handleSubmit((data) => {
    const toastId = toast.promise(
      new Promise<Client>(async (resolve) => {
        const client = await createClient({
          ...data,
          phone: removeMask(data.phone),
          secundaryPhone: removeMask(data.secundaryPhone),
          cpf: removeMask(data.cpf),
          companyId: company.value,
        });

        resolve(client.result);
      }),
      {
        loading: "Adicionando cliente...",
        success: ({ name, id }) => {
          toast(`O cliente "${name}" foi adicionado com sucesso!`, {
            id: toastId,
            duration: 10000,
            action: {
              label: "Agendar",
              onClick: () => {
                void router.push(`/app/agendamentos/novo?client=${id}`);
              },
            },
          });

          return `O cliente "${name}" foi adicionado com sucesso!`;
        },
        error: "Erro ao criar cliente",
        duration: 10000,
      }
    );
  });

  return (
    <AppLayout>
      <Button
        variant="link"
        className="flex items-center gap-2 pl-0 text-slate-400"
      >
        <ArrowLeft size={14} /> <span>Voltar</span>
      </Button>
      <div className="bg-white p-6">
        <h1 className="text-xl font-medium tracking-tight text-slate-600 transition-colors">
          Cadastrar novo clientes
        </h1>

        <div className="item-start flex w-full gap-8">
          <form onSubmit={onSubmit} className="mt-6 w-full max-w-4xl space-y-4">
            <h4 className="text-muted-foreground -mb-2 text-sm text-slate-500 ">
              Informações principais
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Nome"
                placeholder="Nome"
                error={errors.name?.message}
                {...register("name")}
              />
              <TextField
                label="E-mail"
                placeholder="E-mail"
                optional
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="phone"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="Telefone (WhatsApp)"
                    placeholder="(61) 99999-9999"
                    value={value}
                    onChange={({ target: { value } }) => {
                      onChange(phoneMask(value));
                    }}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                name="secundaryPhone"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label="Telefone secundário"
                    placeholder="(61) 99999-9999"
                    optional
                    value={value}
                    onChange={({ target: { value } }) => {
                      onChange(phoneMask(value));
                    }}
                    error={error?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex w-full items-start gap-4">
                <Controller
                  name="cpf"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="CPF"
                      placeholder="123.456.789-10"
                      optional
                      value={value}
                      className="flex-1"
                      onChange={({ target: { value } }) => {
                        onChange(cpfMask(value));
                      }}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  name="birthday"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Data de nascimento"
                      placeholder="08/05/1999"
                      optional
                      value={value}
                      onChange={({ target: { value } }) => {
                        onChange(dateMask(value));
                      }}
                      error={error?.message}
                    />
                  )}
                />
              </div>

              <Controller
                control={control}
                name="gender"
                render={({
                  fieldState: { error },
                  field: { onChange, value },
                }) => {
                  return (
                    <Select
                      label="Sexo"
                      options={[
                        {
                          label: "Masculino",
                          value: "male",
                        },
                        {
                          label: "Feminino",
                          value: "female",
                        },
                        {
                          label: "Prefiro não informar",
                          value: "uninformed",
                        },
                      ]}
                      placeholder="Sexo"
                      error={error?.message}
                      onValueChange={onChange}
                      value={value}
                      optional
                    />
                  );
                }}
              />
            </div>

            {/* <Separator className="!mt-8" />

            <h4 className="text-muted-foreground -mb-2 text-sm text-slate-500 ">
              Endereço <span className="text-xs text-gray-400">(opcional)</span>
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <TextField label="CEP" placeholder="72123-000" optional />

              <Select
                label="Estado"
                options={brazilianStates}
                placeholder="Estado"
                optional
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField label="Cidade" optional />

              <TextField label="Bairro" optional />
            </div>

            <div className="grid grid-cols-[1fr_150px] gap-4">
              <TextField label="Rua" optional />

              <TextField label="Numero" optional />
            </div> */}

            <Button
              className="mt-4"
              // type="button"
              // onClick={() =>
              //   toast("Cliente criado com sucesso!", {
              //     description: "O cliente Alan Gabriel foi criado com sucesso!",
              //   })
              // }
            >
              {isLoading ? "Carregando..." : "Adicionar cliente"}
            </Button>
          </form>

          <div className="mt-[76px] max-w-sm space-y-6 self-start">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              <h1 className="flex items-start gap-2">
                <span className="mt-1 text-emerald-500">
                  <BadgeInfo size={14} />
                </span>
                O tefelone deve ser um número de WhatsApp, pois é através dele
                que o cliente receberá as notificações de agendamento.
              </h1>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-900">
              <h1 className="flex items-start gap-2">
                <span className="mt-1">
                  <Stars size={14} />
                </span>
                O cliente é a parte principal do sistema, é através dele que
                você poderá gerenciar todos os seus agendamentos.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
