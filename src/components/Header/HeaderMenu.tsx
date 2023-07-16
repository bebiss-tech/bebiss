export type HeaderMenuProps = {
  children: React.ReactNode;
};

const HeaderMenu = ({ children }: HeaderMenuProps) => (
  <nav className="ml-auto flex items-center gap-6">{children}</nav>
);

export default HeaderMenu;
