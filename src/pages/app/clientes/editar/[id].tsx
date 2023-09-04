/* eslint-disable @typescript-eslint/no-misused-promises */
import Select from "@/components/Select";
import TextField from "@/components/TextField";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { cpfMask, dateMask, phoneMask } from "@/utils/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BadgeInfo, Stars } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const clientSchema = z.object({
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
    .nonempty({ message: "Telefone é obrigatório" }),
  secundaryPhone: z.string().optional(),
  email: z
    .string()
    .or(z.string().email({ message: "E-mail inválido" }))
    .optional(),
  cpf: z
    .string()
    .length(11, {
      message: "CPF deve ter 11 caracteres",
    })
    .optional(),
  birthDate: z
    .string()
    .length(10, {
      message: "Data de nascimento inválida",
    })
    .optional(),
  gender: z.enum(["male", "famale", "uninformed"]).optional(),
});

type Inputs = z.infer<typeof clientSchema>;

export default function NewClient() {
  const { toast } = useToast();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    resolver: zodResolver(clientSchema),
  });

  const { mutate: createClient, isLoading } =
    api.clients.createClient.useMutation();

  const onSubmit = handleSubmit((data) => {
    createClient(
      {
        ...data,
        companyId: "499e1c52-efa8-4adc-a22c-202d75175091",
      },
      {
        onSuccess: () => {
          toast({
            title: `Cliente criada com sucesso!`,
            description: `O cliente ${data.name} foi criado com sucesso!`,
            action: (
              <ToastAction
                altText={`Criar agendamento para o cliente ${data.name}`}
              >
                Criar agendamento
              </ToastAction>
            ),
          });
        },
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
                  name="birthDate"
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
              type="button"
              onClick={() =>
                toast({
                  duration: 3000,
                  title: `Cliente adicionado!`,
                  description: `O cliente Alan Gabriel foi criado com sucesso!`,
                  action: (
                    <ToastAction
                      altText={`Criar agendamento para o cliente Alan Gabriel`}
                    >
                      Criar agendamento
                    </ToastAction>
                  ),
                })
              }
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
