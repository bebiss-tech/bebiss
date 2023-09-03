export type SidebarRootProps = {
  children: React.ReactNode;
};

const SidebarRoot = ({ children }: SidebarRootProps) => (
  <aside className="fixed bottom-0 left-0 top-0 z-10 flex w-0 flex-col overflow-hidden border-r border-slate-400/10 bg-white p-0 transition-all lg:w-64 lg:px-2 lg:py-6">
    {children}
  </aside>
);

export default SidebarRoot;
