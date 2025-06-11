/**
 * Navigation Types
 * Contains all navigation-related interfaces consolidated from across the application
 */

import { ReactNode } from 'react';

/**
 * Base navigation item
 */
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  isExternal?: boolean;
}

/**
 * Navigation section with grouped items
 */
export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Main navigation item with additional properties
 */
export interface MainNavItem extends NavItem {
  description?: string;
  sections?: NavSection[];
}

/**
 * Sidebar navigation item with nested items
 */
export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

/**
 * Footer item type alias
 */
export type FooterItem = NavItem;

/**
 * Footer section with grouped items
 */
export interface FooterSection {
  title: string;
  items: FooterItem[];
}

/**
 * Site navigation configuration
 */
export interface SiteNavigation {
  mainNav: MainNavItem[];
  footerNav: {
    solutions?: FooterItem[];
    support?: FooterItem[];
    company?: FooterItem[];
    legal?: FooterItem[];
    social?: FooterItem[];
  };
}

/**
 * Menu item for dropdown menus
 */
export interface MenuItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

/**
 * Breadcrumb item for breadcrumb navigation
 */
export interface BreadcrumbItem {
  title: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * Mobile navigation props
 */
export interface MobileNavProps {
  items: MainNavItem[];
  children?: ReactNode;
  className?: string;
}

/**
 * Navigation menu props
 */
export interface NavigationMenuProps {
  items: MainNavItem[];
  className?: string;
}