"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brush, CreditCard, LogOut, Tag, User } from "lucide-react";

const menu = [
  {
    label: "Configurações",
    items: [
      {
        label: "Conta",
        icon: User,
        href: "/conta",
      },
      {
        label: "Assinatura",
        icon: CreditCard,
        href: "/assinatura",
      },
      {
        label: "Personalizar",
        icon: Brush,
        href: "/personalizar",
      },
      {
        label: "Tags",
        icon: Tag,
        href: "/tags",
      },
    ],
  },
  {
    label: "",
    items: [
      {
        label: "Sair",
        icon: LogOut,
        href: "/sair",
      },
    ],
  },
];

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>AG</AvatarFallback>
          <AvatarImage src="https://github.com/alangabrielbs.png" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {menu.map(({ label, items }, index) => {
          const lastItem = index === menu.length - 1;
          return (
            <div key={index}>
              {label && (
                <>
                  <DropdownMenuLabel>
                    <span className="flex items-center gap-2 text-sm text-zinc-800">
                      {label}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              {items.map(({ label, icon: Icon }) => (
                <DropdownMenuItem key={label}>
                  <span className="flex items-center gap-2 text-sm text-zinc-800">
                    <Icon size={16} /> {label}
                  </span>
                </DropdownMenuItem>
              ))}
              {!lastItem ? <DropdownMenuSeparator /> : null}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
