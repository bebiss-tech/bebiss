"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { BarChart2, Edit2, MoreHorizontal, Unplug } from "lucide-react";

export function DataTableRowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem>
          <span className="flex items-center gap-2 text-zinc-800">
            <Edit2 size={14} /> Editar
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex items-center gap-2 text-zinc-800">
            <Unplug size={14} /> Conectar WhatsApp
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="flex items-center gap-2 text-zinc-800">
            <BarChart2 size={14} /> Ver agendamentos
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
