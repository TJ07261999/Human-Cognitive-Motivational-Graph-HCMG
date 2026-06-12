import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Options() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showWeakness, setShowWeakness] = useState(true);

  const handleStart = () => {
    sessionStorage.setItem('showWeakness', String(showWeakness));
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8"
      >
        <div className="h-16 w-16 bg-neutral-800 text-neutral-300 rounded-2xl flex items-center justify-center mb-6">
          <Settings2 size={32} />
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">{t('options.title')}</h2>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          {t('options.desc')}
        </p>

        <div className="flex flex-col gap-3 mb-10">
          <button
            onClick={() => setShowWeakness(true)}
            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-colors ${
              showWeakness 
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-100' 
                : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${showWeakness ? 'border-indigo-400' : 'border-neutral-500'}`}>
              {showWeakness && <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />}
            </div>
            <span className="font-medium">{t('options.show_weakness')}</span>
          </button>
          
          <button
            onClick={() => setShowWeakness(false)}
            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-colors ${
              !showWeakness 
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-100' 
                : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${!showWeakness ? 'border-indigo-400' : 'border-neutral-500'}`}>
              {!showWeakness && <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />}
            </div>
            <span className="font-medium">{t('options.hide_weakness')}</span>
          </button>
        </div>

        <button 
          onClick={handleStart}
          className="w-full group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{t('options.start')}</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </motion.div>
    </div>
  );
}
