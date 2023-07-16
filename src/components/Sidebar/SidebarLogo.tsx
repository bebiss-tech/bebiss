import { MessagesSquare } from "lucide-react";
import Link from "next/link";

const SidebarLogo = () => (
  <Link href="/" className="mb-4 flex pl-4 pb-4">
    <h1 className="flex items-center gap-3 text-xl tracking-tight transition-colors">
      Bebiss <MessagesSquare size={18} />
    </h1>
  </Link>
);

export default SidebarLogo;
