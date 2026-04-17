export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  items?: NavItem[];
}

export interface MobileMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export interface UserDropdownProps {
  name: string;
  avatarUrl?: string;
}
