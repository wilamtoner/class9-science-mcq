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
  BookOpen,
  FolderPlus
} from 'lucide-react';
import { CLASS_LEVELS, SUBJECTS } from '../data/chapters';
import { 
  getAllQuestions, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion, 
  importQuestions, 
  resetToDefaultQuestions,
  subscribeQuestions,
  getChapters,
  addChapter,
  updateChapter,
  deleteChapter
} from '../utils/questionsStore';

export default function AdminPanel() {
  const [questions, setQuestions] = useState([]);
  const [adminClass, setAdminClass] = useState(9); // Default class 9 for admin panel view
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add' | 'chapters' | 'import'
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');

  // Form State for Add / Edit Question
  const [editingId, setEditingId] = useState(null); // null if adding new
  const [formData, setFormData] = useState({
    chapterId: '',
    subject: 'Biology',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    hint: '',
    difficulty: 'Medium',
    classLevel: 9
  });

  // Form State for Add / Edit Chapter
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterFormData, setChapterFormData] = useState({
    number: '',
    title: '',
    subject: 'Biology',
    description: '',
    icon: 'BookOpen',
    classLevel: 9
  });

  // UI Feedback messages
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Dynamic chapters list based on selected class
  const classChapters = getChapters(adminClass);

  useEffect(() => {
    setQuestions(getAllQuestions());
    const unsubscribe = subscribeQuestions((updatedQs) => {
      setQuestions(updatedQs);
    });
    return () => unsubscribe();
  }, []);

  // Update default chapterId in form when classChapters changes or is loaded
  useEffect(() => {
    if (classChapters.length > 0 && !formData.chapterId) {
      setFormData(prev => ({
        ...prev,
        chapterId: classChapters[0].id,
        subject: classChapters[0].subject,
        classLevel: adminClass
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        classLevel: adminClass
      }));
    }
    setChapterFormData(prev => ({
      ...prev,
      classLevel: adminClass
    }));
  }, [adminClass, classChapters]);

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
    const chapter = classChapters.find(c => c.id === chId);
    setFormData(prev => ({
      ...prev,
      chapterId: chId,
      subject: chapter ? chapter.subject : prev.subject
    }));
  };

  // Question Form Reset
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      chapterId: classChapters[0]?.id || '',
      subject: classChapters[0]?.subject || 'Biology',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      hint: '',
      difficulty: 'Medium',
      classLevel: adminClass
    });
  };

  // Chapter Form Reset
  const resetChapterForm = () => {
    setEditingChapterId(null);
    setChapterFormData({
      number: '',
      title: '',
      subject: 'Biology',
      description: '',
      icon: 'BookOpen',
      classLevel: adminClass
    });
  };

  // Handle Edit Question Click
  const handleStartEdit = (q) => {
    setEditingId(q.id);
    setFormData({
      chapterId: q.chapterId || '',
      subject: q.subject || 'Biology',
      question: q.question || '',
      options: q.options ? [...q.options] : ['', '', '', ''],
      correctAnswer: q.correctAnswer ?? 0,
      explanation: q.explanation || '',
      hint: q.hint || '',
      difficulty: q.difficulty || 'Medium',
      classLevel: q.classLevel || adminClass
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

  // Handle Edit Chapter Click
  const handleStartEditChapter = (ch) => {
    setEditingChapterId(ch.id);
    setChapterFormData({
      number: ch.number || '',
      title: ch.title || '',
      subject: ch.subject || 'Biology',
      description: ch.description || '',
      icon: ch.icon || 'BookOpen',
      classLevel: ch.classLevel || adminClass
    });
  };

  // Handle Delete Chapter
  const handleDeleteChapter = (id) => {
    if (window.confirm('के तपाईं निश्चित हुनुहुन्छ? यो पाठ हटाउँदा यसमा रहेका प्रश्नहरू सम्बद्ध विहीन हुन सक्छन्।')) {
      deleteChapter(id);
      showToast('पाठ सफलतापूर्वक हटाइयो।');
    }
  };

  // Question Form Submit (Add or Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.chapterId) {
      showError('कृपया पहिले एउटा पाठ (Chapter) सिर्जना गर्नुहोस्!');
      return;
    }

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

  // Chapter Form Submit
  const handleSubmitChapterForm = (e) => {
    e.preventDefault();
    if (!chapterFormData.title.trim()) {
      showError('कृपया पाठको शीर्षक लेख्नुहोस्!');
      return;
    }

    try {
      if (editingChapterId) {
        updateChapter(editingChapterId, chapterFormData);
        showToast('पाठ सफलतापूर्वक अद्यावधिक गरियो!');
      } else {
        addChapter(chapterFormData);
        showToast('नयाँ पाठ सफलतापूर्वक थपियो!');
      }
      resetChapterForm();
    } catch (err) {
      showError('त्रुटि भयो: ' + err.message);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `class_8_12_science_questions_${Date.now()}.json`);
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
    if (window.confirm('के तपाईं सबै थपिएका र संशोधन गरिएका प्रश्न तथा पाठहरू हटाएर रिसेट गर्न चाहनुहुन्छ?')) {
      resetToDefaultQuestions();
      showToast('सुरुवाती प्रश्न तथा पाठहरू रिसेट गरियो।');
    }
  };

  // Filter questions by class and inputs
  const filteredQuestions = questions.filter(q => {
    const matchesClass = (q.classLevel || 9) === adminClass;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.options.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesChapter = selectedChapter === 'all' || q.chapterId === selectedChapter;
    return matchesClass && matchesSearch && matchesSubject && matchesChapter;
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
          fontWeight: '600'
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

      {/* Admin Panel Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
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
              कक्षा ८-१२ सम्मका प्रश्न तथा पाठहरू व्यवस्थापन गर्नुहोस्
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>कक्षा {adminClass} प्रश्नहरू</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
              {questions.filter(q => (q.classLevel || 9) === adminClass).length}
            </div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>कक्षा {adminClass} पाठहरू</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--correct-color)' }}>
              {classChapters.length}
            </div>
          </div>
        </div>
      </div>

      {/* Class Level Selector Tabs */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-secondary)' }}>
          सम्पादन गर्ने कक्षा चयन गर्नुहोस्:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CLASS_LEVELS.map(c => {
            const isSel = adminClass === c.level;
            return (
              <button
                key={c.level}
                onClick={() => {
                  setAdminClass(c.level);
                  setSelectedChapter('all');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: isSel ? 'rgba(99, 102, 241, 0.15)' : 'var(--card-bg)',
                  color: isSel ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'list' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'list' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Layers size={16} />
          सबै प्रश्नहरू ({filteredQuestions.length})
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'add') resetForm();
            setActiveTab('add');
          }}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'add' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'add' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {editingId ? <Edit3 size={16} /> : <Plus size={16} />}
          {editingId ? 'प्रश्न सम्पादन गर्नुहोस्' : 'नयाँ प्रश्न थप्नुहोस्'}
        </button>

        <button
          onClick={() => setActiveTab('chapters')}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'chapters' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'chapters' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BookOpen size={16} />
          पाठहरू व्यवस्थापन ({classChapters.length})
        </button>

        <button
          onClick={() => setActiveTab('import')}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'import' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'import' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Download size={16} />
          डाटा Import/Export
        </button>
      </div>

      {/* --- TAB 1: QUESTIONS LIST --- */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Filters Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="प्रश्न वा उत्तर खोज्नुहोस्..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 34px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">सबै विषयहरू</option>
              {SUBJECTS.filter(s => s.id !== 'all').map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">सबै पाठहरू</option>
              {classChapters.map(ch => (
                <option key={ch.id} value={ch.id}>पाठ {ch.number}: {ch.title}</option>
              ))}
            </select>
          </div>

          {/* List display */}
          {filteredQuestions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}>
              <HelpCircle size={36} style={{ color: 'var(--text-secondary)', marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>कुनै प्रश्न भेटिएन</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                कक्षा {adminClass} मा हाल खोजिए अनुसार प्रश्न थपिएको छैन।
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredQuestions.map((q, index) => {
                const badge = getSubjectBadge(q.subject);
                const chapter = classChapters.find(c => c.id === q.chapterId);

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
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', backgroundColor: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>

                        {chapter && (
                          <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                            पाठ {chapter.number}: {chapter.title}
                          </span>
                        )}

                        {q.isCustom && (
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
                            कस्टम
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleStartEdit(q)}
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
                          }}
                        >
                          <Edit3 size={12} />
                          सम्पादन
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
                          }}
                        >
                          <Trash2 size={12} />
                          हटाउनुहोस्
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {index + 1}. {q.question}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctAnswer;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: isCorrect ? '1px solid var(--correct-color)' : '1px solid var(--border-color)',
                              backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                              color: isCorrect ? 'var(--correct-color)' : 'var(--text-secondary)',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{
                              width: '18px', height: '18px', borderRadius: '50%', backgroundColor: isCorrect ? 'var(--correct-color)' : 'var(--border-color)', color: isCorrect ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyBox: 'center', fontSize: '0.65rem', fontWeight: '700', justifyContent: 'center'
                            }}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: ADD / EDIT QUESTION FORM --- */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmitForm} style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
            {editingId ? 'प्रश्न सम्पादन (Class ' + formData.classLevel + ')' : 'नयाँ प्रश्न थप्नुहोस् (Class ' + adminClass + ')'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                पाठ (Chapter) *
              </label>
              {classChapters.length === 0 ? (
                <div style={{ color: 'var(--incorrect-color)', fontSize: '0.8rem', fontWeight: '600' }}>
                  ⚠️ पहिले "पाठहरू व्यवस्थापन" ट्याबमा गएर पाठ सिर्जना गर्नुहोस्!
                </div>
              ) : (
                <select
                  value={formData.chapterId}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
                >
                  {classChapters.map(ch => (
                    <option key={ch.id} value={ch.id}>पाठ {ch.number}: {ch.title} ({ch.subject})</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                विषय (Subject) *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
              >
                <option value="Biology">जीव विज्ञान (Biology)</option>
                <option value="Physics">भौतिक विज्ञान (Physics)</option>
                <option value="Chemistry">रसायन विज्ञान (Chemistry)</option>
                <option value="EarthSpace">पृथ्वी र अन्तरिक्ष (EarthSpace)</option>
                <option value="ICT">सूचना प्रविधि (ICT)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
              प्रश्नको पाठ (Question Text) *
            </label>
            <textarea
              rows={2}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="प्रश्न यहाँ लेख्नुहोस्..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              चारवटा विकल्पहरू र सही उत्तर चयन गर्नुहोस् *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.options.map((opt, idx) => {
                const isCorrect = formData.correctAnswer === idx;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', border: isCorrect ? '2px solid var(--correct-color)' : '1px solid var(--border-color)' }}>
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={isCorrect}
                      onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                      style={{ cursor: 'pointer', accentColor: 'var(--correct-color)' }}
                    />
                    <span style={{ fontWeight: '800', width: '20px', color: isCorrect ? 'var(--correct-color)' : 'var(--text-secondary)' }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[idx] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`विकल्प ${String.fromCharCode(65 + idx)}...`}
                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>व्याख्या (Explanation)</label>
              <textarea
                rows={2}
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="सही हुनुको कारण..."
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>संकेत (Hint)</label>
              <textarea
                rows={2}
                value={formData.hint}
                onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                placeholder="सानो हिन्ट..."
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
              <CheckCircle2 size={16} /> सेभ गर्नुहोस्
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary" style={{ padding: '12px 18px' }}>
              रद्द
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 3: CHAPTERS MANAGEMENT --- */}
      {activeTab === 'chapters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Chapter Form */}
          <form onSubmit={handleSubmitChapterForm} style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderPlus size={18} color="var(--accent-primary)" />
              {editingChapterId ? 'पाठ सम्पादन गर्नुहोस्' : 'कक्षा ' + adminClass + ' मा पाठ थप्नुहोस्'}
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>एकाइ नम्बर (Unit Number) *</label>
              <input
                type="number"
                value={chapterFormData.number}
                onChange={(e) => setChapterFormData({ ...chapterFormData, number: e.target.value })}
                placeholder="उदाहरण: 1"
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>पाठको शीर्षक (Title) *</label>
              <input
                type="text"
                value={chapterFormData.title}
                onChange={(e) => setChapterFormData({ ...chapterFormData, title: e.target.value })}
                placeholder="शीर्षक यहाँ लेख्नुहोस्..."
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>विषय (Subject) *</label>
              <select
                value={chapterFormData.subject}
                onChange={(e) => setChapterFormData({ ...chapterFormData, subject: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
              >
                <option value="Biology">जीव विज्ञान (Biology)</option>
                <option value="Physics">भौतिक विज्ञान (Physics)</option>
                <option value="Chemistry">रसायन विज्ञान (Chemistry)</option>
                <option value="EarthSpace">पृथ्वी र अन्तरिक्ष (EarthSpace)</option>
                <option value="ICT">सूचना प्रविधि (ICT)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>संक्षिप्त विवरण (Description)</label>
              <textarea
                rows={2}
                value={chapterFormData.description}
                onChange={(e) => setChapterFormData({ ...chapterFormData, description: e.target.value })}
                placeholder="यस पाठ अन्तर्गत समेटिएका मुख्य बुँदाहरू..."
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                सेभ गर्नुहोस्
              </button>
              {editingChapterId && (
                <button type="button" onClick={resetChapterForm} className="btn-secondary" style={{ padding: '10px 14px' }}>
                  रद्द
                </button>
              )}
            </div>
          </form>

          {/* Chapters List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>कक्षा {adminClass} मा उपलब्ध पाठहरू</h3>
            {classChapters.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                कुनै पाठ उपलब्ध छैन। नयाँ पाठ सिर्जना गर्नुहोस्।
              </div>
            ) : (
              classChapters.map(ch => {
                const badge = getSubjectBadge(ch.subject);
                return (
                  <div key={ch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>एकाइ {ch.number}:</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{ch.title}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', backgroundColor: badge.bg, color: badge.color, display: 'inline-block', marginTop: '4px' }}>
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleStartEditChapter(ch)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(ch.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--incorrect-color)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: IMPORT / EXPORT DATA --- */}
      {activeTab === 'import' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>प्रश्न ब्याकअप (Export JSON)</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>सबै थपिएका र मूल प्रश्नहरू JSON मा डाउनलोड गर्नुहोस्।</p>
            </div>
            <button onClick={handleExportJSON} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              <Download size={14} /> JSON फाइल डाउनलोड
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>प्रश्नहरू थप्नुहोस् (Import JSON)</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>फाइलबाट नयाँ प्रश्नहरू एकैपटक थप्नुहोस्।</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} id="import-file" />
            <label htmlFor="import-file" className="btn-secondary" style={{ display: 'inline-block', textAlign: 'center', padding: '8px 14px', cursor: 'pointer', fontSize: '0.8rem' }}>
              <Upload size={14} /> फाइल चयन गर्नुहोस्
            </label>
          </div>

          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#f87171' }}>डाटा रिसेट गर्नुहोस्</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>सबै कस्टम थपिएका प्रश्न र पाठहरू मेटिनेछन्।</p>
            </div>
            <button onClick={handleResetDefaults} className="btn-secondary" style={{ borderColor: '#f87171', color: '#f87171', padding: '8px 14px', fontSize: '0.8rem' }}>
              <RotateCcw size={14} /> सुरुवाती रिसेट
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
