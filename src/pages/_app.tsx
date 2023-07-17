import AppLayout from "@/components/layouts/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppLayout logged={!!session}>
        <Component {...pageProps} />
        <Toaster />
      </AppLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
