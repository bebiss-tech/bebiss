import { CreditCard, Home, MessageSquare, Store, Users2 } from "lucide-react";
import { type Metadata } from "next";

import { Header } from "@/components/Header";
import SearchCommand from "@/components/SearchCommand";
import { Sidebar } from "@/components/Sidebar";
import UserDropdown from "@/components/UserDropdown";
import Meta from "@/components/layouts/meta";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Bebiss",
};

const menu = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    label: "Empresas",
    href: "/admin/empresas",
    icon: Store,
  },
  {
    label: "Clientes",
    href: "/admin/clientes",
    icon: Users2,
  },
  {
    label: "Feedbacks",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
  {
    label: "Planos",
    href: "/admin/planos",
    icon: CreditCard,
  },
];

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
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
        </Sidebar.Root>

        <div className="relative z-0 mx-auto h-full min-h-screen bg-zinc-50 px-8 pb-8 pt-24 lg:ml-64">
          <Header.Root>
            <SearchCommand />

            <Header.Menu>
              <UserDropdown />
            </Header.Menu>
          </Header.Root>

          {children}
        </div>
      </div>
    </>
  );
}
