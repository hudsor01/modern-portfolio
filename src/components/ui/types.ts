// Navigation types moved from types/navigation.ts
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface MainNavItem extends NavItem {
  description?: string;
  sections?: NavSection[];
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

export type FooterItem = NavItem

export interface FooterSection {
  title: string;
  items: FooterItem[];
}

export interface BaseProps {
  className?: string;
}
