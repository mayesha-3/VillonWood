import React, { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { playSound } from '../utils/soundFX';
import { getTodayUTC, formatDisplayDate } from '../utils/dateUtils';

export interface WordItem {
  french: string;
  english: string;
  example?: string;
}

interface WordsOfTheDayProps {
  reopenToken?: number;
}

export const WordsOfTheDay: React.FC<WordsOfTheDayProps> = ({ reopenToken = 0 }) => {
  const { t, language } = useLanguage();
  const todayUTC = getTodayUTC();
  const sessionKey = `villon_wotd_dismissed_${todayUTC}`;

  const [words, setWords] = useState<WordItem[]>([]);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem(sessionKey) === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reopenToken === 0) return;
    sessionStorage.removeItem(sessionKey);
    setIsDismissed(false);
    setLoading(true);
  }, [reopenToken, sessionKey]);

  useEffect(() => {
    if (isDismissed) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchTodayWords() {
      try {
        const wordsRef = doc(db, 'wordsOfTheDay', todayUTC);
        const snap = await getDoc(wordsRef);

        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data && Array.isArray(data.words) && data.words.length > 0) {
            setWords(data.words);
          }
        }
      } catch (err) {
        console.warn('Failed to load words of the day:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTodayWords();

    return () => {
      isMounted = false;
    };
  }, [todayUTC, isDismissed, reopenToken]);

  const handleDismiss = () => {
    playSound('click');
    sessionStorage.setItem(sessionKey, 'true');
    setIsDismissed(true);
  };

  // If dismissed, loading, or no words published today, don't render anything
  if (isDismissed || loading || words.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-5 left-5 z-40 w-72 rounded-2xl bg-[#faf6f0]/95 backdrop-blur-md border border-[#a07855]/25 shadow-xl shadow-[#4a3324]/10 p-4 font-sans text-[#4a3324] animate-fade-in wotd-card"
      role="region"
      aria-label={t('wordsOfTheDayTitle')}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#a07855]/15 wotd-header">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#c46238]/15 text-[#c46238] flex items-center justify-center wotd-icon-badge">
            <BookOpen size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#4a3324] leading-tight">
              {t('wordsOfTheDayTitle')}
            </h4>
            <span className="text-[10px] text-[#785b49] font-medium wotd-date">
              {formatDisplayDate(todayUTC, language)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[#785b49] hover:text-[#4a3324] hover:bg-[#ede4d7] transition-colors cursor-pointer wotd-close-btn"
          onClick={handleDismiss}
          title={language === 'fr' ? 'Masquer pour cette session' : 'Dismiss for session'}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      {/* Words List */}
      <div className="space-y-2.5 wotd-words-list">
        {words.slice(0, 3).map((w, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2 rounded-xl bg-[#f4eee6]/60 border border-[#a07855]/10 hover:border-[#c46238]/30 transition-colors wotd-word-row"
          >
            <span className="w-5 h-5 rounded-md bg-[#ede3d5] text-[#c46238] text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5 wotd-index-badge">
              {idx + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-xs font-bold text-[#4a3324] truncate wotd-word-french">
                  {w.french}
                </span>
                <span className="text-[11px] text-[#785b49] font-medium truncate text-right wotd-word-english">
                  {w.english}
                </span>
              </div>

              {w.example && (
                <p
                  className="text-[10.5px] text-[#785b49]/90 italic mt-0.5 leading-snug line-clamp-2 wotd-example"
                  title={w.example}
                >
                  « {w.example} »
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordsOfTheDay;
