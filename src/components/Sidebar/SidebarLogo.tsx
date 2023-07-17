import { cn } from "@/utils/cn";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";

type SidebarLogoProps = {
  className?: string;
};

const SidebarLogo = ({ className }: SidebarLogoProps) => (
  <Link href="/" className={cn(`mb-4 flex pb-4 pl-4`, className)}>
    <h1 className="flex items-center gap-3 text-xl tracking-tight transition-colors">
      Bebiss <MessagesSquare size={18} />
    </h1>
  </Link>
);

export default SidebarLogo;
