"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";

import { getNameInitials } from "@/utils";
import { api } from "@/utils/api";
import NewCompanyModal from "./modals/new-company-modal";

const groups = [
  {
    label: "Empresas",
    companies: [
      {
        label: "Clinica Samambaia",
        value: "8bd2524d",
      },
      {
        label: "Clinica Águas Claras (SUL) - Av. das Castanheiras",
        value: "d4625d1e",
      },
    ],
  },
];

type Company = (typeof groups)[number]["companies"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type CompanySwitcherProps = PopoverTriggerProps;

export default function CompanySwitcher({ className }: CompanySwitcherProps) {
  const { data, isSuccess, isLoading } = api.companies.listCompanies.useQuery({
    limit: 40,
    page: 1,
  });

  const [open, setOpen] = React.useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<Company>({
    label: "",
    value: "",
  });

  React.useEffect(() => {
    if (isSuccess && data?.companies?.length) {
      setSelectedCompany({
        label: data.companies[0]!.name,
        value: data.companies[0]!.id,
      });
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className={cn("w-[300px] justify-between", className)}
        size="sm"
      >
        <span className="truncate">Carregando...</span>
      </Button>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Selecionar empresa"
            className={cn("w-[300px] justify-between", className)}
            size="sm"
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${getNameInitials(
                  selectedCompany.label
                )}?size=16`}
                alt={selectedCompany.label}
              />
              <AvatarFallback className="text-xs">SC</AvatarFallback>
            </Avatar>
            <span className="truncate">{selectedCompany.label}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar empresas..." />
              <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
              <CommandGroup heading="Empresa">
                {data?.companies.map(({ name, id }) => {
                  const initials = getNameInitials(name);
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => {
                        setSelectedCompany({
                          label: name,
                          value: id,
                        });
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${initials}?size=16`}
                          alt={name}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      {name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCompany.value === id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowNewCompanyDialog(true);
                  }}
                >
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Nova empresa
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <NewCompanyModal
        open={showNewCompanyDialog}
        onChangeVisibility={setShowNewCompanyDialog}
      />
    </>
  );
}
