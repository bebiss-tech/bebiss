import Meta from "@/components/layouts/meta";
import { useSession } from "next-auth/react";

export default function Welcome() {
  const { data: session } = useSession();
  return (
    <>
      <Meta title="Bem vindo" />

      <div className="flex min-h-screen items-center justify-center bg-grid-slate-50">
        <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-800">
          Bem vindo{" "}
          <span className="text-emerald-500">{session?.user.name}!</span>
        </h1>
      </div>
    </>
  );
}
