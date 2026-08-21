import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle, XCircle, RotateCcw, Home, Clock, Sparkles, BookOpen } from 'lucide-react';

export default function ResultView({ resultData, onRetry, onHome, onNavigate }) {
  const { percentage, score, totalQuestions, timeSpentSeconds, subjectBreakdown, questions, selectedAnswers, mode, chapterTitle } = resultData;

  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [percentage]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} मिनेट ${s} सेकेन्ड`;
  };

  let gradeBadge = { label: 'अभ्यास जारी राख्नुहोस्!', color: 'var(--warning-color)', bg: 'var(--warning-bg)' };
  if (percentage >= 85) gradeBadge = { label: 'उत्कृष्ट प्रतिभा!', color: 'var(--biology-color)', bg: 'var(--biology-bg)' };
  else if (percentage >= 70) gradeBadge = { label: 'उत्कृष्ट कार्य!', color: 'var(--physics-color)', bg: 'var(--physics-bg)' };
  else if (percentage >= 50) gradeBadge = { label: 'राम्रो प्रयास!', color: 'var(--warning-color)', bg: 'var(--warning-bg)' };

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
      
      {/* Top Score Banner */}
      <div className="card" style={{
        textAlign: 'center',
        padding: '28px 20px',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-card-hover) 100%)',
        border: '1px solid var(--border-active)'
      }}>
        <span style={{
          padding: '6px 14px',
          borderRadius: '20px',
          backgroundColor: gradeBadge.bg,
          color: gradeBadge.color,
          fontSize: '0.82rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {gradeBadge.label}
        </span>

        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '14px 0 4px', background: 'var(--accent-primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {percentage}%
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          तपाईंले {totalQuestions} मध्ये {score} सही उत्तर मिलाउनुभयो
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={15} /> समय: {formatTime(timeSpentSeconds)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={15} /> {chapterTitle}
          </div>
        </div>
      </div>

      {/* Subject Breakdown Card */}
      {subjectBreakdown && Object.keys(subjectBreakdown).length > 0 && (
        <div className="card" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px' }}>विषयगत प्रदर्शन (Subject Performance)</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(subjectBreakdown).map(([subj, data]) => {
              if (data.total === 0) return null;
              const subjAcc = Math.round((data.correct / data.total) * 100);
              const colorVar = `var(--${getSubjectColorClass(subj)}-color)`;
              return (
                <div key={subj}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: colorVar }}>{getSubjectLabel(subj)}</span>
                    <span>{data.correct}/{data.total} ({subjAcc}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${subjAcc}%`, height: '100%', backgroundColor: colorVar }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>विस्तृत उत्तर कुञ्जी (Detailed Answer Key)</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswer;

            return (
              <div key={q.id} className="card" style={{ padding: '14px', borderLeft: `4px solid ${isCorrect ? 'var(--success-color)' : 'var(--danger-color)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    प्रश्न {idx + 1} • {getSubjectLabel(q.subject)}
                  </span>
                  {isCorrect ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-color)', fontSize: '0.78rem', fontWeight: '700' }}>
                      <CheckCircle size={14} /> सही
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger-color)', fontSize: '0.78rem', fontWeight: '700' }}>
                      <XCircle size={14} /> गलत
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px' }}>
                  {q.question}
                </div>

                <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: isCorrect ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: '600' }}>
                    तपाईंको उत्तर: {userChoice !== undefined ? q.options[userChoice] : 'उत्तर नदिइएको'}
                  </div>
                  {!isCorrect && (
                    <div style={{ color: 'var(--success-color)', fontWeight: '600' }}>
                      सही उत्तर: {q.options[q.correctAnswer]}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <strong>स्पष्टीकरण:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button className="btn-secondary" onClick={onRetry} style={{ flex: 1 }}>
          <RotateCcw size={16} /> पुनः प्रयास गर्नुहोस्
        </button>

        <button className="btn-primary" onClick={onHome} style={{ flex: 1 }}>
          <Home size={16} /> गृहपृष्ठ
        </button>
      </div>

    </div>
  );
}
