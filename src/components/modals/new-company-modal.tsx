/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import Select from "@/components/Select";
import TextField from "@/components/TextField";
import { api } from "@/utils/api";
import { brazilianStates } from "@/utils/brazilian-states";
import { phoneMask, removeMask, zipcodeMask } from "@/utils/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "./base-modal";

const createCompanySchema = z.object({
  companyName: z
    .string()
    .min(3, {
      message: "Nome deve ter no mínimo 3 caracteres",
    })
    .max(150, {
      message: "Nome deve ter no máximo 150 caracteres",
    }),
  phone: z
    .string({
      required_error: "Telefone é obrigatório",
    })
    .nonempty({ message: "Telefone é obrigatório" }),
  zipcode: z
    .string({
      required_error: "CEP é obrigatório",
    })
    .nonempty({ message: "CEP é obrigatório" }),
  state: z
    .string({
      required_error: "Estado é obrigatório",
    })
    .nonempty({ message: "Estado é obrigatório" }),
  city: z
    .string({
      required_error: "Cidade é obrigatório",
    })
    .nonempty({ message: "Cidade é obrigatório" }),
  neighborhood: z
    .string({
      required_error: "Bairro é obrigatório",
    })
    .nonempty({ message: "Bairro é obrigatório" }),
  street: z
    .string({
      required_error: "Rua é obrigatório",
    })
    .nonempty({ message: "Rua é obrigatório" }),
  number: z
    .string({
      required_error: "Número é obrigatório",
    })
    .nonempty({ message: "Número é obrigatório" }),
});

type Inputs = z.infer<typeof createCompanySchema>;

type NewCompanyModalProps = {
  onChangeVisibility: (open: boolean) => void;
  open: boolean;
  welcomeFlow?: boolean;
};

const NewCompanyModal = ({
  onChangeVisibility,
  open,
  welcomeFlow,
}: NewCompanyModalProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(createCompanySchema),
  });

  const onClose = () => {
    reset();
    onChangeVisibility(false);
  };

  const { mutate: createCompany } = api.companies.createCompany.useMutation();
  const { mutate: changeOnboardingStep } =
    api.onboarding.changeStep.useMutation();

  const onSubmit = handleSubmit((values) => {
    createCompany(
      {
        ...values,
        phone: removeMask(values.phone),
        zipcode: removeMask(values.zipcode),
      },
      {
        onSuccess: ({ result: { name, id } }) => {
          if (welcomeFlow) {
            const query = {
              type: "upgrade",
              id,
            };

            changeOnboardingStep({
              step: "UPGRADE",
              query,
            });

            toast({
              title: `${name} criada com sucesso!`,
              description: `Assine o plano PRO para ter acesso a todas as funcionalidades.`,
            });

            setTimeout(() => {
              void router.push({
                pathname: "/app/welcome",
                query,
              });
            }, 1000);

            return;
          }

          toast({
            title: `${name} criada com sucesso!`,
            description: `Agora você pode realizar agendamentos para a ${name}.`,
          });

          onClose();
        },
        onError: (error) => {
          toast({
            title: "Erro ao criar empresa.",
            description: error.message,
          });
        },
      }
    );
  });

  const zipcode = watch("zipcode");
  const { data: address, isSuccess: addressIsSucess } =
    api.brasilAPI.getAddressByZipcode.useQuery(
      {
        zipcode: removeMask(zipcode),
      },
      {
        enabled: zipcode?.length === 9,
      }
    );

  useEffect(() => {
    if (addressIsSucess && address) {
      setValue("state", address.state);
      setValue("city", address.city);
      setValue("neighborhood", address.neighborhood);
      setValue("street", address.street);
    }
  }, [address, addressIsSucess, setValue]);

  useEffect(() => {
    return () =>
      reset({
        companyName: "",
        phone: "",
        zipcode: "",
        state: "",
        city: "",
        neighborhood: "",
        street: "",
        number: "",
      });
  }, [reset]);

  return (
    <Modal
      showModal={open}
      setShowModal={onChangeVisibility}
      welcomeFlow={welcomeFlow}
    >
      <form onSubmit={onSubmit} className="space-y-4 p-6">
        <div>
          <h2 className="mb-1 text-lg font-medium">Nova empresa</h2>

          <p className="text-sm text-gray-500">
            Adicione uma nova empresa para gerenciar agendamentos.
          </p>
        </div>

        <div>
          <div className="space-y-4 py-2 pb-4">
            <TextField
              label="Nome"
              placeholder="Bebiss"
              error={errors.companyName?.message}
              {...register("companyName")}
            />

            <Controller
              name="phone"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  label="Telefone"
                  placeholder="(61) 99999-9999"
                  value={value}
                  onChange={({ target: { value } }) => {
                    onChange(phoneMask(value));
                  }}
                  error={error?.message}
                />
              )}
            />

            <div className="space-y-4">
              <h4 className="text-muted-foreground -mb-2 text-sm text-slate-500 ">
                Endereço
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="zipcode"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="CEP"
                      value={value}
                      onChange={({ target: { value } }) => {
                        onChange(zipcodeMask(value));
                      }}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="state"
                  render={({
                    fieldState: { error },
                    field: { onChange, value },
                  }) => {
                    return (
                      <Select
                        label="Estado"
                        options={brazilianStates}
                        placeholder="Estado"
                        error={error?.message}
                        onValueChange={onChange}
                        value={value}
                      />
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Cidade"
                  error={errors.city?.message}
                  {...register("city")}
                />

                <TextField
                  label="Bairro"
                  error={errors.neighborhood?.message}
                  {...register("neighborhood")}
                />
              </div>

              <div className="grid grid-cols-[1fr_100px] gap-4">
                <TextField
                  label="Rua"
                  error={errors.street?.message}
                  {...register("street")}
                />

                <TextField
                  label="Numero"
                  error={errors.number?.message}
                  {...register("number")}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          {!welcomeFlow && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Criar</Button>
        </DialogFooter>
      </form>
    </Modal>
  );
};

export default NewCompanyModal;
