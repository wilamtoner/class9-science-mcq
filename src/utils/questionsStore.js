import { QUESTIONS as DEFAULT_QUESTIONS } from '../data/questions';
import { CHAPTERS as DEFAULT_CHAPTERS } from '../data/chapters';

const CUSTOM_QUESTIONS_KEY = 'c9_science_custom_questions';
const MODIFIED_QUESTIONS_KEY = 'c9_science_modified_questions';
const DELETED_QUESTIONS_KEY = 'c9_science_deleted_ids';
const CUSTOM_CHAPTERS_KEY = 'c9_science_custom_chapters';

// --- CHAPTERS STORAGE METHODS ---

export const getCustomChapters = () => {
  try {
    const data = localStorage.getItem(CUSTOM_CHAPTERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading custom chapters:', e);
    return [];
  }
};

export const getChapters = (classLevel) => {
  const customList = getCustomChapters();
  const activeClassLevel = parseInt(classLevel, 10) || 9;

  // Filter default chapters matching selected class
  const classDefaultChapters = DEFAULT_CHAPTERS.filter(
    ch => (ch.classLevel || 9) === activeClassLevel
  );

  // Filter custom chapters matching selected class
  const classCustomChapters = customList.filter(
    ch => (ch.classLevel || 9) === activeClassLevel
  );

  return [...classDefaultChapters, ...classCustomChapters];
};

export const addChapter = (chapterData) => {
  try {
    const customList = getCustomChapters();
    const newChapter = {
      id: 'chapter_custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      number: parseInt(chapterData.number, 10) || (customList.length + DEFAULT_CHAPTERS.length + 1),
      title: chapterData.title.trim(),
      subject: chapterData.subject || 'Biology',
      description: (chapterData.description || '').trim(),
      icon: chapterData.icon || 'BookOpen',
      classLevel: parseInt(chapterData.classLevel, 10) || 9,
      isCustom: true,
      createdAt: Date.now()
    };

    const updated = [...customList, newChapter];
    localStorage.setItem(CUSTOM_CHAPTERS_KEY, JSON.stringify(updated));
    notifyListeners();
    return newChapter;
  } catch (e) {
    console.error('Failed to add chapter:', e);
    throw e;
  }
};

export const updateChapter = (chapterId, chapterData) => {
  try {
    const customList = getCustomChapters();
    const updated = customList.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          ...chapterData,
          number: parseInt(chapterData.number, 10) || ch.number,
          classLevel: parseInt(chapterData.classLevel, 10) || ch.classLevel
        };
      }
      return ch;
    });
    localStorage.setItem(CUSTOM_CHAPTERS_KEY, JSON.stringify(updated));
    notifyListeners();
    return true;
  } catch (e) {
    console.error('Failed to update chapter:', e);
    throw e;
  }
};

export const deleteChapter = (chapterId) => {
  try {
    const customList = getCustomChapters();
    const updated = customList.filter(ch => ch.id !== chapterId);
    localStorage.setItem(CUSTOM_CHAPTERS_KEY, JSON.stringify(updated));
    notifyListeners();
    return true;
  } catch (e) {
    console.error('Failed to delete chapter:', e);
    throw e;
  }
};


// --- QUESTIONS STORAGE METHODS ---

export const getCustomQuestions = () => {
  try {
    const data = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading custom questions:', e);
    return [];
  }
};

