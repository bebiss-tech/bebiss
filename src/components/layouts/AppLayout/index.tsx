import { Header } from "@/components/Header";

import Feedback from "@/components/Feedback";
import SearchCommand from "@/components/SearchCommand";
import { Sidebar } from "@/components/Sidebar";
import UserDropdown from "@/components/UserDropdown";
import CompanySwitcher from "@/components/company-switcher";
import { Toaster } from "@/components/ui/toaster";
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
import { Inter } from "next/font/google";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bebiss",
};

const menu = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
  },
  {
    label: "Empresas",
    href: "/empresas",
    icon: Store,
  },
  {
    label: "Profissionais",
    href: "/profissionais",
    icon: BriefcaseIcon,
  },
  {
    label: "Serviços",
    href: "/servicos",
    icon: PackageIcon,
  },
  {
    label: "Clientes",
    href: "/Clientes",
    icon: Users2,
  },
  {
    label: "Templates",
    href: "/templates",
    icon: MessageSquareDashed,
  },
];

type AppLayoutProps = {
  children: React.ReactNode;
  title?: string;
  logged?: boolean;
};

export default function AppLayout({
  children,
  title = "Bebiss",
  logged = true,
}: AppLayoutProps) {
  if (!logged) {
    return <>{children}</>;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className={`${inter.className} h-full`}>
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

        <div className="relative z-0 mx-auto h-full bg-zinc-50 px-8 pb-8 pt-24 lg:ml-64">
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
