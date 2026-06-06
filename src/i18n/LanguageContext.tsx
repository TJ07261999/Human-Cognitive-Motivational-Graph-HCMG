import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja' | 'ko';

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  en: {
    'landing.title': 'Human Cognitive & Motivational Graph',
    'landing.subtitle': 'Map the underlying topology of your reasoning, execution, and meaning-making structures.',
    'landing.start': 'Begin Assessment',
    'landing.theory': 'Read the Research Theory',
    'q.sector': 'Sector',
    'q.prev': 'Previous',
    'q.next': 'Next',
    'q.complete': 'Complete Scan',
    'q.processing': 'Processing...',
    'q.low': 'Low',
    'q.avg': 'Avg',
    'q.high': 'High',
    'r.home': 'Home',
    'r.not_found_title': '404 - Not Found',
    'r.not_found_desc_1': 'No results found.',
    'r.not_found_desc_2': 'Please ensure the sharing URL (e.g., /results/xxxxxxxx) is correct.',
    'r.not_found_desc_3': 'If the data failed to save to the database, the sharing link will not be generated.',
    'r.title': 'Topology Generated',
    'r.subtitle': 'Based on your answers, here is your cognitive-motivational profile.',
    'r.archetypes': 'Cognitive Archetypes',
    'r.sectors': 'Dominant Sectors',
    'r.prominent_traits': 'Prominent Traits',
    'r.summary': 'Analysis Engine Summary',
    'cat.Meaning / Purpose': 'Meaning / Purpose',
    'cat.Execution / Output': 'Execution / Output',
    'cat.Intake / Processing': 'Intake / Processing',
    'cat.Social / Relational': 'Social / Relational',
    'theory.title': 'Theoretical Foundation',
    'theory.subtitle': 'The architecture of intrinsic human drives.',
    'theory.p1': 'The Human Cognitive & Motivational Graph (HCMG) maps the invisible topology of human purpose. Rather than categorizing personalities into static boxes, it views traits as a dynamic network of interconnected nodes.',
    'theory.p2': 'Each node represents a distinct source of motivation or cognitive process ranging from Execution (how you act) to Processing (how you understand) and Meaning (why you care).',
    'theory.p3': 'By analyzing the resonance across this network, we can identify your vector an emergent directionality that dictates where you naturally derive energy and where you encounter friction.'
  },
  ja: {
    'landing.title': '人間の認知・動機グラフ',
    'landing.subtitle': 'あなたの思考、実行、および意味づけ構造の根底にあるトポロジーをマッピングします。',
    'landing.start': 'スキャンを開始する',
    'landing.theory': '研究理論を読む',
    'q.sector': 'セクター',
    'q.prev': '戻る',
    'q.next': '次へ',
    'q.complete': 'スキャン完了',
    'q.processing': '処理中...',
    'q.low': '全く当てはまらない',
    'q.avg': '普通',
    'q.high': '非常に当てはまる',
    'r.home': 'ホーム',
    'r.not_found_title': '404 - Not Found',
    'r.not_found_desc_1': '結果データが見つかりませんでした。',
    'r.not_found_desc_2': '正しい共有URL（例: /results/xxxxxxxx）であるか確認してください。',
    'r.not_found_desc_3': 'データベースへの保存に失敗した場合、共有リンクは生成されません。',
    'r.title': 'トポロジー生成完了',
    'r.subtitle': '回答に基づき、あなたの中核的な認知・動機プロファイルが生成されました。',
    'r.archetypes': '認知アーキタイプ',
    'r.sectors': '主要セクター',
    'r.prominent_traits': '顕著な特性（トップ3）',
    'r.summary': 'AI分析サマリー',
    'cat.Meaning / Purpose': '意味・目的',
    'cat.Execution / Output': '実行・出力',
    'cat.Intake / Processing': '処理・入力',
    'cat.Social / Relational': '社会的・関係的',
    'theory.title': '理論的基礎',
    'theory.subtitle': '人間の根源的な動機づけのアーキテクチャ',
    'theory.p1': 'Human Cognitive & Motivational Graph (HCMG) は、人間の目的の目に見えないトポロジーをマッピングします。性格を静的な箱に分類するのではなく、特性を相互接続されたノードの動的なネットワークとして捉えます。',
    'theory.p2': '各ノードは、実行(どのように行動するか)、処理(どのように理解するか)、意味(なぜ気にかけるのか)に至るまで、明確な動機の源や認知プロセスを表しています。',
    'theory.p3': 'このネットワーク全体の共鳴を分析することで、私達はあなたの「ベクトル」を特定することができます。これは、あなたが自然にエネルギーを得る場所と、摩擦に遭遇する場所を示す創発的な方向性です。'
  },
  ko: {
    'landing.title': '인간 인지·동기 그래프',
    'landing.subtitle': '당신의 추론, 실행, 그리고 의미 부여 구조의 기저에 있는 토폴로지를 매핑합니다.',
    'landing.start': '스캔 시작하기',
    'landing.theory': '연구 이론 읽기',
    'q.sector': '섹터',
    'q.prev': '이전',
    'q.next': '다음',
    'q.complete': '분석 완료',
    'q.processing': '처리 중...',
    'q.low': '전혀 아님',
    'q.avg': '보통',
    'q.high': '매우 그렇다',
    'r.home': '홈',
    'r.not_found_title': '404 - Not Found',
    'r.not_found_desc_1': '결과 데이터를 찾을 수 없습니다.',
    'r.not_found_desc_2': '올바른 공유 URL(예: /results/xxxxxxxx)인지 확인하세요.',
    'r.not_found_desc_3': '데이터베이스 저장에 실패한 경우 공유 링크가 생성되지 않습니다.',
    'r.title': '토폴로지 생성 완료',
    'r.subtitle': '당신의 인지-동기 프로필이 생성되었습니다.',
    'r.archetypes': '인지 아키타입',
    'r.sectors': '주요 섹터',
    'r.prominent_traits': '주요 특성 (상위 3개)',
    'r.summary': 'AI 분석 사이트',
    'cat.Meaning / Purpose': '의미 / 목적',
    'cat.Execution / Output': '실행 / 출력',
    'cat.Intake / Processing': '입력 / 처리',
    'cat.Social / Relational': '사회 / 관계적',
    'theory.title': '이론적 기초',
    'theory.subtitle': '인간의 본질적 동기부여의 아키텍처',
    'theory.p1': '인간 인지·동기 그래프(HCMG)는 인간 목적의 보이지 않는 토폴로지를 매핑합니다. 성격을 정적인 상자에 분류하는 대신, 특성을 상호 연결된 노드의 동적인 네트워크로 봅니다.',
    'theory.p2': '각 노드는 실행(어떻게 행동하는가)에서 처리(어떻게 이해하는가), 그리고 의미(왜 신경쓰는가)에 이르는 명확한 동기 부여의 근원이나 인지 과정을 나타냅니다.',
    'theory.p3': '이 네트워크 전체의 공명을 분석함으로써 우리는 당신의 "벡터"를 식별할 수 있습니다. 이는 당신이 자연스럽게 에너지를 얻는 곳과 마찰에 부딪히는 곳을 알려주는 창발적 방향성입니다.'
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load saved preference on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('hcmg-lang');
    if (saved && ['en', 'ja', 'ko'].includes(saved)) {
      setLanguage(saved as Language);
    } else {
      const userLang = navigator.language;
      if (userLang.startsWith('ja')) setLanguage('ja');
      else if (userLang.startsWith('ko')) setLanguage('ko');
      else setLanguage('en');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('hcmg-lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
