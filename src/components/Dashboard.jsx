import React from 'react';
import { Play, Clock, Sparkles, Zap, Flame, ShieldAlert, Award, ArrowRight, BookOpen, CheckCircle, Orbit, Cpu } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';

export default function Dashboard({ onStartQuiz, onNavigate, stats, bookmarkCount }) {
  const overallAccuracy = stats.totalAttempted > 0 
    ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) 
    : 0;

  const getSubjectLabel = (subj) => {
    switch (subj) {
      case 'Physics': return 'भौतिक';
      case 'Chemistry': return 'रसायन';
      case 'Biology': return 'जीव';
      case 'EarthSpace': return 'पृथ्वी र अन्तरिक्ष';
      case 'ICT': return 'सूचना प्रविधि';
      default: return subj;
    }
  };

  const getSubjectColorClass = (subj) => {
    return subj.toLowerCase();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Welcome Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', opacity: 0.9, marginBottom: '6px' }}>
          <Sparkles size={14} color="#fde047" />
          <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>विज्ञान र प्रविधि - कक्षा ९</span>
        </div>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
          अभ्यासका लागि तयार हुनुहुन्छ?
        </h2>
        
        <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: '1.4', marginBottom: '16px' }}>
          भौतिक, रसायन, जीव विज्ञान, पृथ्वी र अन्तरिक्ष, तथा सूचना प्रविधिका १९ वटै एकाइका प्रश्नहरू अभ्यास गर्नुहोस्। शतप्रतिशत अफलाइन उपलब्ध!
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-primary" 
            onClick={() => onStartQuiz({ mode: 'practice', filterSubject: 'all' })}
            style={{ flex: 1, backgroundColor: '#ffffff', color: '#4f46e5', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <Play size={18} fill="#4f46e5" /> सबै अभ्यास
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={() => onStartQuiz({ mode: 'exam', filterSubject: 'all' })}
            style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Clock size={18} /> समयबद्ध परीक्षा
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.3rem' }}>
            {stats.quizzesTaken || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
            पूरा क्विजहरू
          </div>
        </div>

        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--success-color)', fontWeight: '800', fontSize: '1.3rem' }}>
            {overallAccuracy}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
            औसत शुद्धता
          </div>
        </div>

        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--warning-color)', fontWeight: '800', fontSize: '1.3rem' }}>
            {bookmarkCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
            बचत गरिएका प्रश्न
          </div>
        </div>
      </div>

      {/* Subject Wise Quick Practice */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>विषयगत द्रुत अभ्यास</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Physics */}
          <div 
            className="card card-interactive"
            onClick={() => onStartQuiz({ mode: 'practice', filterSubject: 'Physics' })}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--physics-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--physics-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} color="var(--physics-color)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>भौतिक विज्ञान (Physics)</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>बल, चाल, सरल यन्त्र, ऊर्जा, तरङ्ग र विद्युत...</div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>

          {/* Chemistry */}
          <div 
            className="card card-interactive"
            onClick={() => onStartQuiz({ mode: 'practice', filterSubject: 'Chemistry' })}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--chemistry-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--chemistry-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} color="var(--chemistry-color)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>रसायन विज्ञान (Chemistry)</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>परमाणु, रासायनिक बन्ड, ग्याँसहरू, धातु र अधातु...</div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>

          {/* Biology */}
          <div 
            className="card card-interactive"
            onClick={() => onStartQuiz({ mode: 'practice', filterSubject: 'Biology' })}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--biology-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--biology-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} color="var(--biology-color)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>जीव विज्ञान (Biology)</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>सजीवहरूको वर्गीकरण, च्याउ, क्रम विकास, मानव शरीर...</div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>

          {/* Earth & Space */}
          <div 
            className="card card-interactive"
            onClick={() => onStartQuiz({ mode: 'practice', filterSubject: 'EarthSpace' })}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--earthspace-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--earthspace-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Orbit size={22} color="var(--earthspace-color)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>पृथ्वी र अन्तरिक्ष (Earth & Space)</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>सौर्यमण्डल, ताराहरू, मन्दाकिनी र ब्रह्माण्ड सम्बन्धी...</div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>

          {/* ICT */}
          <div 
            className="card card-interactive"
            onClick={() => onStartQuiz({ mode: 'practice', filterSubject: 'ICT' })}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--ict-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--ict-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={22} color="var(--ict-color)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>सूचना प्रविधि (ICT)</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>कम्प्युटर नेटवर्किङ, साइबर सुरक्षा र प्रविधि...</div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </div>

        </div>
      </div>

      {/* Popular Chapters Shortcut */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>मुख्य पाठहरू</h3>
          <button 
            onClick={() => onNavigate('chapters')}
            style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: '700' }}
          >
            सबै हेर्नुहोस् ({CHAPTERS.length})
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CHAPTERS.slice(0, 3).map((ch) => (
            <div 
              key={ch.id}
              className="card card-interactive"
              onClick={() => onStartQuiz({ mode: 'practice', chapterId: ch.id })}
              style={{ padding: '14px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge badge-${getSubjectColorClass(ch.subject)}`}>
                  एकाइ {ch.number} • {getSubjectLabel(ch.subject)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {ch.questionCount} प्रश्नहरू
                </span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '6px' }}>{ch.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ch.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
