import { QUESTIONS as DEFAULT_QUESTIONS } from '../data/questions';

const CUSTOM_QUESTIONS_KEY = 'c9_science_custom_questions';
const MODIFIED_QUESTIONS_KEY = 'c9_science_modified_questions';
const DELETED_QUESTIONS_KEY = 'c9_science_deleted_ids';

// Get custom added questions from LocalStorage
export const getCustomQuestions = () => {
  try {
    const data = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading custom questions:', e);
    return [];
  }
};

// Get overrides for modified default questions
export const getModifiedQuestions = () => {
  try {
    const data = localStorage.getItem(MODIFIED_QUESTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

// Get deleted question IDs
export const getDeletedQuestionIds = () => {
  try {
    const data = localStorage.getItem(DELETED_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Get all combined questions (default + custom - deleted)
export const getAllQuestions = () => {
  const deletedIds = new Set(getDeletedQuestionIds());
  const modifiedMap = getModifiedQuestions();
  const customList = getCustomQuestions();

  // Map default questions, applying any modifications and excluding deleted ones
  const activeDefaultQuestions = DEFAULT_QUESTIONS
    .filter(q => !deletedIds.has(q.id))
    .map(q => modifiedMap[q.id] ? { ...q, ...modifiedMap[q.id] } : q);

  // Exclude deleted custom questions
  const activeCustomQuestions = customList.filter(q => !deletedIds.has(q.id));

  return [...activeDefaultQuestions, ...activeCustomQuestions];
};

// Add a new question
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

// Update an existing question
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
            updatedAt: Date.now()
          };
        }
        return q;
      });
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(updatedCustomList));
    } else {
      // Overriding a default question
      const modifiedMap = getModifiedQuestions();
      modifiedMap[questionId] = {
        ...questionData,
        options: questionData.options ? questionData.options.map(o => o.trim()) : questionData.options,
        correctAnswer: parseInt(questionData.correctAnswer, 10),
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

// Delete a question by ID
export const deleteQuestion = (questionId) => {
  try {
    const deletedIds = getDeletedQuestionIds();
    if (!deletedIds.includes(questionId)) {
      const updatedDeleted = [...deletedIds, questionId];
      localStorage.setItem(DELETED_QUESTIONS_KEY, JSON.stringify(updatedDeleted));
    }

    // If it's a custom question, remove from custom list too
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

// Import questions from JSON
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

// Reset all modifications & custom questions to original defaults
export const resetToDefaultQuestions = () => {
  localStorage.removeItem(CUSTOM_QUESTIONS_KEY);
  localStorage.removeItem(MODIFIED_QUESTIONS_KEY);
  localStorage.removeItem(DELETED_QUESTIONS_KEY);
  notifyListeners();
};

// Event listener mechanism for UI reactivity
const listeners = new Set();
export const subscribeQuestions = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = () => {
  const allQs = getAllQuestions();
  listeners.forEach(l => l(allQs));
};
