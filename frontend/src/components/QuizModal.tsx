import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Award
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { playSound } from '../utils/soundFX';
import { getWeekIdUTC, isMondayUTC } from '../utils/dateUtils';
import type { QuizQuestionItem } from './TeacherDashboard';

export interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnswerRecord {
  questionIndex: number;
  questionText: string;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
}

interface QuizSubmissionData {
  weekId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: AnswerRecord[];
  submittedAt?: any;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const currentWeekId = getWeekIdUTC();
  const isQuizDay = isMondayUTC();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionItem[]>([]);
  const [userSubmission, setUserSubmission] = useState<QuizSubmissionData | null>(null);

  // Active quiz taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setValidationError(null);
    setShowHint(false);
    setCurrentIndex(0);
    setSelectedAnswers({});

    if (!isQuizDay) {
      setQuizQuestions([]);
      setUserSubmission(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    async function loadQuizAndSubmission() {
      try {
        // 1. Fetch current week's quiz
        const quizRef = doc(db, 'quizzes', currentWeekId);
        const quizSnap = await getDoc(quizRef);

        let questions: QuizQuestionItem[] = [];
        if (quizSnap.exists()) {
          const data = quizSnap.data();
          if (data && Array.isArray(data.questions)) {
            questions = data.questions;
          }
        }

        if (isMounted) {
          setQuizQuestions(questions);
        }

        // 2. Fetch user's previous submission if logged in
        if (user) {
          // Check flat document path
          const subRef1 = doc(db, 'quizResults', `${currentWeekId}_${user.uid}`);
          let subSnap = await getDoc(subRef1);

          // Fallback to subcollection path if flat doesn't exist
          if (!subSnap.exists()) {
            const subRef2 = doc(db, 'quizResults', currentWeekId, 'submissions', user.uid);
            subSnap = await getDoc(subRef2);
          }

          if (subSnap.exists() && isMounted) {
            const subData = subSnap.data() as QuizSubmissionData;
            setUserSubmission(subData);
          } else if (isMounted) {
            setUserSubmission(null);
          }
        }
      } catch (err) {
        console.error('Failed to load quiz modal data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuizAndSubmission();

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentWeekId, user, isQuizDay]);

  if (!isOpen) return null;

  const handleSelectOption = (optIdx: number) => {
    playSound('click');
    setValidationError(null);
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[currentIndex] === undefined) {
      setValidationError(
        language === 'fr'
          ? 'Veuillez choisir une réponse avant de continuer.'
          : 'Please select an answer before continuing.'
      );
      return;
    }
    playSound('click');
    setShowHint(false);
    setValidationError(null);
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playSound('click');
    setShowHint(false);
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (selectedAnswers[currentIndex] === undefined) {
      setValidationError(
        language === 'fr'
          ? 'Veuillez choisir une réponse pour cette question.'
          : 'Please select an answer for this question.'
      );
      return;
    }

    // Verify all questions answered
    for (let i = 0; i < quizQuestions.length; i++) {
      if (selectedAnswers[i] === undefined) {
        setValidationError(
          language === 'fr'
            ? `Vous n'avez pas répondu à la Question ${i + 1}.`
            : `You have not answered Question ${i + 1}.`
        );
        setCurrentIndex(i);
        return;
      }
    }

    setSubmitting(true);
    playSound('click');

    try {
      let score = 0;
      const answers: AnswerRecord[] = quizQuestions.map((q, idx) => {
        const selected = selectedAnswers[idx];
        const isCorrect = selected === q.correctAnswer;
        if (isCorrect) score += 1;
        return {
          questionIndex: idx,
          questionText: q.question,
          selectedOption: selected,
          correctOption: q.correctAnswer,
          isCorrect
        };
      });

      const total = quizQuestions.length;
      const percentage = Math.round((score / total) * 100);

      const submissionPayload: QuizSubmissionData = {
        weekId: currentWeekId,
        score,
        totalQuestions: total,
        percentage,
        answers,
        submittedAt: Timestamp.now()
      };

      if (user) {
        // Store in both paths to ensure resilience
        const docRef1 = doc(db, 'quizResults', `${currentWeekId}_${user.uid}`);
        const docRef2 = doc(db, 'quizResults', currentWeekId, 'submissions', user.uid);

        const storeData = {
          ...submissionPayload,
          userId: user.uid,
          userEmail: user.email || '',
          userName: user.displayName || user.email || 'Apprenant'
        };

        await Promise.all([
          setDoc(docRef1, storeData),
          setDoc(docRef2, storeData)
        ]);
      }

      setUserSubmission(submissionPayload);
    } catch (err) {
      console.error('Failed to submit quiz answers:', err);
      setValidationError(
        language === 'fr'
          ? 'Erreur lors de l’envoi de vos réponses. Veuillez réessayer.'
          : 'Error submitting your answers. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  const currentQ = quizQuestions[currentIndex];
  const progressPercent =
    quizQuestions.length > 0
      ? Math.round(((currentIndex + 1) / quizQuestions.length) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a3324]/40 backdrop-blur-xs font-sans animate-fade-in quiz-modal-overlay"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-2xl bg-[#faf6f0] border border-[#a07855]/25 shadow-2xl shadow-[#4a3324]/15 overflow-hidden flex flex-col max-h-[92vh] quiz-card">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#a07855]/15 bg-[#f4eee6]/80 quiz-modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#c46238]/15 text-[#c46238] flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#4a3324] leading-tight">
                {t('weeklyQuizTitle')}
              </h3>
              <span className="text-[11px] text-[#785b49] font-medium">
                {language === 'fr'
                  ? `Session officielle • Semaine ${currentWeekId}`
                  : `Official Session • Week ${currentWeekId}`}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#785b49] hover:text-[#4a3324] hover:bg-[#ede4d7] transition-colors cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 quiz-modal-body">
          {!isQuizDay ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#ede3d5] text-[#c46238] flex items-center justify-center">
                <GraduationCap size={28} />
              </div>
              <h4 className="text-base font-bold text-[#4a3324]">
                {language === 'fr' ? 'Le quiz ouvre le lundi (UTC)' : 'Weekly quiz opens on Mondays (UTC)'}
              </h4>
              <p className="text-xs text-[#785b49] max-w-sm leading-relaxed">
                {language === 'fr'
                  ? 'Revenez lundi pour répondre aux questions de votre enseignant.'
                  : 'Come back on Monday to answer your teacher’s questions.'}
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-9 h-9 rounded-full border-3 border-[#c46238] border-t-transparent animate-spin" />
              <p className="text-xs text-[#785b49] font-medium">
                {language === 'fr'
                  ? 'Chargement du quiz en cours…'
                  : 'Loading weekly quiz…'}
              </p>
            </div>
          ) : quizQuestions.length === 0 ? (
            /* Empty State: No Quiz Available */
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#ede3d5] text-[#c46238] flex items-center justify-center">
                <GraduationCap size={28} />
              </div>
              <h4 className="text-base font-bold text-[#4a3324]">
                {language === 'fr'
                  ? 'Aucun quiz disponible cette semaine'
                  : 'No quiz available this week'}
              </h4>
              <p className="text-xs text-[#785b49] max-w-sm leading-relaxed">
                {language === 'fr'
                  ? `L’enseignant du village n’a pas encore publié le quiz pour la semaine ${currentWeekId}. Revenez un peu plus tard !`
                  : `The village teacher has not published the quiz for week ${currentWeekId} yet. Please check back later!`}
              </p>
              <button
                type="button"
                className="mt-2 px-5 py-2 rounded-xl bg-[#c46238] hover:bg-[#b9552b] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                onClick={handleClose}
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          ) : userSubmission ? (
            /* Score Card Review View */
            <div className="space-y-5 animate-fade-in quiz-score-card">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-[#f4eee6] to-[#ede3d5] border border-[#a07855]/20 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#c46238] text-white flex items-center justify-center shadow-md shadow-[#c46238]/30">
                  <Award size={26} />
                </div>
                <h4 className="text-lg font-extrabold text-[#4a3324]">
                  {language === 'fr'
                    ? 'Résultats de votre Quiz'
                    : 'Your Quiz Results'}
                </h4>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-black text-[#c46238]">
                    {userSubmission.score} / {userSubmission.totalQuestions}
                  </span>
                  <span className="text-sm font-bold text-[#785b49]">
                    ({userSubmission.percentage}%)
                  </span>
                </div>
                <p className="text-xs text-[#785b49] max-w-md">
                  {userSubmission.percentage === 100
                    ? language === 'fr'
                      ? 'Score parfait ! Vous maîtrisez parfaitement les leçons de la semaine.'
                      : 'Perfect score! You mastered this week’s lessons.'
                    : userSubmission.percentage >= 70
                    ? language === 'fr'
                      ? 'Félicitations ! Très bon résultat, continuez ainsi !'
                      : 'Congratulations! Very strong result, keep it up!'
                    : language === 'fr'
                    ? 'Bon effort ! Continuez à pratiquer avec les villageois pour progresser.'
                    : 'Good effort! Keep practicing with the villagers to improve.'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/15 text-[#166534] text-[11px] font-semibold mt-1">
                  <CheckCircle size={13} />
                  <span>
                    {language === 'fr'
                      ? 'Quiz déjà complété pour cette semaine'
                      : 'Quiz already completed for this week'}
                  </span>
                </div>
              </div>

              {/* Answers Breakdown */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#785b49]">
                  {language === 'fr'
                    ? 'Détail de vos réponses :'
                    : 'Answers Breakdown:'}
                </h5>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {userSubmission.answers.map((ans, idx) => {
                    const qObj = quizQuestions[ans.questionIndex] || quizQuestions[idx];
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          ans.isCorrect
                            ? 'bg-[#22c55e]/5 border-[#22c55e]/30'
                            : 'bg-red-500/5 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[#4a3324]">
                            {idx + 1}. {ans.questionText || qObj?.question}
                          </span>
                          <span
                            className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ans.isCorrect
                                ? 'bg-[#22c55e]/20 text-[#166534]'
                                : 'bg-red-500/20 text-red-700'
                            }`}
                          >
                            {ans.isCorrect
                              ? language === 'fr'
                                ? 'Correct'
                                : 'Correct'
                              : language === 'fr'
                              ? 'Incorrect'
                              : 'Incorrect'}
                          </span>
                        </div>

                        {qObj && (
                          <div className="text-[11px] space-y-0.5 pt-1 text-[#785b49]">
                            <div>
                              <span className="font-semibold text-[#4a3324]">
                                {language === 'fr'
                                  ? 'Votre réponse : '
                                  : 'Your answer: '}
                              </span>
                              <span>
                                {ans.selectedOption >= 0
                                  ? qObj.options[ans.selectedOption]
                                  : '—'}
                              </span>
                            </div>
                            {!ans.isCorrect && (
                              <div className="text-[#166534] font-medium">
                                <span className="font-semibold">
                                  {language === 'fr'
                                    ? 'Bonne réponse : '
                                    : 'Correct answer: '}
                                </span>
                                <span>{qObj.options[ans.correctOption]}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-[#c46238] hover:bg-[#b9552b] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  onClick={handleClose}
                >
                  {language === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            /* Active Quiz Taking View */
            <div className="space-y-5 animate-fade-in">
              {/* Progress Bar & Question Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#785b49]">
                  <span>
                    {language === 'fr'
                      ? `Question ${currentIndex + 1} sur ${quizQuestions.length}`
                      : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#ede3d5] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d97736] to-[#c46238] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  <AlertCircle size={15} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Question Statement */}
              <div className="p-4 rounded-xl bg-[#f4eee6]/80 border border-[#a07855]/15 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c46238]">
                  {language === 'fr' ? 'Énoncé' : 'Question'}
                </span>
                <h4 className="text-sm font-bold text-[#4a3324] leading-relaxed">
                  {currentQ.question}
                </h4>

                {/* Optional Hint Accordion */}
                {currentQ.hint && (
                  <div className="pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#c46238] hover:underline cursor-pointer"
                      onClick={() => setShowHint((prev) => !prev)}
                    >
                      <HelpCircle size={13} />
                      <span>
                        {showHint
                          ? language === 'fr'
                            ? 'Masquer l’indice'
                            : 'Hide Hint'
                          : language === 'fr'
                          ? 'Afficher l’indice'
                          : 'Show Hint'}
                      </span>
                    </button>
                    {showHint && (
                      <div className="mt-1.5 p-2.5 rounded-lg bg-[#ede3d5]/70 border border-[#a07855]/20 text-[11.5px] text-[#4a3324] italic">
                        {currentQ.hint}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4 Radio Options */}
              <div className="space-y-2.5 quiz-options-container">
                {(['A', 'B', 'C', 'D'] as const).map((letter, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const optionText = currentQ.options[optIdx];
                  return (
                    <button
                      key={letter}
                      type="button"
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer quiz-option ${
                        isSelected
                          ? 'bg-[#c46238]/15 border-[#c46238] shadow-sm shadow-[#c46238]/10'
                          : 'bg-[#faf6f0] border-[#a07855]/20 hover:border-[#a07855]/40 hover:bg-[#f4eee6]/60'
                      }`}
                      onClick={() => handleSelectOption(optIdx)}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#c46238] text-white'
                            : 'bg-[#ede3d5] text-[#4a3324]'
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-xs font-medium text-[#4a3324] flex-1">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#a07855]/15 quiz-modal-footer">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#a07855]/25 bg-[#ede4d7] hover:bg-[#e2d4c0] text-[#4a3324] text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft size={14} />
                  <span>{language === 'fr' ? 'Précédent' : 'Previous'}</span>
                </button>

                {currentIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#c46238] hover:bg-[#b9552b] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    onClick={handleNext}
                  >
                    <span>{language === 'fr' ? 'Suivant' : 'Next'}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-[#c46238] to-[#9e461f] hover:from-[#b9552b] hover:to-[#8c3d1a] text-white text-xs font-bold shadow-md shadow-[#c46238]/25 transition-all cursor-pointer disabled:opacity-50"
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                  >
                    <CheckCircle size={15} />
                    <span>
                      {submitting
                        ? language === 'fr'
                          ? 'Envoi en cours…'
                          : 'Submitting…'
                        : language === 'fr'
                        ? 'Terminer & Soumettre'
                        : 'Submit Quiz'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
