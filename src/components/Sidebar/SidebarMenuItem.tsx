"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarMenuItemProps = {
  children: React.ReactNode;
  href: string;
};

const SidebarMenuItem = ({ children, href }: SidebarMenuItemProps) => {
  const path = usePathname();

  return (
    <li>
      <Link
        data-active={path === href}
        className="flex h-8 items-center gap-2 rounded-md px-4 text-sm text-slate-900 transition-colors hover:bg-slate-100/60 data-[active=true]:bg-slate-100/60"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
