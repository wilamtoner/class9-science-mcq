import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  FileText, 
  Filter, 
  Check, 
  X, 
  ShieldCheck, 
  HelpCircle,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { CHAPTERS, SUBJECTS } from '../data/chapters';
import { 
  getAllQuestions, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion, 
  importQuestions, 
  resetToDefaultQuestions,
  subscribeQuestions
} from '../utils/questionsStore';

export default function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add' | 'import'
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');

  // Form State for Add / Edit
  const [editingId, setEditingId] = useState(null); // null if adding new
  const [formData, setFormData] = useState({
    chapterId: 'ch1',
    subject: 'Biology',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    hint: '',
    difficulty: 'Medium'
  });

  // UI Feedback messages
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setQuestions(getAllQuestions());
    const unsubscribe = subscribeQuestions((updatedQs) => {
      setQuestions(updatedQs);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Automatically update subject when chapter changes in form
  const handleChapterChange = (chId) => {
    const chapter = CHAPTERS.find(c => c.id === chId);
    setFormData(prev => ({
      ...prev,
      chapterId: chId,
      subject: chapter ? chapter.subject : prev.subject
    }));
  };

  // Form Reset
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      chapterId: 'ch1',
      subject: 'Biology',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      hint: '',
      difficulty: 'Medium'
    });
  };

  // Handle Edit Click
  const handleStartEdit = (q) => {
    setEditingId(q.id);
    setFormData({
      chapterId: q.chapterId || 'ch1',
      subject: q.subject || 'Biology',
      question: q.question || '',
      options: q.options ? [...q.options] : ['', '', '', ''],
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || '',
      hint: q.hint || '',
      difficulty: q.difficulty || 'Medium'
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete Question
  const handleDelete = (id) => {
    if (window.confirm('के तपाईं निश्चित हुनुहुन्छ? यो प्रश्न हटाइनेछ।')) {
      deleteQuestion(id);
      showToast('प्रश्न सफलतापूर्वक हटाइयो।');
    }
  };

  // Form Submit (Add or Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.question.trim()) {
      showError('कृपया प्रश्न लेख्नुहोस्!');
      return;
    }

    const filledOptions = formData.options.map(o => o.trim());
    if (filledOptions.some(o => !o)) {
      showError('कृपया चारै वटा विकल्पहरू (Options) भर्नुहोस्!');
      return;
    }

    try {
      if (editingId) {
        updateQuestion(editingId, formData);
        showToast('प्रश्न अद्यावधिक (Updated) गरियो!');
      } else {
        addQuestion(formData);
        showToast('नयाँ प्रश्न सफलतापूर्वक थपियो!');
      }
      resetForm();
      setActiveTab('list');
    } catch (err) {
      showError('त्रुटि भयो: ' + err.message);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `class9_science_questions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('प्रश्नहरूको JSON फाइल डाउनलोड गरियो!');
  };

  // Import JSON File
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const count = importQuestions(json);
        showToast(`${count} वटा नयाँ प्रश्न सफलतापूर्वक Import गरियो!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        showError('JSON फाइल अपलोडमा त्रुटि भयो: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Reset all questions to default
  const handleResetDefaults = () => {
    if (window.confirm('के तपाईं सबै थपिएका र संशोधन गरिएका प्रश्नहरू हटाएर सुरुवाती प्रश्नहरू (Default Questions) रिसेट गर्न चाहनुहुन्छ?')) {
      resetToDefaultQuestions();
      showToast('सुरुवाती प्रश्नहरू रिसेट गरियो।');
    }
  };

  // Filtering questions list
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.options.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesChapter = selectedChapter === 'all' || q.chapterId === selectedChapter;
    return matchesSearch && matchesSubject && matchesChapter;
  });

  const getSubjectBadge = (subj) => {
    switch (subj) {
      case 'Physics': return { label: 'भौतिक', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' };
      case 'Chemistry': return { label: 'रसायन', bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' };
      case 'Biology': return { label: 'जीव', bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' };
      case 'EarthSpace': return { label: 'पृथ्वी/अन्तरिक्ष', bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15' };
      case 'ICT': return { label: 'सूचना प्रविधि', bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' };
      default: return { label: subj, bg: 'var(--card-bg)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: 'var(--accent-primary)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600',
          animation: 'slideIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} />
          {toastMessage}
        </div>
      )}

      {/* Error Message Notification */}
      {errorMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: 'var(--incorrect-color)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600'
        }}>
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              प्रशासन प्यानल (Admin Panel)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              प्रश्न उत्तर थप्नुहोस्, सम्पादन गर्नुहोस् र प्रश्न बैंक व्यवस्थापन गर्नुहोस्
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div style={{
          display: 'flex',
          gap: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>जम्मा प्रश्न</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{questions.length}</div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>कस्टम प्रश्न</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--correct-color)' }}>
              {questions.filter(q => q.isCustom).length}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setActiveTab('list')}
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'list' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'list' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={18} />
          सबै प्रश्नहरू ({questions.length})
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'add') resetForm();
            setActiveTab('add');
          }}
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'add' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'add' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
          {editingId ? 'प्रश्न सम्पादन गर्नुहोस्' : 'नयाँ प्रश्न थप्नुहोस्'}
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'import' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'import' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Download size={18} />
          डाटा Import/Export
        </button>
      </div>

      {/* TAB 1: QUESTIONS LIST */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search & Filter Tools */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {/* Search Input */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="प्रश्न वा उत्तर खोज्नुहोस्..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">सबै विषयहरू</option>
              {SUBJECTS.filter(s => s.id !== 'all').map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Chapter Filter */}
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">सबै पाठहरू (Chapters)</option>
              {CHAPTERS.map(ch => (
                <option key={ch.id} value={ch.id}>पाठ {ch.number}: {ch.title}</option>
              ))}
            </select>
          </div>

          {/* Question List View */}
          {filteredQuestions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}>
              <HelpCircle size={40} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>कुनै प्रश्न भेटिएन</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                तपाईंको खोजी अनुसार प्रश्न उपलब्ध छैन।
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredQuestions.map((q, index) => {
                const badge = getSubjectBadge(q.subject);
                const chapter = CHAPTERS.find(c => c.id === q.chapterId);

                return (
                  <div
                    key={q.id}
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Header Tags & Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}>
                          {badge.label}
                        </span>

                        {chapter && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: 'var(--text-secondary)'
                          }}>
                            पाठ {chapter.number}: {chapter.title}
                          </span>
                        )}

                        {q.isCustom && (
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80'
                          }}>
                            कस्टम
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStartEdit(q)}
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit3 size={14} />
                          सम्पादन
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          हटाउनुहोस्
                        </button>
                      </div>
                    </div>

                    {/* Question Title */}
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                      {index + 1}. {q.question}
                    </div>

                    {/* Options Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '8px'
                    }}>
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctAnswer;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: isCorrect ? '1px solid var(--correct-color)' : '1px solid var(--border-color)',
                              backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0, 0, 0, 0.15)',
                              color: isCorrect ? 'var(--correct-color)' : 'var(--text-secondary)',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontWeight: isCorrect ? '700' : '500'
                            }}
                          >
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: isCorrect ? 'var(--correct-color)' : 'var(--border-color)',
                              color: isCorrect ? '#fff' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: '700'
                            }}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            {isCorrect && <Check size={16} color="var(--correct-color)" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation & Hint details */}
                    {(q.explanation || q.hint) && (
                      <div style={{
                        marginTop: '4px',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.3)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {q.explanation && (
                          <div><strong style={{ color: 'var(--accent-primary)' }}>व्याख्या:</strong> {q.explanation}</div>
                        )}
                        {q.hint && (
                          <div><strong style={{ color: '#facc15' }}>संकेत (Hint):</strong> {q.hint}</div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: ADD / EDIT QUESTION FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmitForm} style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>
              {editingId ? 'प्रश्न सम्पादन (Edit Question)' : 'नयाँ प्रश्न फारम (Add New Question)'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                रद्द गरी नयाँ थप्नुहोस्
              </button>
            )}
          </div>

          {/* Chapter & Subject Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            {/* Chapter Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                पाठ छनोट (Chapter) *
              </label>
              <select
                value={formData.chapterId}
                onChange={(e) => handleChapterChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              >
                {CHAPTERS.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    पाठ {ch.number}: {ch.title} ({ch.subject})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                विषय (Subject) *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              >
                <option value="Biology">जीव विज्ञान (Biology)</option>
                <option value="Physics">भौतिक विज्ञान (Physics)</option>
                <option value="Chemistry">रसायन विज्ञान (Chemistry)</option>
                <option value="EarthSpace">पृथ्वी र अन्तरिक्ष (EarthSpace)</option>
                <option value="ICT">सूचना प्रविधि (ICT)</option>
              </select>
            </div>

          </div>

          {/* Question Textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
              प्रश्न लेख्नुहोस् (Question Text) *
            </label>
            <textarea
              rows={3}
              placeholder="उदाहरण: भेटेनरी पेसा विज्ञानको कुन शाखासँग सम्बन्धित छ?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                resize: 'vertical'
              }}
            />
          </div>

          {/* 4 Options Fields with Radio Button for Correct Answer */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
              विकल्पहरू (Options) & सही उत्तर चयन गर्नुहोस् *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.options.map((opt, idx) => {
                const isSelectedCorrect = formData.correctAnswer === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: isSelectedCorrect ? '2px solid var(--correct-color)' : '1px solid var(--border-color)',
                      backgroundColor: isSelectedCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      id={`correct_${idx}`}
                      checked={isSelectedCorrect}
                      onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--correct-color)' }}
                    />
                    <label
                      htmlFor={`correct_${idx}`}
                      style={{
                        fontWeight: '800',
                        color: isSelectedCorrect ? 'var(--correct-color)' : 'var(--text-secondary)',
                        width: '24px',
                        cursor: 'pointer'
                      }}
                    >
                      {String.fromCharCode(65 + idx)}.
                    </label>
                    <input
                      type="text"
                      placeholder={`विकल्प ${String.fromCharCode(65 + idx)} लेख्नुहोस्...`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[idx] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    />
                    {isSelectedCorrect && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--correct-color)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        ✓ सही उत्तर
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation & Hint */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                व्याख्या (Explanation)
              </label>
              <textarea
                rows={2}
                placeholder="सही उत्तरको संक्षिप्त कारण/व्याख्या..."
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                संकेत (Hint)
              </label>
              <textarea
                rows={2}
                placeholder="विद्यार्थीलाई सहयोग पुग्ने संकेत..."
                value={formData.hint}
                onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
              कठिनाई स्तर (Difficulty)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Easy', 'Medium', 'Hard'].map(level => {
                const isSel = formData.difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: isSel ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: isSel ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {level === 'Easy' ? 'सजिलो (Easy)' : level === 'Medium' ? 'मध्यम (Medium)' : 'गाह्रो (Hard)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              <CheckCircle2 size={20} />
              {editingId ? 'अद्यावधिक सुरक्षित गर्नुहोस्' : 'प्रश्न सेभ गर्नुहोस्'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              रद्द
            </button>
          </div>

        </form>
      )}

      {/* TAB 3: DATA IMPORT / EXPORT */}
      {activeTab === 'import' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Export Section */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px' }}>
                प्रश्न ब्याकअप (Export JSON)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                सबै हालका प्रश्नहरू JSON फाइलका रूपमा ब्याकअप वा शेयर गर्नका लागि डाउनलोड गर्नुहोस्।
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={18} />
              JSON फाइल डाउनलोड गर्नुहोस्
            </button>
          </div>

          {/* Import Section */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '4px' }}>
                प्रश्नहरू Import गर्नुहोस् (JSON File)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                पहिले तयार पारिएको वा अन्य स्थानबाट प्राप्त JSON फाइल अपलोड गरी नयाँ प्रश्नहरू एकैपटक थप्नुहोस्।
              </p>
            </div>

            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <Upload size={36} color="var(--accent-primary)" />
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                JSON फाइल चयन गर्नुहोस्
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: 'none' }}
                id="json-file-input"
              />
              <label
                htmlFor="json-file-input"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-primary)',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                फाइल रोज्नुहोस्
              </label>
            </div>
          </div>

          {/* Reset to Default Section */}
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#f87171', marginBottom: '4px' }}>
                सुरुवाती स्थितिमा रिसेट (Reset to Defaults)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                सबै नयाँ थपिएका र सम्पादन गरिएका प्रश्नहरू हटाइनेछन् र सुरुवाती पाठ्यपुस्तक प्रश्नहरू मात्र रहनेछन्।
              </p>
            </div>
            <button
              onClick={handleResetDefaults}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid #f87171',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} />
              सुरुवाती रिसेट
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
