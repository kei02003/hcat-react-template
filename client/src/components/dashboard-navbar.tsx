import React from 'react';
import { HealthCatalystNavbar } from './health-catalyst-navbar';
import { HealthCatalystIcon } from './health-catalyst-icon';

interface DashboardNavbarProps {
  activeMainTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardNavbar({ activeMainTab, onTabChange }: DashboardNavbarProps) {
  const navigationLinks = [
    { key: 'Summary', label: 'Summary', href: '#summary' },
    { key: 'AR Management', label: 'AR Management', href: '#ar-management' },
    { key: 'Denials', label: 'Denials', href: '#denials' },
    { key: 'Collections', label: 'Collections', href: '#collections' },
    { key: 'Feasibility', label: 'Predictive', href: '#feasibility' },
    { key: 'Pre-Authorization', label: 'Pre-Auth', href: '#pre-authorization' }
  ];

  const linkContent = navigationLinks.map(nav => (
    <a 
      key={nav.key}
      className={`navbar-link ${activeMainTab === nav.key ? 'force-active' : ''}`}
      href={nav.href}
      title={nav.key}
      onClick={(e) => {
        e.preventDefault();
        onTabChange(nav.key);
      }}
    >
      {nav.label}
    </a>
  ));

  return (
    <HealthCatalystNavbar
      appIcon="https://cashmere.healthcatalyst.net/assets/CashmereAppLogo.svg"
      brandIcon="https://cashmere.healthcatalyst.net/assets/TriFlame.svg"
      homeUri="/"
      linkContent={linkContent}
      rightContent={[
        <HealthCatalystIcon key="help" icon="fa-question-circle-o" size="small" sx={{ cursor: 'pointer' }} />,
        <span key="separator" className="hc-navbar-vertical-separator"/>,
        <div key="user" className="hc-navbar-username">
          <span>
            <span>Healthcare User</span>
            <br />
            <span className="hc-navbar-username-subtext">Revenue Cycle Dashboard</span>
          </span> 
          <HealthCatalystIcon icon="fa-angle-down" size="small" />
        </div>
      ]}
    />
  );
}