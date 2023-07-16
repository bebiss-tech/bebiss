"use client";

import { Button } from "@/components/ui/button";
import { Text } from "lucide-react";

export type HeaderRootProps = {
  children: React.ReactNode;
};

const HeaderRoot = ({ children }: HeaderRootProps) => (
  <header className="fixed top-0 right-0 left-0 z-10 flex items-center gap-4 border-b border-zinc-400/10 bg-white px-8 py-3 lg:left-64">
    <div className="lg:hidden">
      <Button size="icon" variant="link">
        <Text />
      </Button>
    </div>
    {children}
  </header>
);

export default HeaderRoot;
