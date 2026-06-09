import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import graphData from '../data/hcmg_graph.json';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function Questionnaire() {
  const topRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Select nodes for the assessment among those that have exact customized questions
  const questions = useMemo(() => {
    const children = graphData.nodes.filter((n: any) => n.tier === 2);
    // Filter to only include nodes that explicitly have custom questions defined in our generated JSON graph
    const supportedChildren = children.filter((n: any) => n.question && n.question.en && n.question.ja && n.question.ko && n.question.zh && n.question.th);
    
    // shuffle and take 60
    const shuffled = [...supportedChildren].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 60);
  }, []);

  const [page, setPage] = useState(0);
  const QUESTIONS_PER_PAGE = 10;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  
  // Scroll to top when page changes
  useEffect(() => {
    // Timeout ensures scroll happens after AnimatePresence mode="popLayout" layout changes
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }, 50);
  }, [page]);

  const currentQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);

  const handleAnswer = (id: string, value: number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const isPageComplete = currentQuestions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(p => p + 1);
    } else {
      submitData();
    }
  };

  const submitData = async () => {
    setIsSubmitting(true);
    try {
      // Find top 3 individual traits (node names) with highest scores (val)
      const traitScores = Object.entries(answers).map(([nodeId, val]) => {
        const node = graphData.nodes.find((n: any) => n.id === nodeId);
        return { name: node ? node.name : nodeId, score: (val as number) * 20 }; // scale 1-5 to 20-100%
      });
      const topTraits = traitScores.sort((a,b) => b.score - a.score).slice(0, 3);

      // Generate a deterministic hash based on answers
      let hashSum = 0;
      Object.keys(answers).forEach((key, index) => {
        hashSum += (answers[key] as number) * (index + 1);
      });
      const hexStr = hashSum.toString(16).toUpperCase().padStart(4, '0');
      const prefix = topTraits[0]?.name.substring(0, 2).toUpperCase() || 'XX';
      const vectorHash = `HCMG-${prefix}-${hexStr}`;

      let aiSummaries: Record<string, string> = {};
      let translatedTraitsMap: Record<string, Record<string, string>> = {};
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        try {
          const analyzeRes = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topTraits })
          });
          if (analyzeRes.ok) {
            const analyzeData = await analyzeRes.json();
            if (typeof analyzeData.result === 'object') {
               aiSummaries = analyzeData.result.summaries || {};
               translatedTraitsMap = analyzeData.result.translatedTraits || {};
            }
            success = true;
          } else {
             console.warn('Analysis failed with status', analyzeRes.status);
             attempts++;
             if (attempts < 3) await new Promise(r => setTimeout(r, 1000 * attempts));
          }
        } catch (err) {
          console.warn('AI analysis fell back:', err);
          attempts++;
          if (attempts < 3) await new Promise(r => setTimeout(r, 1000 * attempts));
        }
      }

      // Final fallback if the model completely fails due to high demand (503)
      if (Object.keys(aiSummaries).length === 0) {
        aiSummaries = {
          en: "Our AI is currently experiencing high demand and could not generate a summary at this moment. You are characterized by strong autonomy and a desire to forge your own path.",
          ja: "現在AIにアクセスが集中しており、サマリーを生成できませんでした。結果としては、あなたの中核には強い独立心と自律性があります。",
          ko: "현재 AI 수요가 많아 요약을 생성하지 못했습니다. 당신의 핵심 동기는 자율성과 독립성입니다.",
          zh: "由于目前人工智能请求过多，无法生成总结。您具有很强的自主性和独立思考能力。",
          th: "ขณะนี้ AI มีผู้ใช้งานเป็นจำนวนมาก จึงไม่สามารถสร้างบทสรุปได้"
        };
      }

      const responseDoc = {
        answers,
        topTraits,
        vectorHash,
        aiSummaries,
        translatedTraitsMap,
        version: "1.1-multilingual-summary"
      };
      
      let docId = null;
      try {
        const saveRes = await fetch('/api/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(responseDoc)
        });
        if (saveRes.ok) {
          const resMap = await saveRes.json();
          docId = resMap.id;
        } else {
          console.warn('Failed to save to database');
        }
      } catch (dbErr) {
        console.warn('DB error silently ignored:', dbErr);
      }
      
      if (docId) {
        navigate(`/results/${docId}`, { state: { topTraits, vectorHash, answers, aiSummaries, translatedTraitsMap } });
      } else {
        navigate('/results', { state: { topTraits, vectorHash, answers, aiSummaries, translatedTraitsMap } });
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={topRef} className="max-w-3xl mx-auto px-6 py-16">
      <LanguageSelector />
      <div className="mb-12 mt-12">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-medium tracking-tight">{t('q.sector')} {page + 1}</h2>
          <span className="text-neutral-500 font-mono text-sm">{page + 1} / {totalPages}</span>
        </div>
        <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${((page + 1) / totalPages) * 100}%` }}
            transition={{ ease: "circOut" }}
          />
        </div>
      </div>

      <div className="space-y-12 mb-16">
        <AnimatePresence mode="popLayout">
          {currentQuestions.map((q: any, idx: number) => {
            const displayQuestion = q.question && q.question[language] 
                ? q.question[language] 
                : q.definition;

            return (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-neutral-900/30 border border-neutral-800/50 p-6 md:p-8 rounded-3xl"
            >
              <div className="mb-6">
                <div className="text-xs font-mono text-indigo-400 mb-2 uppercase tracking-wider">{q.category} &rsaquo; {q.name}</div>
                <h3 className="text-xl md:text-2xl font-medium mb-2 leading-relaxed">{displayQuestion}</h3>
              </div>
              
              <div className="grid grid-cols-5 gap-2 md:gap-4 font-mono text-xs text-center">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`p-4 rounded-xl border transition-all ${
                      answers[q.id] === val 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                        : 'border-neutral-800 hover:border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="text-lg font-sans mb-1">{val}</div>
                    <div className="hidden md:block opacity-50 px-1">
                      {val === 1 && t('q.low')}
                      {val === 3 && t('q.avg')}
                      {val === 5 && t('q.high')}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center pb-24 border-t border-neutral-900 pt-8">
        <button 
          onClick={() => {
            if (page > 0) {
              setPage(p => p - 1);
            }
          }}
          disabled={page === 0 || isSubmitting}
          className="text-neutral-500 hover:text-white disabled:opacity-30 transition-colors py-2 px-4"
        >
          {t('q.prev')}
        </button>

        <button 
          onClick={handleNext}
          disabled={!isPageComplete || isSubmitting}
          className="bg-white text-black px-8 py-3 rounded-full font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isSubmitting ? t('q.processing') : page === totalPages - 1 ? t('q.complete') : t('q.next')}
        </button>
      </div>
    </div>
  );
}
