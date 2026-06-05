import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../i18n/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const options: { val: Language, label: string }[] = [
    { val: 'en', label: 'English' },
    { val: 'ja', label: '日本語' },
    { val: 'ko', label: '한국어' }
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative">
        <button 
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white px-4 py-2 rounded-full transition-colors text-sm"
        >
          <Globe size={16} />
          {options.find(o => o.val === language)?.label}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-32 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => {
                    setLanguage(opt.val);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                    language === opt.val ? 'bg-indigo-500/10 text-indigo-400' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
