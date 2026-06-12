import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Options from './pages/Options';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import Theory from './pages/Theory';
import { LanguageProvider } from './i18n/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-indigo-500/30">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/options" element={<Options />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/results" element={<Results />} />
            <Route path="/theory" element={<Theory />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
