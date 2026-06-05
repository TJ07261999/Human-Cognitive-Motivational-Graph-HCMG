import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrainCircuit, FunctionSquare, Network, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative flex flex-col items-center pt-24 px-6">
      <LanguageSelector />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl text-center"
      >
        <div className="h-20 w-20 bg-indigo-500/10 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
          <Network size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
          {t('landing.title')}
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('landing.subtitle')}
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-16 text-left">
          <Feature icon={<BrainCircuit />} title={t('landing.feature1.title')} desc={t('landing.feature1.desc')} />
          <Feature icon={<FunctionSquare />} title={t('landing.feature2.title')} desc={t('landing.feature2.desc')} />
          <Feature icon={<Network />} title={t('landing.feature3.title')} desc={t('landing.feature3.desc')} />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button 
            onClick={() => navigate('/questionnaire')}
            className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span>{t('landing.begin')}</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          
          <button 
            onClick={() => navigate('/theory')}
            className="group relative inline-flex items-center gap-3 bg-neutral-900 text-white border border-neutral-800 px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-colors hover:bg-neutral-800 active:scale-95"
          >
            <span>{t('landing.theory')}</span>
          </button>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-neutral-500 text-sm">
            {t('landing.disclaimer')}
          </p>
          <a href="/hcmg_graph.json" download className="text-indigo-500/80 text-sm hover:text-indigo-400 hover:underline transition-colors mt-2">
            {t('landing.download')}
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
