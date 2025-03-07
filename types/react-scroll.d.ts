declare module 'react-scroll' {
  import * as React from 'react';

  interface Link extends React.ComponentClass<LinkProps> {}
  interface LinkProps {
    to: string;
    spy?: boolean;
    smooth?: boolean;
    offset?: number;
    duration?: number;
    delay?: number;
    isDynamic?: boolean;
    onSetActive?: (to: string) => void;
    onSetInactive?: () => void;
    ignoreCancelEvents?: boolean;
    hashSpy?: boolean;
    spyThrottle?: number;
    activeClass?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }

  interface Events {
    scrollEvent: {
      register(events: string, fn: () => void): void;
      remove(events: string): void;
    };
  }

  export const Link: Link;
  export const Element: React.ComponentClass<{ name: string; [key: string]: any }>;
  export const Events: Events;
  export const scrollSpy: {
    update(): void;
  };
  export const scroller: {
    scrollTo(name: string, props?: { smooth?: boolean; duration?: number; delay?: number; offset?: number }): void;
  };
}
