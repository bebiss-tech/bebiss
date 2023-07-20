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
import { getNameInitials } from "@/utils";
import { CreditCard, LogOut, MessageCircle, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

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
        label: "Suporte",
        icon: MessageCircle,
        href: "/personalizar",
      },
    ],
  },
];

const UserDropdown = () => {
  const { data } = useSession();

  const handleSignOut = () => {
    void signOut({
      callbackUrl: "/auth/sign-in",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{getNameInitials(data!.user.name!)}</AvatarFallback>
          <AvatarImage src={data!.user.image!} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2">
          <p className="truncate text-sm font-medium text-gray-900">
            {data?.user.name}
          </p>
          <p className="truncate text-sm text-gray-500">{data?.user.email}</p>
        </div>
        <DropdownMenuSeparator />

        {menu.map(({ label, items }, index) => {
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
              {items.map(({ label, icon: Icon, href }) => (
                <DropdownMenuItem key={label} className="cursor-pointer">
                  <Link href={href} className="w-full">
                    <span className="flex items-center gap-2 text-sm text-zinc-800">
                      <Icon size={16} /> {label}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                key={label}
                className="cursor-pointer"
                onClick={handleSignOut}
              >
                <span className="flex items-center gap-2 text-sm text-zinc-800">
                  <LogOut size={16} /> Sair
                </span>
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
