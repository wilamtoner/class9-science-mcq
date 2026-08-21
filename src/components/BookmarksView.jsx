import React from 'react';
import { Bookmark, Play, Trash2, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { getAllQuestions } from '../utils/questionsStore';

export default function BookmarksView({ bookmarks, onToggleBookmark, onStartQuiz }) {
  const allQuestions = getAllQuestions();
  const savedQuestions = allQuestions.filter(q => bookmarks.includes(q.id));

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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>
            बचत गरिएका प्रश्नहरू
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            बचत गरिएका बहुवैकल्पिक प्रश्नहरू जुनसुकै समयमा अफलाइन पुनरावलोकन गर्नुहोस्।
          </p>
        </div>

        {savedQuestions.length > 0 && (
          <button
            className="btn-primary"
            onClick={() => onStartQuiz({ mode: 'practice', questionIds: bookmarks })}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Play size={14} fill="#ffffff" /> सबै अभ्यास ({savedQuestions.length})
          </button>
        )}
      </div>

      {savedQuestions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {savedQuestions.map((q, idx) => (
            <div key={q.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${getSubjectColorClass(q.subject)}`}>
                  {getSubjectLabel(q.subject)}
                </span>
                
                <button
                  onClick={() => onToggleBookmark(q.id)}
                  style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '600' }}
                >
                  <Trash2 size={14} /> हटाउनुहोस्
                </button>
              </div>

              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', lineHeight: '1.4' }}>
                {q.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: optIdx === q.correctAnswer ? 'var(--success-bg)' : 'var(--bg-main)',
                      border: '1px solid ' + (optIdx === q.correctAnswer ? 'var(--success-color)' : 'var(--border-color)'),
                      color: optIdx === q.correctAnswer ? 'var(--success-color)' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: optIdx === q.correctAnswer ? '700' : '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                    {optIdx === q.correctAnswer && <CheckCircle size={14} color="var(--success-color)" />}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
                <strong>स्पष्टीकरण:</strong> {q.explanation}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Bookmark size={40} color="var(--border-color)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>कुनै प्रश्न बचत गरिएको छैन</h3>
          <p style={{ fontSize: '0.82rem' }}>
            क्विज खेल्दा कठिन लाग्ने प्रश्नहरूलाई अफलाइन पुनरावलोकनका लागि सुरक्षित गर्न बुकमार्क आइकनमा थिच्नुहोस्!
          </p>
        </div>
      )}

    </div>
  );
}
