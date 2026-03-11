import { NavItem } from '@/types';

/**
 * Navigation configuration
 * Used by sidebar and Cmd+K bar.
 */
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    access: { role: 'cdrrmo' } // cicto has access to everything
  },
  {
    title: 'SOS Dashboard',
    url: '/cdrrmo-sos',
    icon: 'warning',
    isActive: false,
    access: { role: 'cdrrmo' }
  },
  {
    title: 'Barangay Officials',
    url: '/barangay-officials',
    icon: 'user',
    isActive: false,
    access: { role: 'cicto' }
  },
  {
    title: 'CSWD Officials',
    url: '/cswd-officials',
    icon: 'userPen',
    isActive: false,
    access: { role: 'cicto' }
  },
  {
    title: 'CDRRMO Officials',
    url: '/cdrrmo-officials',
    icon: 'employee',
    isActive: false,
    access: { role: 'cicto' }
  },
  {
    title: 'CSWD Inbox',
    url: '/cswd-inbox',
    icon: 'message',
    isActive: false,
    access: { role: 'cswd' }
  }
];
