import React from 'react';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const navItems = [
  { id: 'summary', label: 'Executive Summary' },
  { id: 'portfolio', label: '15-SKU Portfolio' },
  { id: 'silicon', label: 'SoC2 Silicon' },
  { id: 'video', label: 'Master Video' },
  { id: 'slides', label: '104-Slide Walkthrough' },
  { id: 'investment', label: 'Investment Case' },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="institutional-nav">
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', width: '100%', overflowX: 'auto' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={activeTab === item.id ? 'active' : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
