import AppLayout from "@/components/layouts/AppLayout";
import { Toaster } from "@/components/ui/toaster";
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
    <main className={inter.className}>
      <SessionProvider session={session}>
        <AppLayout>
          <Component {...pageProps} />
          <Toaster />
        </AppLayout>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
