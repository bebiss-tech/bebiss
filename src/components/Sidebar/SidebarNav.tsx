export type SidebarNavProps = {
  children: React.ReactNode;
};

const SidebarNav = ({ children }: SidebarNavProps) => (
  <nav>
    <ul className="flex flex-col gap-2">{children}</ul>
  </nav>
);

export default SidebarNav;
