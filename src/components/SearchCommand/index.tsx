/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-unknown-property */
"use client";

import NewCompanyModal from "@/components/modals/new-company-modal";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  BriefcaseIcon,
  Calendar,
  MessageCircle,
  Search,
  Store,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SearchCommand = () => {
  const [open, setOpen] = useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);

  const commands = useMemo(
    () => [
      {
        label: "Sugestões",
        items: [
          {
            icon: Calendar,
            label: "Novo agendamento",
            onClick: () => {},
          },
          {
            icon: Store,
            label: "Nova empresa",
            onClick: () => {
              setShowNewCompanyDialog(true);
              setOpen(false);
            },
          },
          {
            icon: BriefcaseIcon,
            label: "Novo profissional",
            onClick: () => {},
          },
          {
            icon: User,
            label: "Novo cliente",
            onClick: () => {},
          },
        ],
      },
      {
        label: "Suporte",
        items: [
          {
            icon: MessageCircle,
            label: "Falar com suporte",
            onClick: () => {
              console.log("Falar com suporte");
            },
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mr-8 hidden h-8 w-full max-w-xs items-center gap-3 rounded-full border border-zinc-400/10 bg-white/70 px-3  pl-2 text-sm text-zinc-600 lg:flex"
      >
        <Search size={14} />
        <span>Busque por algo...</span>
        <kbd className="text-2xs ml-auto rounded-md border border-gray-200 bg-gray-50 px-1 py-0.5 text-xs   text-gray-800">
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Sem resultados.</CommandEmpty>
          {commands.map(({ items, label }) => {
            return (
              <CommandGroup heading={label} key={label}>
                {items.map(({ icon: Icon, label, onClick }) => {
                  return (
                    <CommandItem
                      key={label}
                      value={label}
                      className="flex items-center gap-2"
                      onSelect={onClick}
                    >
                      <Icon size={10} className="text-zinc-500" />
                      {label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>

      <NewCompanyModal
        open={showNewCompanyDialog}
        onChangeVisibility={setShowNewCompanyDialog}
      />
    </>
  );
};
export default SearchCommand;
