import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  PenLine,
  CheckCircle,
  Plus,
  Trash2,
  ArrowLeft,
  Calendar,
  Activity,
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import {
  doc,
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import { playSound } from '../utils/soundFX';
import { getTodayUTC, getWeekIdUTC, isMondayUTC, formatDisplayDate } from '../utils/dateUtils';

export interface WordOfTheDayItem {
  french: string;
  english: string;
  example: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  hint?: string;
}

interface TeacherDashboardProps {
  onBackToMap?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToMap }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { usersList, loading: adminLoading } = useAdmin();
  const { t, language } = useLanguage();

  const todayUTC = getTodayUTC();
  const currentWeekId = getWeekIdUTC();
  const isMonday = isMondayUTC();

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ---------------------------------------------------------
  // SECTION A: Student Activity
  // ---------------------------------------------------------
  const [studentSearch, setStudentSearch] = useState('');
  const learnerStudents = usersList.filter((u) => {
    if (u.role !== 'learner') return false;
    const searchLower = studentSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  });

  const totalLearnersCount = usersList.filter((u) => u.role === 'learner').length;
  const totalOnlineHours = learnerStudents
    .reduce((acc, s) => acc + (s.totalOnlineMinutes || 0) / 60, 0)
    .toFixed(1);

  // ---------------------------------------------------------
  // SECTION B: Words of the Day
  // ---------------------------------------------------------
  const [words, setWords] = useState<[WordOfTheDayItem, WordOfTheDayItem, WordOfTheDayItem]>([
    { french: '', english: '', example: '' },
    { french: '', english: '', example: '' },
    { french: '', english: '', example: '' }
  ]);
  const [publishedWordsToday, setPublishedWordsToday] = useState<{
    words: WordOfTheDayItem[];
    teacherName?: string;
    publishedAt?: string;
  } | null>(null);
  const [savingWords, setSavingWords] = useState(false);
  const [wordsError, setWordsError] = useState<string | null>(null);

  // Fetch today's published words on mount
  useEffect(() => {
    let isMounted = true;
    async function loadWords() {
      try {
        const wordsRef = doc(db, 'wordsOfTheDay', todayUTC);
        const snap = await getDoc(wordsRef);
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data && Array.isArray(data.words) && data.words.length === 3) {
            setPublishedWordsToday({
              words: data.words,
              teacherName: data.teacherName,
              publishedAt: todayUTC
            });
            setWords([
              { ...data.words[0] },
              { ...data.words[1] },
              { ...data.words[2] }
            ]);
          }
        }
      } catch (err) {
        console.error('Error loading words of the day:', err);
      }
    }
    loadWords();
    return () => {
      isMounted = false;
    };
  }, [todayUTC]);

  const handleWordChange = (
    index: 0 | 1 | 2,
    field: keyof WordOfTheDayItem,
    value: string
  ) => {
    setWords((prev) => {
      const next = [...prev] as [WordOfTheDayItem, WordOfTheDayItem, WordOfTheDayItem];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handlePublishWords = async (e: React.FormEvent) => {
    e.preventDefault();
    setWordsError(null);

    // Validation
    for (let i = 0; i < 3; i++) {
      if (!words[i].french.trim() || !words[i].english.trim()) {
        setWordsError(
          language === 'fr'
            ? `Veuillez remplir le mot français et la traduction anglaise pour le Mot ${i + 1}.`
            : `Please fill in both French word and English translation for Word ${i + 1}.`
        );
        return;
      }
    }

    setSavingWords(true);
    playSound('click');

    try {
      const wordsRef = doc(db, 'wordsOfTheDay', todayUTC);
      const cleanWords = words.map((w) => ({
        french: w.french.trim(),
        english: w.english.trim(),
        example: w.example.trim()
      }));

      const teacherName =
        user?.displayName || (user?.email ? user.email.split('@')[0] : 'Enseignant');

      await setDoc(wordsRef, {
        date: todayUTC,
        words: cleanWords,
        publishedBy: user?.uid || 'teacher',
        teacherName,
        updatedAt: Timestamp.now()
      });

      setPublishedWordsToday({
        words: cleanWords,
        teacherName,
        publishedAt: todayUTC
      });

      showToast(
        language === 'fr'
          ? 'Mots du jour publiés avec succès !'
          : 'Words of the day published successfully!'
      );
    } catch (err) {
      console.error('Failed to publish words of the day:', err);
      setWordsError(
        language === 'fr'
          ? 'Erreur lors de la publication des mots. Réessayez.'
          : 'Failed to publish words. Please try again.'
      );
    } finally {
      setSavingWords(false);
    }
  };

  // ---------------------------------------------------------
  // SECTION C: Weekly Quiz Builder
  // ---------------------------------------------------------
  const [testModeUnlocked, setTestModeUnlocked] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionItem[]>([
    {
      id: 'q_1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      hint: ''
    }
  ]);
  const [publishedQuiz, setPublishedQuiz] = useState<{
    questionsCount: number;
    weekId: string;
    teacherName?: string;
  } | null>(null);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Fetch current week quiz on mount
  useEffect(() => {
    let isMounted = true;
    async function loadQuiz() {
      try {
        const quizRef = doc(db, 'quizzes', currentWeekId);
        const snap = await getDoc(quizRef);
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data && Array.isArray(data.questions) && data.questions.length > 0) {
            setPublishedQuiz({
              questionsCount: data.questions.length,
              weekId: currentWeekId,
              teacherName: data.teacherName
            });
            setQuestions(data.questions);
          }
        }
      } catch (err) {
        console.error('Error loading weekly quiz:', err);
      }
    }
    loadQuiz();
    return () => {
      isMounted = false;
    };
  }, [currentWeekId]);

  const handleAddQuestion = () => {
    if (questions.length >= 10) return;
    playSound('click');
    setQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        hint: ''
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    playSound('click');
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], question: text };
      return next;
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      const nextOptions = [...next[qIndex].options] as [string, string, string, string];
      nextOptions[optIndex] = value;
      next[qIndex] = { ...next[qIndex], options: nextOptions };
      return next;
    });
  };

  const handleCorrectAnswerChange = (qIndex: number, optIndex: number) => {
    playSound('click');
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], correctAnswer: optIndex };
      return next;
    });
  };

  const handleHintChange = (qIndex: number, hint: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], hint };
      return next;
    });
  };

  const handlePublishQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizError(null);

    // Validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setQuizError(
          language === 'fr'
            ? `Veuillez saisir le texte de la Question ${i + 1}.`
            : `Please enter the question text for Question ${i + 1}.`
        );
        return;
      }
      for (let o = 0; o < 4; o++) {
        if (!q.options[o].trim()) {
          const letter = ['A', 'B', 'C', 'D'][o];
          setQuizError(
            language === 'fr'
              ? `Veuillez remplir l'Option ${letter} pour la Question ${i + 1}.`
              : `Please fill in Option ${letter} for Question ${i + 1}.`
          );
          return;
        }
      }
    }

    setSavingQuiz(true);
    playSound('click');

    try {
      const quizRef = doc(db, 'quizzes', currentWeekId);
      const teacherName =
        user?.displayName || (user?.email ? user.email.split('@')[0] : 'Enseignant');

      const formattedQuestions = questions.map((q, idx) => ({
        id: q.id || `q_${idx + 1}`,
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctAnswer: q.correctAnswer,
        hint: q.hint ? q.hint.trim() : ''
      }));

      await setDoc(quizRef, {
        weekId: currentWeekId,
        teacherName,
        publishedBy: user?.uid || 'teacher',
        questions: formattedQuestions,
        updatedAt: Timestamp.now()
      });

      setPublishedQuiz({
        questionsCount: formattedQuestions.length,
        weekId: currentWeekId,
        teacherName
      });

      showToast(
        language === 'fr'
          ? `Quiz pour la semaine ${currentWeekId} publié avec succès !`
          : `Weekly Quiz for ${currentWeekId} published successfully!`
      );
    } catch (err) {
      console.error('Failed to publish weekly quiz:', err);
      setQuizError(
        language === 'fr'
          ? 'Erreur lors de la publication du quiz. Réessayez.'
          : 'Failed to publish quiz. Please try again.'
      );
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleBack = () => {
    playSound('click');
    if (onBackToMap) {
      onBackToMap();
    } else {
      navigate('/');
    }
  };

  const teacherDisplayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'Professeur');

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f4eee6] to-[#ebe3d5] text-[#4a3324] flex flex-col font-sans teacher-dashboard-page">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#a07855]/20 shadow-sm teacher-navbar">
        <div className="flex items-center gap-5 teacher-nav-left">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#a07855]/25 bg-[#f5eee4]/70 hover:bg-[#ebdcc9] text-[#785b49] text-xs font-semibold transition-all cursor-pointer back-map-btn"
            onClick={handleBack}
          >
            <ArrowLeft size={15} />
            <span>{t('backToVillage')}</span>
          </button>
          <div className="flex items-center gap-2.5 teacher-brand">
            <GraduationCap size={22} className="text-[#c46238] teacher-icon-glow" />
            <h2 className="text-base font-bold text-[#4a3324] tracking-tight">
              {t('teacherDashboard')} • VillonWood
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 teacher-nav-right">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#f5eee4]/80 border border-[#a07855]/20 text-xs font-semibold text-[#785b49] shadow-sm teacher-profile-badge">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
            <span>{teacherDisplayName}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#c46238]/10 text-[#c46238]">
              {t('userRoleTeacher')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-6 space-y-6 teacher-main-container">
        {/* Toast Feedback */}
        {toastMsg && (
          <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] shadow-lg text-xs font-semibold animate-fade-in teacher-toast">
            <CheckCircle size={16} className="text-[#22c55e]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 teacher-stats-grid">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#faf6f0]/90 border border-[#a07855]/15 shadow-sm stat-card">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600 flex-shrink-0 stat-icon-wrapper blue">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#4a3324] stat-value">
                {totalLearnersCount}
              </div>
              <div className="text-xs text-[#785b49] font-medium stat-label">
                {language === 'fr' ? 'Apprenants inscrits' : 'Enrolled Learners'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#faf6f0]/90 border border-[#a07855]/15 shadow-sm stat-card">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-green-500/10 text-green-600 flex-shrink-0 stat-icon-wrapper green">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#4a3324] stat-value">
                {totalOnlineHours} h
              </div>
              <div className="text-xs text-[#785b49] font-medium stat-label">
                {language === 'fr' ? 'Temps total apprenants' : 'Total Learner Hours'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#faf6f0]/90 border border-[#a07855]/15 shadow-sm stat-card">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#d97736]/10 text-[#d97736] flex-shrink-0 stat-icon-wrapper amber">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#4a3324] stat-value">
                {publishedWordsToday ? '3 / 3' : '0 / 3'}
              </div>
              <div className="text-xs text-[#785b49] font-medium stat-label">
                {language === 'fr' ? 'Mots du jour (aujourd’hui)' : 'Words of the Day (today)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#faf6f0]/90 border border-[#a07855]/15 shadow-sm stat-card">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-600 flex-shrink-0 stat-icon-wrapper purple">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#4a3324] stat-value">
                {publishedQuiz ? `${publishedQuiz.questionsCount} Qs` : '0 Qs'}
              </div>
              <div className="text-xs text-[#785b49] font-medium stat-label">
                {language === 'fr'
                  ? `Quiz hebdo (${currentWeekId})`
                  : `Weekly Quiz (${currentWeekId})`}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SECTION A: Student Activity */}
        {/* ---------------------------------------------------- */}
        <section className="p-6 rounded-2xl bg-[#faf6f0]/85 border border-[#a07855]/15 shadow-sm space-y-4 teacher-section-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#a07855]/15 teacher-section-header">
            <div className="flex items-center gap-2 section-title">
              <Activity size={18} className="text-[#c46238]" />
              <h3 className="text-base font-bold text-[#4a3324]">
                {t('studentActivity')}
              </h3>
            </div>

            <input
              type="text"
              className="w-full sm:w-72 px-3.5 py-1.5 rounded-xl border border-[#a07855]/25 bg-[#f5eee4]/60 text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none focus:border-[#c46238] transition-all teacher-search-input"
              placeholder={
                language === 'fr'
                  ? 'Rechercher un apprenant par nom ou email...'
                  : 'Search learner by name or email...'
              }
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#a07855]/15 bg-white/40 teacher-table-wrapper">
            <table className="w-full text-left text-xs border-collapse teacher-table">
              <thead>
                <tr className="border-b border-[#a07855]/15 bg-[#f4eee6]/60 text-[#785b49] uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-2.5 px-4">{language === 'fr' ? 'Nom' : 'Name'}</th>
                  <th className="py-2.5 px-4">{language === 'fr' ? 'E-mail' : 'Email'}</th>
                  <th className="py-2.5 px-4">{language === 'fr' ? 'Dernière activité' : 'Last Active'}</th>
                  <th className="py-2.5 px-4">{language === 'fr' ? 'Heures en ligne' : 'Hours Online'}</th>
                  <th className="py-2.5 px-4 text-right">
                    {language === 'fr' ? 'Statut' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#a07855]/10">
                {adminLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-[#785b49]">
                      {language === 'fr' ? 'Chargement des apprenants…' : 'Loading students…'}
                    </td>
                  </tr>
                ) : learnerStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-[#785b49]">
                      {language === 'fr'
                        ? 'Aucun apprenant trouvé pour le moment.'
                        : 'No learners found at this time.'}
                    </td>
                  </tr>
                ) : (
                  learnerStudents.map((student) => {
                    const hoursOnline = ((student.totalOnlineMinutes || 0) / 60).toFixed(1);
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-[#f5eee4]/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5 user-name-cell">
                            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d97736] to-[#c46238] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 user-avatar-mini">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="font-semibold text-[#4a3324] user-fullname">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#785b49] user-email">
                          {student.email || '—'}
                        </td>
                        <td className="py-3 px-4 text-[#785b49]">
                          {student.lastActive || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ede3d5]/70 text-[#4a3324] font-medium teacher-hours-badge">
                            <Clock size={12} className="text-[#c46238]" /> {hoursOnline} h
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22c55e]/10 text-[#166534] font-semibold text-[11px] teacher-status-pill online">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                            <span>{language === 'fr' ? 'Actif' : 'Active'}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION B: Words of the Day */}
        {/* ---------------------------------------------------- */}
        <section className="p-6 rounded-2xl bg-[#faf6f0]/85 border border-[#a07855]/15 shadow-sm space-y-4 teacher-section-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#a07855]/15 teacher-section-header">
            <div className="flex items-center gap-2 section-title">
              <BookOpen size={18} className="text-[#c46238]" />
              <h3 className="text-base font-bold text-[#4a3324]">
                {t('wordsOfTheDayTitle')}
              </h3>
              <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-md bg-[#c46238]/10 text-[#c46238] text-[11px] font-semibold teacher-date-tag">
                <Calendar size={12} />
                <span>{formatDisplayDate(todayUTC, language)} (UTC)</span>
              </span>
            </div>

            {publishedWordsToday && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/15 text-[#166534] text-xs font-semibold teacher-published-status">
                <CheckCircle size={14} />
                <span>
                  {language === 'fr' ? 'Mots publiés aujourd’hui' : 'Words published today'}
                </span>
              </span>
            )}
          </div>

          <p className="text-xs text-[#785b49] teacher-section-desc">
            {language === 'fr'
              ? 'Définissez les 3 mots français du jour pour enrichir le vocabulaire des apprenants du village. Ils s’affichent directement sur leur carte interactive.'
              : 'Set 3 French words of the day for village learners. They will appear on their interactive map view.'}
          </p>

          {wordsError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium teacher-error-banner">
              <AlertCircle size={15} />
              <span>{wordsError}</span>
            </div>
          )}

          <form onSubmit={handlePublishWords} className="space-y-5 teacher-words-form">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 teacher-words-grid">
              {([0, 1, 2] as const).map((idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#f4eee6]/60 border border-[#a07855]/15 space-y-3 shadow-xs hover:border-[#c46238]/40 transition-colors teacher-word-card"
                >
                  <div className="flex items-center justify-between teacher-word-card-header">
                    <span className="px-2 py-0.5 rounded bg-[#c46238] text-white text-[11px] font-bold uppercase tracking-wider teacher-slot-badge">
                      {language === 'fr' ? `Mot ${idx + 1}` : `Word ${idx + 1}`}
                    </span>
                  </div>

                  <div className="space-y-1 teacher-input-group">
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-[#785b49] teacher-input-label">
                      {language === 'fr' ? 'Mot en français' : 'French Word'} *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#a07855]/25 text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none focus:border-[#c46238] teacher-text-input"
                      placeholder={
                        idx === 0
                          ? 'Ex: Bibliothèque'
                          : idx === 1
                          ? 'Ex: Chaleureux'
                          : 'Ex: Découvrir'
                      }
                      value={words[idx].french}
                      onChange={(e) => handleWordChange(idx, 'french', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 teacher-input-group">
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-[#785b49] teacher-input-label">
                      {language === 'fr' ? 'Traduction en anglais' : 'English Translation'} *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#a07855]/25 text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none focus:border-[#c46238] teacher-text-input"
                      placeholder={
                        idx === 0
                          ? 'Ex: Library'
                          : idx === 1
                          ? 'Ex: Warm / Cozy'
                          : 'Ex: To discover'
                      }
                      value={words[idx].english}
                      onChange={(e) => handleWordChange(idx, 'english', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 teacher-input-group">
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-[#785b49] teacher-input-label">
                      {language === 'fr' ? 'Phrase d’exemple' : 'Example Sentence'}
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#a07855]/25 text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none focus:border-[#c46238] resize-none teacher-textarea-input"
                      rows={2}
                      placeholder={
                        idx === 0
                          ? 'Ex: Je passe l’après-midi à la bibliothèque.'
                          : idx === 1
                          ? 'Ex: Ce café de Villon est très chaleureux.'
                          : 'Ex: Nous aimons découvrir de nouveaux chemins.'
                      }
                      value={words[idx].example}
                      onChange={(e) => handleWordChange(idx, 'example', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 teacher-form-actions">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c46238] to-[#9e461f] hover:from-[#b9552b] hover:to-[#8c3d1a] text-white text-xs font-bold shadow-md shadow-[#c46238]/20 transition-all cursor-pointer disabled:opacity-50 teacher-submit-btn"
                disabled={savingWords}
              >
                <CheckCircle size={15} />
                <span>
                  {savingWords
                    ? language === 'fr'
                      ? 'Publication en cours…'
                      : 'Publishing…'
                    : t('publishWords')}
                </span>
              </button>
            </div>
          </form>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION C: Weekly Quiz Builder */}
        {/* ---------------------------------------------------- */}
        <section className="p-6 rounded-2xl bg-[#faf6f0]/85 border border-[#a07855]/15 shadow-sm space-y-4 teacher-section-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#a07855]/15 teacher-section-header">
            <div className="flex items-center gap-2 section-title">
              <GraduationCap size={18} className="text-[#c46238]" />
              <h3 className="text-base font-bold text-[#4a3324]">
                {t('weeklyQuizTitle')}
              </h3>
              <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-md bg-[#c46238]/10 text-[#c46238] text-[11px] font-semibold teacher-date-tag">
                <Calendar size={12} />
                <span>
                  {language === 'fr' ? `Semaine ${currentWeekId}` : `Week ${currentWeekId}`}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 teacher-header-right-badges">
              {isMonday ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/15 text-[#166534] text-xs font-semibold teacher-monday-badge active">
                  <Calendar size={13} />
                  <span>
                    {language === 'fr' ? 'Lundi (UTC) — Jour du Quiz' : 'Monday (UTC) — Quiz Day'}
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer teacher-toggle-test-btn ${
                    testModeUnlocked
                      ? 'bg-[#c46238] border-[#c46238] text-white shadow-sm'
                      : 'bg-[#ede4d7] border-[#a07855]/25 text-[#4a3324] hover:bg-[#e2d4c0]'
                  }`}
                  onClick={() => {
                    playSound('click');
                    setTestModeUnlocked((prev) => !prev);
                  }}
                >
                  <PenLine size={13} />
                  <span>
                    {testModeUnlocked
                      ? language === 'fr'
                        ? 'Mode test actif'
                        : 'Testing mode active'
                      : language === 'fr'
                      ? 'Activer le mode test'
                      : 'Enable test mode'}
                  </span>
                </button>
              )}

              {publishedQuiz && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/15 text-[#166534] text-xs font-semibold teacher-published-status">
                  <CheckCircle size={14} />
                  <span>
                    {publishedQuiz.questionsCount} Qs{' '}
                    {language === 'fr' ? 'publiées' : 'published'}
                  </span>
                </span>
              )}
            </div>
          </div>

          {!isMonday && !testModeUnlocked ? (
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#f4eee6]/60 border border-[#a07855]/20 teacher-quiz-closed-notice">
              <Calendar size={28} className="text-[#c46238] flex-shrink-0 mt-0.5 teacher-notice-icon" />
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#4a3324]">
                  {language === 'fr'
                    ? 'Le quiz hebdomadaire des apprenants est réservé au lundi (UTC)'
                    : 'Students can access the weekly quiz on Mondays (UTC)'}
                </h4>
                <p className="text-xs text-[#785b49] leading-relaxed">
                  {language === 'fr'
                    ? 'Chaque lundi (UTC), les apprenants testent leurs connaissances. Activez le mode test pour préparer les questions les autres jours.'
                    : 'Learners take the quiz every Monday (UTC). Enable test mode to prepare questions on other days.'}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#c46238] hover:bg-[#b9552b] text-white text-xs font-bold transition-all shadow-sm cursor-pointer teacher-open-test-btn"
                  onClick={() => {
                    playSound('click');
                    setTestModeUnlocked(true);
                  }}
                >
                  <PenLine size={14} />
                  <span>
                    {language === 'fr' ? 'Ouvrir le créateur de quiz' : 'Open Quiz Builder'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePublishQuiz} className="space-y-5 teacher-quiz-form">
              <p className="text-xs text-[#785b49] teacher-section-desc">
                {language === 'fr'
                  ? 'Créez jusqu’à 10 questions à choix multiples pour tester les apprenants cette semaine. Cochez le bouton radio correspondant à la bonne réponse.'
                  : 'Create up to 10 multiple-choice questions for learners this week. Select the radio button for the correct answer.'}
              </p>

              {quizError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium teacher-error-banner">
                  <AlertCircle size={15} />
                  <span>{quizError}</span>
                </div>
              )}

              <div className="space-y-4 teacher-questions-list">
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-5 rounded-xl bg-[#f4eee6]/60 border border-[#a07855]/15 space-y-4 shadow-xs teacher-question-card"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#a07855]/10 teacher-question-header">
                      <div className="flex items-center gap-2 teacher-question-title">
                        <span className="w-6 h-6 rounded-full bg-[#c46238] text-white text-xs font-bold flex items-center justify-center teacher-q-number">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[#4a3324]">
                          {language === 'fr'
                            ? `Question ${qIdx + 1} sur ${questions.length}`
                            : `Question ${qIdx + 1} of ${questions.length}`}
                        </h4>
                      </div>

                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer teacher-delete-q-btn"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          title={language === 'fr' ? 'Supprimer la question' : 'Delete question'}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 teacher-input-group">
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-[#785b49] teacher-input-label">
                        {language === 'fr'
                          ? 'Énoncé de la question (en français)'
                          : 'Question Text (French)'} *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#a07855]/25 text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none focus:border-[#c46238] teacher-text-input"
                        placeholder="Ex: Quel est le bon accord : « Les lettres que j’ai… » ?"
                        value={q.question}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 teacher-options-container">
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-[#785b49] teacher-input-label">
                        {language === 'fr'
                          ? 'Options de réponses (Sélectionnez le bouton radio de la bonne réponse) *'
                          : 'Answer Options (Select the radio button for the correct answer) *'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 teacher-options-grid">
                        {(['A', 'B', 'C', 'D'] as const).map((letter, optIdx) => {
                          const isCorrect = q.correctAnswer === optIdx;
                          return (
                            <div
                              key={letter}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all teacher-option-row ${
                                isCorrect
                                  ? 'bg-[#c46238]/10 border-[#c46238] shadow-xs'
                                  : 'bg-[#faf6f0] border-[#a07855]/20 hover:border-[#a07855]/40'
                              }`}
                            >
                              <label className="flex items-center gap-1.5 cursor-pointer teacher-radio-label">
                                <input
                                  type="radio"
                                  name={`correctAnswer_${qIdx}`}
                                  checked={isCorrect}
                                  onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                                  className="accent-[#c46238] cursor-pointer"
                                />
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold teacher-opt-letter ${
                                    isCorrect
                                      ? 'bg-[#c46238] text-white'
                                      : 'bg-[#ede4d7] text-[#4a3324]'
                                  }`}
                                >
                                  {letter}
                                </span>
                              </label>
                              <input
                                type="text"
                                className="flex-1 bg-transparent border-none text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none teacher-opt-input"
                                placeholder={
                                  language === 'fr'
                                    ? `Option ${letter}...`
                                    : `Option ${letter}...`
                                }
                                value={q.options[optIdx]}
                                onChange={(e) =>
                                  handleOptionChange(qIdx, optIdx, e.target.value)
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1 teacher-input-group">
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-[#785b49] teacher-input-label">
                        {language === 'fr'
                          ? 'Indice facultatif en anglais'
                          : 'Optional English Hint'}
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#a07855]/25 text-xs text-[#4a3324] placeholder-[#a08978] focus:outline-none focus:border-[#c46238] teacher-text-input"
                        placeholder="Ex: Hint: Think about direct object placed before the verb avoir."
                        value={q.hint || ''}
                        onChange={(e) => handleHintChange(qIdx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 teacher-quiz-actions-row">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-[#a07855]/25 bg-[#ede4d7] hover:bg-[#e2d4c0] text-[#4a3324] text-xs font-bold transition-all cursor-pointer disabled:opacity-40 teacher-add-q-btn"
                  onClick={handleAddQuestion}
                  disabled={questions.length >= 10}
                >
                  <Plus size={15} />
                  <span>
                    {language === 'fr'
                      ? `Ajouter une question (${questions.length}/10)`
                      : `Add Question (${questions.length}/10)`}
                  </span>
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c46238] to-[#9e461f] hover:from-[#b9552b] hover:to-[#8c3d1a] text-white text-xs font-bold shadow-md shadow-[#c46238]/20 transition-all cursor-pointer disabled:opacity-50 teacher-submit-btn"
                  disabled={savingQuiz}
                >
                  <CheckCircle size={15} />
                  <span>
                    {savingQuiz
                      ? language === 'fr'
                        ? 'Publication en cours…'
                        : 'Publishing…'
                      : t('publishQuiz')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
