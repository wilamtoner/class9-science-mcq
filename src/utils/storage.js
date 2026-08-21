const STORAGE_KEYS = {
  SETTINGS: 'c9_science_settings',
  QUIZ_HISTORY: 'c9_science_history',
  BOOKMARKS: 'c9_science_bookmarks',
  STATS: 'c9_science_stats',
  SELECTED_CLASS: 'c9_science_selected_class'
};

// Class selection
export const getSelectedClass = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SELECTED_CLASS);
    return data ? parseInt(data, 10) : null; // null means not yet selected
  } catch (e) {
    return null;
  }
};

export const saveSelectedClass = (classLevel) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CLASS, String(classLevel));
  } catch (e) {
    console.error('Failed to save selected class:', e);
  }
};

// Default app settings
export const getSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'dark', soundEnabled: true, timerMinutes: 10 };
  } catch (e) {
    return { theme: 'dark', soundEnabled: true, timerMinutes: 10 };
  }
};

export const saveSettings = (newSettings) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

// Bookmarks management
export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmark = (questionId) => {
  try {
    const bookmarks = getBookmarks();
    let updated;
    if (bookmarks.includes(questionId)) {
      updated = bookmarks.filter(id => id !== questionId);
    } else {
      updated = [...bookmarks, questionId];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle bookmark:', e);
    return [];
  }
};

// Quiz History & Results
export const getQuizHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveQuizResult = (result) => {
  try {
    const history = getQuizHistory();
    const newEntry = {
      id: 'res_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      mode: result.mode, // 'practice' | 'exam' | 'chapter'
      chapterTitle: result.chapterTitle || 'All Chapters',
      totalQuestions: result.totalQuestions,
      score: result.score,
      percentage: Math.round((result.score / result.totalQuestions) * 100),
      timeSpentSeconds: result.timeSpentSeconds,
      subjectBreakdown: result.subjectBreakdown || {}
    };

    const updatedHistory = [newEntry, ...history].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updatedHistory));

    // Update overall aggregate stats
    updateAggregateStats(result);

    return newEntry;
  } catch (e) {
    console.error('Failed to save quiz result:', e);
  }
};

// Overall Stats (Total questions attempted, correct count, accuracy)
export const getAggregateStats = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : {
      quizzesTaken: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      physicsCorrect: 0,
      physicsTotal: 0,
      chemistryCorrect: 0,
      chemistryTotal: 0,
      biologyCorrect: 0,
      biologyTotal: 0,
      earthspaceCorrect: 0,
      earthspaceTotal: 0,
      ictCorrect: 0,
      ictTotal: 0
    };
  } catch (e) {
    return {
      quizzesTaken: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      physicsCorrect: 0,
      physicsTotal: 0,
      chemistryCorrect: 0,
      chemistryTotal: 0,
      biologyCorrect: 0,
      biologyTotal: 0,
      earthspaceCorrect: 0,
      earthspaceTotal: 0,
      ictCorrect: 0,
      ictTotal: 0
    };
  }
};

const updateAggregateStats = (result) => {
  try {
    const stats = getAggregateStats();
    stats.quizzesTaken += 1;
    stats.totalAttempted += result.totalQuestions;
    stats.totalCorrect += result.score;

    if (result.subjectBreakdown) {
      if (result.subjectBreakdown.Physics) {
        stats.physicsCorrect += result.subjectBreakdown.Physics.correct || 0;
        stats.physicsTotal += result.subjectBreakdown.Physics.total || 0;
      }
      if (result.subjectBreakdown.Chemistry) {
        stats.chemistryCorrect += result.subjectBreakdown.Chemistry.correct || 0;
        stats.chemistryTotal += result.subjectBreakdown.Chemistry.total || 0;
      }
      if (result.subjectBreakdown.Biology) {
        stats.biologyCorrect += result.subjectBreakdown.Biology.correct || 0;
        stats.biologyTotal += result.subjectBreakdown.Biology.total || 0;
      }
      if (result.subjectBreakdown.EarthSpace) {
        stats.earthspaceCorrect += result.subjectBreakdown.EarthSpace.correct || 0;
        stats.earthspaceTotal += result.subjectBreakdown.EarthSpace.total || 0;
      }
      if (result.subjectBreakdown.ICT) {
        stats.ictCorrect += result.subjectBreakdown.ICT.correct || 0;
        stats.ictTotal += result.subjectBreakdown.ICT.total || 0;
      }
    }

    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to update stats:', e);
  }
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
  localStorage.removeItem(STORAGE_KEYS.STATS);
};
