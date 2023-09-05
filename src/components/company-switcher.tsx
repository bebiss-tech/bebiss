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

import { useCompany } from "@/contexts/Company";
import { getNameInitials } from "@/utils";
import NewCompanyModal from "./modals/new-company-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type CompanySwitcherProps = PopoverTriggerProps;

export default function CompanySwitcher({ className }: CompanySwitcherProps) {
  const { companies, isLoading, company, setCompany } = useCompany();

  const [open, setOpen] = React.useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = React.useState(false);

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
                  company.label
                )}?size=16`}
                alt={company.label}
              />
              <AvatarFallback className="text-xs">SC</AvatarFallback>
            </Avatar>
            <span className="truncate">{company.label}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar empresas..." />
              <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
              <CommandGroup heading="Empresa">
                {companies?.companies.map(({ name, id }) => {
                  const initials = getNameInitials(name);
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => {
                        setCompany({
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
                          company.value === id ? "opacity-100" : "opacity-0"
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
