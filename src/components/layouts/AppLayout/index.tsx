import {
  BriefcaseIcon,
  Calendar,
  Home,
  MessageCircle,
  MessageSquareDashed,
  PackageIcon,
  Store,
  Users2,
} from "lucide-react";
import { type Metadata } from "next";

import Feedback from "@/components/Feedback";
import { Header } from "@/components/Header";
import SearchCommand from "@/components/SearchCommand";
import { Sidebar } from "@/components/Sidebar";
import UserDropdown from "@/components/UserDropdown";
import CompanySwitcher from "@/components/company-switcher";
import Meta from "@/components/layouts/meta";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Bebiss",
};

const menu = [
  {
    label: "Dashboard",
    href: "/app/",
    icon: Home,
  },
  {
    label: "Agendamentos",
    href: "/app/agendamentos",
    icon: Calendar,
  },
  {
    label: "Empresas",
    href: "/app/empresas",
    icon: Store,
  },
  {
    label: "Profissionais",
    href: "/app/profissionais",
    icon: BriefcaseIcon,
  },
  {
    label: "Serviços",
    href: "/app/servicos",
    icon: PackageIcon,
  },
  {
    label: "Clientes",
    href: "/app/clientes",
    icon: Users2,
  },
  {
    label: "Templates",
    href: "/app/templates",
    icon: MessageSquareDashed,
  },
];

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { status, data } = useSession();

  useEffect(() => {
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data?.user));
    }
  }, [data?.user]);

  if (status === "unauthenticated") {
    return children;
  }

  if (status === "loading") {
    return "loading...";
  }

  return (
    <>
      <Meta />

      <div className="h-full min-h-screen">
        <Sidebar.Root>
          <Sidebar.Logo />

          <Sidebar.Nav>
            {menu.map(({ href, label, icon: Icon }) => (
              <Sidebar.MenuItem href={href} key={label}>
                <Icon size={16} /> {label}
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Nav>

          <div className="mt-auto">
            <a
              href="#"
              className="flex h-8 items-center gap-2 rounded-md px-4 text-sm text-slate-900 transition-colors hover:bg-slate-100/60 data-[active=true]:bg-slate-100/60"
            >
              <MessageCircle size={16} /> Suporte
            </a>
          </div>
        </Sidebar.Root>

        <div className="relative z-0 mx-auto h-full min-h-screen bg-zinc-50 px-8 pb-8 pt-24 lg:ml-64">
          <Header.Root>
            <SearchCommand />

            <Header.Menu>
              <CompanySwitcher />

              <Feedback />

              <UserDropdown />
            </Header.Menu>
          </Header.Root>

          {children}
        </div>

        <Toaster />
      </div>
    </>
  );
}
