import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Play, CheckCircle, Sparkles, Zap, Flame, Dna, Atom, Orbit, Microscope, Wheat, Activity, Globe, Volume2 } from 'lucide-react';
import { CHAPTERS, SUBJECTS } from '../data/chapters';
import { getAllQuestions } from '../utils/questionsStore';

export default function ChapterList({ onStartQuiz }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const questions = useMemo(() => getAllQuestions(), []);

  const getChapterQuestionCount = (chapterId) => {
    return questions.filter(q => q.chapterId === chapterId).length;
  };

  const filteredChapters = CHAPTERS.filter((ch) => {
    const matchesSubject = selectedSubject === 'all' || ch.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getSubjectLabel = (subj) => {
    switch (subj) {
      case 'Physics': return 'भौतिक';
      case 'Chemistry': return 'रसायन';
      case 'Biology': return 'जीव';
      case 'EarthSpace': return 'पृथ्वी/अन्तरिक्ष';
      case 'ICT': return 'सूचना प्रविधि';
      default: return subj;
    }
  };

  const getSubjectColorClass = (subj) => {
    return subj.toLowerCase();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header & Search */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>
          कक्षा ९ का पाठहरू
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          अभ्यास सुरु गर्न तलको सूचीबाट कुनै एक पाठ चयन गर्नुहोस्।
        </p>

        {/* Search input */}
        <div style={{
          position: 'relative',
          marginTop: '12px'
        }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="पाठ वा विषयको नाम खोज्नुहोस्..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {SUBJECTS.map((sub) => {
          const isActive = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid ' + (isActive ? 'var(--accent-primary)' : 'var(--border-color)'),
                boxShadow: isActive ? '0 4px 10px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              {sub.name}
            </button>
          );
        })}
      </div>

      {/* Chapters Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredChapters.map((ch) => (
          <div key={ch.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge badge-${getSubjectColorClass(ch.subject)}`}>
                एकाइ {ch.number} • {getSubjectLabel(ch.subject)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {getChapterQuestionCount(ch.id)} प्रश्नहरू
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{ch.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                {ch.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                className="btn-primary"
                onClick={() => onStartQuiz({ mode: 'practice', chapterId: ch.id })}
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                <Play size={15} fill="#ffffff" /> अभ्यास मोड
              </button>
              
              <button
                className="btn-secondary"
                onClick={() => onStartQuiz({ mode: 'exam', chapterId: ch.id })}
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                समयबद्ध परीक्षा
              </button>
            </div>
          </div>
        ))}

        {filteredChapters.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.95rem' }}>तपाईंको खोजी अनुसार कुनै पाठ फेला परेन।</p>
          </div>
        )}
      </div>

    </div>
  );
}
