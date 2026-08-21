import React, { useState } from 'react';
import { BarChart3, Award, Clock, Trash2, CheckCircle, RefreshCw, Zap, Flame, Sparkles, Orbit, Cpu } from 'lucide-react';
import { getAggregateStats, getQuizHistory, clearAllData } from '../utils/storage';

export default function AnalyticsView({ onRefreshStats }) {
  const [stats, setStats] = useState(getAggregateStats());
  const [history, setHistory] = useState(getQuizHistory());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const overallAccuracy = stats.totalAttempted > 0 
    ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) 
    : 0;

  const physicsAcc = stats.physicsTotal > 0 ? Math.round((stats.physicsCorrect / stats.physicsTotal) * 100) : 0;
  const chemistryAcc = stats.chemistryTotal > 0 ? Math.round((stats.chemistryCorrect / stats.chemistryTotal) * 100) : 0;
  const biologyAcc = stats.biologyTotal > 0 ? Math.round((stats.biologyCorrect / stats.biologyTotal) * 100) : 0;
  const earthspaceAcc = stats.earthspaceTotal > 0 ? Math.round((stats.earthspaceCorrect / stats.earthspaceTotal) * 100) : 0;
  const ictAcc = stats.ictTotal > 0 ? Math.round((stats.ictCorrect / stats.ictTotal) * 100) : 0;

  const handleReset = () => {
    clearAllData();
    setStats(getAggregateStats());
    setHistory([]);
    setShowConfirmReset(false);
    if (onRefreshStats) onRefreshStats();
  };

  const getSubjectLabel = (subj) => {
    switch (subj) {
      case 'Physics': return 'भौतिक विज्ञान';
      case 'Chemistry': return 'रसायन विज्ञान';
      case 'Biology': return 'जीव विज्ञान';
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
      
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>
          कार्यसम्पादन विश्लेषण (Analytics)
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          आफ्नो सिकाइको प्रगति र विषयगत शुद्धता ट्र्याक गर्नुहोस्।
        </p>
      </div>

      {/* Main Stats Card */}
      <div className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>कुल शुद्धता</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '2px' }}>
              {overallAccuracy}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>प्रयास गरिएका प्रश्न</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
              {stats.totalAttempted}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>पूरा गरिएका क्विज</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success-color)', marginTop: '2px' }}>
              {stats.quizzesTaken}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>सही उत्तर संख्या</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--physics-color)', marginTop: '2px' }}>
              {stats.totalCorrect}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Wise Accuracy */}
      <div className="card" style={{ padding: '18px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px' }}>विषयगत दक्षता (Subject Mastery)</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Physics */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--physics-color)' }}>
                <Zap size={16} /> भौतिक विज्ञान
              </span>
              <span>{stats.physicsCorrect}/{stats.physicsTotal} ({physicsAcc}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${physicsAcc}%`, height: '100%', backgroundColor: 'var(--physics-color)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Chemistry */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--chemistry-color)' }}>
                <Flame size={16} /> रसायन विज्ञान
              </span>
              <span>{stats.chemistryCorrect}/{stats.chemistryTotal} ({chemistryAcc}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${chemistryAcc}%`, height: '100%', backgroundColor: 'var(--chemistry-color)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Biology */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--biology-color)' }}>
                <Sparkles size={16} /> जीव विज्ञान
              </span>
              <span>{stats.biologyCorrect}/{stats.biologyTotal} ({biologyAcc}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${biologyAcc}%`, height: '100%', backgroundColor: 'var(--biology-color)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Earth & Space */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--earthspace-color)' }}>
                <Orbit size={16} /> पृथ्वी र अन्तरिक्ष
              </span>
              <span>{stats.earthspaceCorrect}/{stats.earthspaceTotal} ({earthspaceAcc}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${earthspaceAcc}%`, height: '100%', backgroundColor: 'var(--earthspace-color)', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* ICT */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ict-color)' }}>
                <Cpu size={16} /> सूचना प्रविधि
              </span>
              <span>{stats.ictCorrect}/{stats.ictTotal} ({ictAcc}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${ictAcc}%`, height: '100%', backgroundColor: 'var(--ict-color)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz History Log */}
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>हालैको क्विज इतिहास</h4>

        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h) => (
              <div key={h.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{h.chapterTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {h.date} • {h.mode === 'exam' ? 'परीक्षा मोड' : 'अभ्यास मोड'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '800',
                    color: h.percentage >= 70 ? 'var(--success-color)' : 'var(--warning-color)'
                  }}>
                    {h.score}/{h.totalQuestions} ({h.percentage}%)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ⏱ {Math.round(h.timeSpentSeconds / 60)} मि. {h.timeSpentSeconds % 60} से.
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            कुनै क्विज इतिहास रेकर्ड गरिएको छैन। आजैबाट अभ्यास सुरु गर्नुहोस्!
          </div>
        )}
      </div>

      {/* Reset Data Button */}
      <div style={{ marginTop: '10px' }}>
        {showConfirmReset ? (
          <div className="card" style={{ padding: '16px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-color)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--danger-color)', fontWeight: '700', marginBottom: '10px' }}>
              के तपाईं निश्चित रूपमा सम्पूर्ण तथ्याङ्क र इतिहास मेटाउन चाहनुहुन्छ?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmReset(false)} style={{ flex: 1 }}>रद्द गर्नुहोस्</button>
              <button className="btn-primary" onClick={handleReset} style={{ flex: 1, backgroundColor: 'var(--danger-color)', color: '#fff' }}>हो, मेटाउनुहोस्</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--danger-color)',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={16} /> इतिहास तथा तथ्याङ्क मेटाउनुहोस्
          </button>
        )}
      </div>

    </div>
  );
}
