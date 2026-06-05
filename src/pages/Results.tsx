import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Network, ArrowLeft, Hexagon } from 'lucide-react';
import graphData from '../data/hcmg_graph.json';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const state = location.state as any;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/')} className="text-indigo-400 hover:text-indigo-300">
          {t('r.home')}
        </button>
      </div>
    );
  }

  const { topTraits, vectorHash, answers, aiSummary, translatedTraits } = state;

  // Find top categories based on answers
  const categoryScores: Record<string, { total: number, count: number }> = {};
  Object.entries(answers).forEach(([nodeId, val]) => {
    const node = graphData.nodes.find((n: any) => n.id === nodeId);
    if (node) {
      if (!categoryScores[node.category]) {
        categoryScores[node.category] = { total: 0, count: 0 };
      }
      categoryScores[node.category].total += (val as number);
      categoryScores[node.category].count += 1;
    }
  });

  const catAverages = Object.entries(categoryScores)
    .map(([cat, data]) => ({ category: cat, score: data.total / data.count }))
    .sort((a,b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <LanguageSelector />
      
      <button onClick={() => navigate('/')} className="text-neutral-500 hover:text-white flex items-center gap-2 mb-12 transition-colors mt-8">
        <ArrowLeft size={16} /> {t('r.home')}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <Hexagon size={32} />
        </div>
        <div className="inline-block bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono px-4 py-2 rounded-full text-sm mb-6">
          VECTOR ID: <span className="text-white font-semibold">{vectorHash}</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight mb-4">{t('r.title')}</h1>
        <p className="text-neutral-400">{t('r.subtitle')}</p>
      </motion.div>

      {aiSummary && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-800/50 border border-neutral-700/50 rounded-3xl p-8 mb-16 relative overflow-hidden"
        >
          <h2 className="text-xl font-medium tracking-tight mb-4 text-white">{t('r.summary')}</h2>
          <p className="text-neutral-200 leading-relaxed text-lg z-10 relative">
            {aiSummary}
          </p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium tracking-tight mb-6 flex items-center gap-3">
              <Network className="text-indigo-400" size={20} /> {t('r.prominent_traits')}
            </h2>
            <div className="space-y-4">
              {topTraits.map((trait: any, i: number) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center">
                  <div className="text-3xl font-semibold mb-1 text-white">{trait.score}%</div>
                  <div className="text-indigo-400 font-medium mb-2">{translatedTraits?.[trait.name] || trait.name}</div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mt-4">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.score}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
           <h2 className="text-xl font-medium tracking-tight mb-6">{t('r.sectors')}</h2>
           <div className="space-y-5">
              {catAverages.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-neutral-300">{t(`cat.${cat.category}`)}</span>
                    <span className="text-neutral-500 font-mono">Lv {cat.score.toFixed(1)}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.score / 5) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}