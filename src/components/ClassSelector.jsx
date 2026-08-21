import React from 'react';
import { CLASS_LEVELS } from '../data/chapters';
import { GraduationCap, Atom, Sparkles } from 'lucide-react';

export default function ClassSelector({ onSelectClass }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: 'var(--bg-main)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      textAlign: 'center'
    }}>
      {/* Intro Icon */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '24px',
        background: 'var(--accent-primary-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        marginBottom: '20px',
        boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
        animation: 'bounce 2s infinite'
      }}>
        <Atom size={40} className="spin-slow" />
      </div>

      <h1 style={{
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '8px',
        background: 'linear-gradient(to right, var(--accent-primary), #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        विज्ञान र प्रविधि क्विज मास्टर
      </h1>
      
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        maxWidth: '480px',
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        तपाईंको अध्ययन स्तर अनुसार कक्षा चयन गर्नुहोस् र विषयगत बहुवैकल्पिक प्रश्नहरूको अभ्यास सुरु गर्नुहोस्।
      </p>

      {/* Class Level Selector Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        width: '100%',
        maxWidth: '900px'
      }}>
        {CLASS_LEVELS.map((cls) => {
          return (
            <button
              key={cls.level}
              onClick={() => onSelectClass(cls.level)}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Class Gradient Tag Icon */}
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: cls.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.6rem'
              }}>
                {cls.emoji}
              </div>

              {/* Text Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {cls.label}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  marginTop: '4px'
                }}>
                  {cls.desc}
                </p>
              </div>

              {/* Subtle spark layout for design */}
              <div style={{
                position: 'absolute',
                right: '16px',
                bottom: '16px',
                opacity: 0.15,
                color: 'var(--text-muted)'
              }}>
                <GraduationCap size={24} />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: '40px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Sparkles size={14} color="#facc15" />
        कक्षा ८ देखि १२ सम्मका नयाँ पाठ्यक्रममा आधारित प्रश्नहरू
      </div>
    </div>
  );
}