export const getModifiedQuestions = () => {
  try {
    const data = localStorage.getItem(MODIFIED_QUESTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const getDeletedQuestionIds = () => {
  try {
    const data = localStorage.getItem(DELETED_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Filtered optionally by classLevel (e.g. 8, 9, 10, 11, 12)
export const getAllQuestions = (classLevel = null) => {
  const deletedIds = new Set(getDeletedQuestionIds());
  const modifiedMap = getModifiedQuestions();
  const customList = getCustomQuestions();

  // Combine defaults and custom questions, applying modifications
  const activeDefaultQuestions = DEFAULT_QUESTIONS
    .filter(q => !deletedIds.has(q.id))
    .map(q => modifiedMap[q.id] ? { ...q, ...modifiedMap[q.id] } : q);

  const activeCustomQuestions = customList.filter(q => !deletedIds.has(q.id));
  const combined = [...activeDefaultQuestions, ...activeCustomQuestions];

  if (classLevel !== null) {
    const targetClass = parseInt(classLevel, 10);
    return combined.filter(q => (q.classLevel || 9) === targetClass);
  }

  return combined;
};

export const addQuestion = (questionData) => {
  try {
    const customList = getCustomQuestions();
    const newQuestion = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      chapterId: questionData.chapterId || 'ch1',
      subject: questionData.subject || 'Biology',
      question: questionData.question.trim(),
      options: questionData.options.map(opt => opt.trim()),
      correctAnswer: parseInt(questionData.correctAnswer, 10) || 0,
      explanation: (questionData.explanation || '').trim(),
      hint: (questionData.hint || '').trim(),
      difficulty: questionData.difficulty || 'Medium',
      classLevel: parseInt(questionData.classLevel, 10) || 9,
      isCustom: true,
      createdAt: Date.now()
    };

    const updated = [newQuestion, ...customList];
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(updated));
    notifyListeners();
    return newQuestion;
  } catch (e) {
    console.error('Failed to add question:', e);
    throw e;
  }
};

export const updateQuestion = (questionId, questionData) => {
  try {
    const customList = getCustomQuestions();
    const isCustom = customList.some(q => q.id === questionId);

    if (isCustom) {
      const updatedCustomList = customList.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            ...questionData,
            options: questionData.options ? questionData.options.map(o => o.trim()) : q.options,
            correctAnswer: parseInt(questionData.correctAnswer, 10),
            classLevel: parseInt(questionData.classLevel, 10) || q.classLevel,
            updatedAt: Date.now()
          };
        }
        return q;
      });
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(updatedCustomList));
    } else {
      const modifiedMap = getModifiedQuestions();
      modifiedMap[questionId] = {
        ...questionData,
        options: questionData.options ? questionData.options.map(o => o.trim()) : questionData.options,
        correctAnswer: parseInt(questionData.correctAnswer, 10),
        classLevel: parseInt(questionData.classLevel, 10) || 9,
        updatedAt: Date.now()
      };
      localStorage.setItem(MODIFIED_QUESTIONS_KEY, JSON.stringify(modifiedMap));
    }

    notifyListeners();
    return true;
  } catch (e) {
    console.error('Failed to update question:', e);
    throw e;
  }
};

export const deleteQuestion = (questionId) => {
  try {
    const deletedIds = getDeletedQuestionIds();
    if (!deletedIds.includes(questionId)) {
      const updatedDeleted = [...deletedIds, questionId];
      localStorage.setItem(DELETED_QUESTIONS_KEY, JSON.stringify(updatedDeleted));
    }

    const customList = getCustomQuestions();
    const updatedCustom = customList.filter(q => q.id !== questionId);
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(updatedCustom));

    notifyListeners();
    return true;
  } catch (e) {
    console.error('Failed to delete question:', e);
    throw e;
  }
};

export const importQuestions = (questionsArray) => {
  try {
    if (!Array.isArray(questionsArray)) {
      throw new Error('Invalid input: Expected an array of questions');
    }

    const currentCustom = getCustomQuestions();
    const validatedNew = questionsArray.map((q, idx) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Question #${idx + 1} is missing required fields (question text or at least 2 options)`);
      }
      return {
        id: q.id || ('imported_' + Date.now() + '_' + idx),
        chapterId: q.chapterId || 'ch1',
        subject: q.subject || 'Biology',
        question: q.question.trim(),
        options: q.options.map(o => String(o).trim()),
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || '',
        hint: q.hint || '',
        difficulty: q.difficulty || 'Medium',
        classLevel: parseInt(q.classLevel, 10) || 9,
        isCustom: true,
        importedAt: Date.now()
      };
    });

    const merged = [...validatedNew, ...currentCustom];
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(merged));
    notifyListeners();
    return validatedNew.length;
  } catch (e) {
    console.error('Failed to import questions:', e);
    throw e;
  }
};

export const resetToDefaultQuestions = () => {
  localStorage.removeItem(CUSTOM_QUESTIONS_KEY);
  localStorage.removeItem(MODIFIED_QUESTIONS_KEY);
  localStorage.removeItem(DELETED_QUESTIONS_KEY);
  localStorage.removeItem(CUSTOM_CHAPTERS_KEY);
  notifyListeners();
};

const listeners = new Set();
export const subscribeQuestions = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = () => {
  const allQs = getAllQuestions();
  listeners.forEach(l => l(allQs));
};
