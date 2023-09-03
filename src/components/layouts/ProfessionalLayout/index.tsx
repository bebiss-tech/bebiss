import { CalendarDays, Home } from "lucide-react";
import { type Metadata } from "next";

import { Header } from "@/components/Header";
import SearchCommand from "@/components/SearchCommand";
import { Sidebar } from "@/components/Sidebar";
import UserDropdown from "@/components/UserDropdown";
import Meta from "@/components/layouts/meta";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "Bebiss",
};

const menu = [
  {
    label: "Dashboard",
    href: "/p",
    icon: Home,
  },
  {
    label: "Agenda",
    href: "/p/agenda",
    icon: CalendarDays,
  },
];

type ProfessionalLayoutProps = {
  children: React.ReactNode;
};

export default function ProfessionalLayout({
  children,
}: ProfessionalLayoutProps) {
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
              <Button variant="outline" type="button">
                <FcGoogle className="mr-2 h-5 w-5" />
                Conectar com Google Calendar
              </Button>

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
