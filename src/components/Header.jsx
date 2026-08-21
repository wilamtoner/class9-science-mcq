import React from 'react';
import { Atom, Sun, Moon, WifiOff } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onOpenAdmin }) {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--accent-primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)'
        }}>
          <Atom size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.3px', margin: 0 }}>
            कक्षा ९ विज्ञान र प्रविधि
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <WifiOff size={11} color="var(--success-color)" />
            <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>अफलाइन उपलब्ध</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
            aria-label="Open Admin Panel"
          >
            प्रशासन (Admin)
          </button>
        )}
        <button
          onClick={onToggleTheme}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card-hover)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}
