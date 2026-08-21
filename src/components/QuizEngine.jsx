import React, { useState, useEffect } from 'react';
import { Bookmark, CheckCircle2, XCircle, HelpCircle, ArrowLeft, ArrowRight, Clock, Award, AlertCircle } from 'lucide-react';
import { getAllQuestions } from '../utils/questionsStore';
import { CHAPTERS } from '../data/chapters';

export default function QuizEngine({
  quizConfig, // { mode: 'practice' | 'exam', chapterId?, filterSubject?, questionIds? }
  bookmarks,
  onToggleBookmark,
  onFinishQuiz,
  onExitQuiz
}) {
  // Filter questions based on configuration
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [showExplanation, setShowExplanation] = useState({}); // { [qId]: boolean }
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let pool = getAllQuestions();
    if (quizConfig.chapterId) {
      pool = pool.filter(q => q.chapterId === quizConfig.chapterId);
    } else if (quizConfig.filterSubject && quizConfig.filterSubject !== 'all') {
      pool = pool.filter(q => q.subject === quizConfig.filterSubject);
    } else if (quizConfig.questionIds) {
      pool = pool.filter(q => quizConfig.questionIds.includes(q.id));
    }

    // Shuffle questions for variety
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selectedList = shuffled.slice(0, quizConfig.limit || 15);
    setQuestions(selectedList);

    if (quizConfig.mode === 'exam') {
      setTimeLeft((quizConfig.limit || selectedList.length) * 60); // 1 minute per question
    }
  }, [quizConfig]);

  // Countdown timer for Exam Mode
  useEffect(() => {
    if (quizConfig.mode !== 'exam' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizConfig.mode, timeLeft]);

  if (questions.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h3>यस चयनका लागि कुनै प्रश्नहरू उपलब्ध छैनन्।</h3>
        <button className="btn-primary" onClick={onExitQuiz} style={{ marginTop: '20px' }}>
          फिर्ता जानुहोस्
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isBookmarked = bookmarks.includes(currentQ.id);
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const isPracticeMode = quizConfig.mode === 'practice';

  const handleSelectOption = (optionIdx) => {
    if (isPracticeMode && isAnswered) return; // In practice mode, lock after first choice
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionIdx }));
    if (isPracticeMode) {
      setShowExplanation(prev => ({ ...prev, [currentQ.id]: true }));
    }
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Calculate score & breakdown
    let score = 0;
    const subjectBreakdown = {};

    questions.forEach(q => {
      const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
      if (isCorrect) score += 1;

      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { correct: 0, total: 0 };
      }
      subjectBreakdown[q.subject].total += 1;
      if (isCorrect) subjectBreakdown[q.subject].correct += 1;
    });

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    const chapterObj = CHAPTERS.find(c => c.id === quizConfig.chapterId);

    onFinishQuiz({
      mode: quizConfig.mode,
      chapterTitle: chapterObj ? chapterObj.title : (quizConfig.filterSubject || 'All Subjects'),
      totalQuestions: questions.length,
      score,
      timeSpentSeconds,
      subjectBreakdown,
      questions,
      selectedAnswers
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case 'Easy': return 'सजिलो';
      case 'Medium': return 'मध्यम';
      case 'Hard': return 'कठिन';
      default: return diff;
    }
  };

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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Bar: Progress & Mode Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onExitQuiz} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} /> बाहिरिनुहोस्
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {quizConfig.mode === 'exam' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning-color)',
              padding: '4px 10px',
              borderRadius: '14px',
              fontSize: '0.82rem',
              fontWeight: '700'
            }}>
              <Clock size={14} /> {formatTime(timeLeft)}
            </div>
          )}

          <button
            onClick={() => onToggleBookmark(currentQ.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              backgroundColor: isBookmarked ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
              color: isBookmarked ? 'var(--warning-color)' : 'var(--text-muted)',
              border: '1px solid ' + (isBookmarked ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)'),
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            <Bookmark size={15} fill={isBookmarked ? 'var(--warning-color)' : 'none'} />
            {isBookmarked ? 'बचत गरियो' : 'बचत गर्नुहोस्'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
          <span>प्रश्न {currentIndex + 1} / {questions.length}</span>
          <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% पूरा भयो</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            height: '100%',
            background: 'var(--accent-primary-gradient)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Meta badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`badge badge-${getSubjectColorClass(currentQ.subject)}`}>
            {getSubjectLabel(currentQ.subject)}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            कठिनाइ स्तर: {getDifficultyLabel(currentQ.difficulty)}
          </span>
        </div>

        {/* Question Text */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: '1.4', color: 'var(--text-primary)' }}>
          {currentQ.question}
        </h3>

        {/* Hint button */}
        {isPracticeMode && currentQ.hint && (
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--warning-color)', fontWeight: '600' }}
            >
              <HelpCircle size={15} /> {showHint ? 'सङ्केत लुकाउनुहोस्' : 'सङ्केत आवश्यक छ?'}
            </button>
            {showHint && (
              <div style={{
                marginTop: '8px',
                padding: '10px 14px',
                backgroundColor: 'var(--warning-bg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                borderLeft: '3px solid var(--warning-color)'
              }}>
                💡 <strong>सङ्केत:</strong> {currentQ.hint}
              </div>
            )}
          </div>
        )}

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          {currentQ.options.map((optText, optIdx) => {
            const isSelected = selectedAnswers[currentQ.id] === optIdx;
            const isCorrectOpt = currentQ.correctAnswer === optIdx;
            
            let btnBg = 'var(--bg-card-hover)';
            let btnBorder = 'var(--border-color)';
            let textColor = 'var(--text-primary)';

            if (isPracticeMode && isAnswered) {
              if (isCorrectOpt) {
                btnBg = 'var(--success-bg)';
                btnBorder = 'var(--success-color)';
                textColor = 'var(--success-color)';
              } else if (isSelected && !isCorrectOpt) {
                btnBg = 'var(--danger-bg)';
                btnBorder = 'var(--danger-color)';
                textColor = 'var(--danger-color)';
              }
            } else if (isSelected) {
              btnBg = 'rgba(99, 102, 241, 0.15)';
              btnBorder = 'var(--accent-primary)';
              textColor = 'var(--accent-primary)';
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: btnBg,
                  border: `1px solid ${btnBorder}`,
                  color: textColor,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  lineHeight: '1.4',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `1px solid ${btnBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: '700'
                  }}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{optText}</span>
                </div>

                {isPracticeMode && isAnswered && isCorrectOpt && <CheckCircle2 size={20} color="var(--success-color)" />}
                {isPracticeMode && isAnswered && isSelected && !isCorrectOpt && <XCircle size={20} color="var(--danger-color)" />}
              </button>
            );
          })}
        </div>

        {/* Practice Mode Explanation Box */}
        {isPracticeMode && isAnswered && (
          <div className="animate-fade-in" style={{
            marginTop: '10px',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid var(--border-active)'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '4px' }}>
              स्पष्टीकरण:
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              {currentQ.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Bottom Action Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          className="btn-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ flex: 1, opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={16} /> अघिल्लो
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            className="btn-primary"
            onClick={handleFinish}
            style={{ flex: 1.5, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            सबमिट गर्नुहोस् <Award size={18} />
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleNext}
            style={{ flex: 1.5 }}
          >
            अर्को प्रश्न <ArrowRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
