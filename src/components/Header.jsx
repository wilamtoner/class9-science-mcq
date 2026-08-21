import React from 'react';
import { Atom, Sun, Moon, WifiOff } from 'lucide-react';
import { CLASS_LEVELS } from '../data/chapters';

export default function Header({ theme, onToggleTheme, onOpenAdmin, selectedClass, onChangeClass }) {
  const currentClassObj = CLASS_LEVELS.find(c => c.level === selectedClass) || CLASS_LEVELS[1];

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
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)'
        }}>
          <Atom size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.3px', margin: 0 }}>
            विज्ञान र प्रविधि क्विज
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <WifiOff size={11} color="var(--success-color)" />
            <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>अफलाइन उपलब्ध</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Class Selector Pill */}
        {onChangeClass && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={selectedClass || 9}
              onChange={(e) => onChangeClass(parseInt(e.target.value, 10))}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                padding: '6px 28px 6px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                outline: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '10px'
              }}
            >
              {CLASS_LEVELS.map(c => (
                <option key={c.level} value={c.level} style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

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
