import React from 'react';
import { Home, BookOpen, PlayCircle, Bookmark, BarChart3, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'गृह', icon: Home },
    { id: 'chapters', label: 'पाठहरू', icon: BookOpen },
    { id: 'quiz', label: 'क्विज', icon: PlayCircle },
    { id: 'bookmarks', label: 'बचत', icon: Bookmark },
    { id: 'analytics', label: 'तथ्याङ्क', icon: BarChart3 },
    { id: 'admin', label: 'प्रशासन', icon: ShieldCheck }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="nav-icon" size={22} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
