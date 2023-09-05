import { Toaster } from "@/components/ui/toaster";
import CompanyProvider from "@/contexts/Company";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${inter.className} min-h-screen`}>
      <SessionProvider session={session}>
        <CompanyProvider>
          <Component {...pageProps} />
          <Toaster />
        </CompanyProvider>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
