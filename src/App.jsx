import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import ChapterList from './components/ChapterList';
import QuizEngine from './components/QuizEngine';
import ResultView from './components/ResultView';
import AnalyticsView from './components/AnalyticsView';
import BookmarksView from './components/BookmarksView';
import AdminPanel from './components/AdminPanel';
import ClassSelector from './components/ClassSelector';

import { 
  getSettings, 
  saveSettings, 
  getBookmarks, 
  toggleBookmark, 
  getAggregateStats, 
  saveQuizResult,
  getSelectedClass,
  saveSelectedClass
} from './utils/storage';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'chapters' | 'quiz' | 'bookmarks' | 'analytics' | 'admin'
  const [selectedClass, setSelectedClass] = useState(null); // null means ClassSelector is shown first
  const [activeQuizConfig, setActiveQuizConfig] = useState(null); // when in quiz mode
  const [latestResult, setLatestResult] = useState(null); // when in result view
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({ quizzesTaken: 0, totalAttempted: 0, totalCorrect: 0 });

  useEffect(() => {
    const initialSettings = getSettings();
    setTheme(initialSettings.theme || 'dark');
    document.documentElement.setAttribute('data-theme', initialSettings.theme || 'dark');

    const savedClass = getSelectedClass();
    if (savedClass) {
      setSelectedClass(savedClass);
    }

    setBookmarks(getBookmarks());
    setStats(getAggregateStats());
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    saveSettings({ theme: nextTheme });
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    saveSelectedClass(cls);
  };

  const handleToggleBookmark = (questionId) => {
    const updated = toggleBookmark(questionId);
    setBookmarks(updated);
  };

  const handleStartQuiz = (config) => {
    setActiveQuizConfig(config);
    setLatestResult(null);
  };

  const handleFinishQuiz = (resultData) => {
    const savedEntry = saveQuizResult(resultData);
    setStats(getAggregateStats());
    setLatestResult({ ...resultData, entryId: savedEntry ? savedEntry.id : null });
    setActiveQuizConfig(null);
  };

  const handleExitQuiz = () => {
    setActiveQuizConfig(null);
    setLatestResult(null);
  };

  const handleRetryQuiz = () => {
    if (latestResult) {
      handleStartQuiz({
        mode: latestResult.mode,
        chapterId: latestResult.questions && latestResult.questions[0] ? latestResult.questions[0].chapterId : null,
        filterSubject: latestResult.questions && latestResult.questions[0] ? latestResult.questions[0].subject : 'all'
      });
    }
  };

  const handleRefreshStats = () => {
    setStats(getAggregateStats());
    setBookmarks(getBookmarks());
  };

  // If no class is selected yet, show the class selection landing screen
  if (selectedClass === null) {
    return <ClassSelector onSelectClass={handleSelectClass} />;
  }

  // Determine current active view
  const isQuizActive = !!activeQuizConfig;
  const isResultActive = !!latestResult;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Show header unless in quiz engine or result view */}
      {!isQuizActive && !isResultActive && (
        <Header 
          theme={theme} 
          onToggleTheme={handleToggleTheme} 
          onOpenAdmin={() => setActiveTab('admin')} 
          selectedClass={selectedClass}
          onChangeClass={handleSelectClass}
        />
      )}

      {/* Main Screen Content */}
      <main className="main-content">
        {isQuizActive ? (
          <QuizEngine
            quizConfig={activeQuizConfig}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onFinishQuiz={handleFinishQuiz}
            onExitQuiz={handleExitQuiz}
            selectedClass={selectedClass}
          />
        ) : isResultActive ? (
          <ResultView
            resultData={latestResult}
            onRetry={handleRetryQuiz}
            onHome={() => { setLatestResult(null); setActiveTab('home'); }}
            onNavigate={(tab) => { setLatestResult(null); setActiveTab(tab); }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <Dashboard
                onStartQuiz={handleStartQuiz}
                onNavigate={setActiveTab}
                stats={stats}
                bookmarkCount={bookmarks.length}
                selectedClass={selectedClass}
              />
            )}

            {activeTab === 'chapters' && (
              <ChapterList onStartQuiz={handleStartQuiz} selectedClass={selectedClass} />
            )}

            {activeTab === 'quiz' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>क्विज मोड चयन गर्नुहोस्</h2>
                <Dashboard
                  onStartQuiz={handleStartQuiz}
                  onNavigate={setActiveTab}
                  stats={stats}
                  bookmarkCount={bookmarks.length}
                  selectedClass={selectedClass}
                />
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <BookmarksView
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
                onStartQuiz={handleStartQuiz}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView onRefreshStats={handleRefreshStats} />
            )}

            {activeTab === 'admin' && (
              <AdminPanel />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation (Visible when not actively taking quiz) */}
      {!isQuizActive && (
        <BottomNav
          activeTab={isResultActive ? 'quiz' : activeTab}
          onTabChange={(tab) => {
            setLatestResult(null);
            setActiveQuizConfig(null);
            setActiveTab(tab);
          }}
        />
      )}

    </div>
  );
}
