/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from "@/utils/cn";
import { MessagesSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type SidebarLogoProps = {
  className?: string;
};

const roles = {
  ADMIN_SYSTEM: "ADMIN ACCOUNT",
  ADMIN_COMPANY: "",
  PROFESSIONAL: "Profissional",
  "": "",
};

const SidebarLogo = ({ className }: SidebarLogoProps) => {
  const { data } = useSession();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const role = roles[data?.user.role || ""];

  return (
    <Link href="/" className={cn(`mb-4 flex flex-col pb-4 pl-4`, className)}>
      <h1 className="flex items-center gap-3 text-xl tracking-tight transition-colors">
        Bebiss <MessagesSquare size={18} />
      </h1>
      <span className="text-[10px] text-slate-400">{role}</span>
    </Link>
  );
};

export default SidebarLogo;
