import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Layers, Zap, Brain, Lightbulb, Compass, Heart, Activity, GitCommit } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Theory() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen relative flex flex-col items-center pt-24 px-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('r.home')}</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <BookOpen className="text-indigo-400" size={32} />
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {t('theory.title')}
          </h1>
        </div>
        
        <p className="text-xl text-neutral-400 leading-relaxed mb-12">
          {t('theory.intro')}
        </p>

        <div className="space-y-12">
          <Section 
            icon={<Zap />}
            title={t('theory.energy.title')}
            desc={t('theory.energy.desc')}
            color="text-yellow-400"
          />
          <Section 
            icon={<Brain />}
            title={t('theory.information.title')}
            desc={t('theory.information.desc')}
            color="text-blue-400"
          />
          <Section 
            icon={<GitCommit />}
            title={t('theory.reasoning.title')}
            desc={t('theory.reasoning.desc')}
            color="text-purple-400"
          />
          <Section 
            icon={<Compass />}
            title={t('theory.motivation.title')}
            desc={t('theory.motivation.desc')}
            color="text-red-400"
          />
          <Section 
            icon={<Activity />}
            title={t('theory.execution.title')}
            desc={t('theory.execution.desc')}
            color="text-green-400"
          />
          <Section 
            icon={<Heart />}
            title={t('theory.emotion.title')}
            desc={t('theory.emotion.desc')}
            color="text-pink-400"
          />
          <Section 
            icon={<Layers />}
            title={t('theory.meta.title')}
            desc={t('theory.meta.desc')}
            color="text-indigo-400"
          />
        </div>
        
      </motion.div>
    </div>
  );
}

function Section({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800">
      <div className={`mb-4 flex items-center gap-3 ${color}`}>
        {icon}
        <h2 className="text-2xl font-medium text-white">{title}</h2>
      </div>
      <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
        {desc}
      </p>
    </div>
  );
}
