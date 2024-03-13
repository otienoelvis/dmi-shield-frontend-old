import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconImage: 'icon-home-outline--black.png',
    route: '/dashboard',
  },
  {

    navCap: 'Limits',
  },
  {
    displayName: 'Thresholds',
    iconImage: 'icon-cases_group-colored.png',
    route: '/thresholds/composites',
  },
  {
    navCap: 'Surveillance',
  },
  {
    displayName: 'Data',
    iconImage: 'icon-table-black.png',
    route: '/surveillance',
    navCap: 'Analytics',
  },
  {
    navCap: 'Notifications',
  },
  {
    displayName: 'Messages',
    iconImage: 'icon-alert-triangle-filled.png',
    route: '#'
  },
  {
    navCap: 'Settings',
  },
  {
    displayName: 'Configurations',
    iconImage: 'icon-settings-black.png',
    route: '/settings/configurations'
  },
  {
    navCap: 'Profile',
  },
  {
    displayName: 'Profile',
    iconImage: 'icon-user--black.png',
    route: '/users/view'
  },
  {
    displayName: 'Logout',
    iconImage: 'icon-exit--black.png',
    action: 'logout'
  }
];
