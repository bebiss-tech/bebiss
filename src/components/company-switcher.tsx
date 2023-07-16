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
  const [open, setOpen] = React.useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Company>(
    groups[0]!.companies[0]!
  );

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
                src={`https://avatar.vercel.sh/${selectedTeam.value}?size=16`}
                alt={selectedTeam.label}
              />
              <AvatarFallback className="text-xs">SC</AvatarFallback>
            </Avatar>
            <span className="truncate">{selectedTeam.label}</span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar empresas..." />
              <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.companies.map((company) => (
                    <CommandItem
                      key={company.value}
                      onSelect={() => {
                        setSelectedTeam(company);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${company.value}?size=16`}
                          alt={company.label}
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {company.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.value === company.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
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
                  Nova empresas
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
