import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ja' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'landing.title': 'HCMG - Personality Assessment',
    'landing.subtitle': 'More than a personality test. We map your root drives, reasoning models, and execution patterns into a 225-node mathematical graph.',
    'landing.test_phase': 'This application is currently in the testing phase.',
    'landing.feature1.title': 'Information Architecture',
    'landing.feature1.desc': 'How you process signals, patterns, and ambiguity.',
    'landing.feature2.title': 'Reasoning & Execution',
    'landing.feature2.desc': 'Your mechanisms for logic, adaptation, and discipline.',
    'landing.feature3.title': 'Motivation & Meta-Self',
    'landing.feature3.desc': 'The fundamental core drives that orient your actions.',
    'landing.begin': 'Begin the Mapping',
    'landing.disclaimer': 'No personal data collected. Takes approx 10-15 minutes.',
    'landing.download': 'Download HCMG v1.0 Core Node Graph (JSON)',
    'landing.theory': 'Read the Core Theory',
    'q.sector': 'Mapping Node Sector',
    'q.prev': 'Previous',
    'q.next': 'Next Sector',
    'q.complete': 'Complete Scan',
    'q.processing': 'Processing...',
    'q.low': 'Low',
    'q.avg': 'Avg',
    'q.high': 'High',
    'r.home': 'Home',
    'r.title': 'Topology Generated',
    'r.subtitle': 'Based on your answers, here is your cognitive-motivational profile.',
    'r.archetypes': 'Cognitive Archetypes',
    'r.sectors': 'Dominant Sectors',
    'r.prominent_traits': 'Prominent Traits',
    'r.summary': 'Summary',
    'cat.Energy': 'Energy',
    'cat.Information': 'Information',
    'cat.Reasoning': 'Reasoning',
    'cat.Motivation': 'Motivation',
    'cat.Execution': 'Execution',
    'cat.Emotional Architecture': 'Emotional Architecture',
    'cat.Meta-Self': 'Meta-Self',
    'theory.title': 'The Theoretical Framework',
    'theory.intro': 'The Human Cognitive-Motivational Graph (HCMG) abandons traditional personality taxonomy (like 16-types) in favor of a network topology approach. It measures 7 foundational domains of human operating systems.',
    'theory.energy.title': '1. Energy Architecture',
    'theory.energy.desc': 'How you generate, spend, and recover cognitive and social capacity. Are you deeply recharged by solitude, or animated by group dynamics? This tracks the fundamental battery of your mind.',
    'theory.information.title': '2. Information Processing',
    'theory.information.desc': 'The filters and lenses through which you perceive reality. Whether you detect deep hidden patterns (Pattern Seeking), focus on the grand vision (Big Picture), or obsess over structural inconsistencies (Detail Orientation).',
    'theory.reasoning.title': '3. Reasoning & Logic',
    'theory.reasoning.desc': 'Your internal compiler for decision making. It tracks logical consistency checks, systems-level causality mappings, probabilistic thinking, and mental simulation before action.',
    'theory.motivation.title': '4. Core Motivation',
    'theory.motivation.desc': 'The fundamental core drives orienting your vector. It decomposes your alignment toward Autonomy, Status, Altruism, Mastery, or deep Intellectual Curiosity.',
    'theory.execution.title': '5. Execution Dynamics',
    'theory.execution.desc': 'How intent turns into reality. Measures your capacity for Deep Work, Adaptability when plans fail, structural Planning, Persistence, and absolute Follow-Through over extended timehorizons.',
    'theory.emotion.title': '6. Emotional Architecture',
    'theory.emotion.desc': 'The regulatory layer handling psychological stress, empathy, and resilience. How quickly do you recover from failures, and how do you internally regulate intense environmental friction?',
    'theory.meta.title': '7. Meta-Self & Authenticity',
    'theory.meta.desc': 'The highest level of cognitive abstraction. It measures your Metacognition (observing your own thoughts), Self-Correction speed, and Identity Flexibility—how perfectly aligned your internal identity is across all external environments.'
  },
  ja: {
    'landing.title': 'HCMG - Personality Assessment',
    'landing.subtitle': '単なる性格診断ではありません。あなたの根本的な動機、推論モデル、実行パターンを225ノードの数学的グラフにマッピングします。',
    'landing.test_phase': '※現在テスト段階です',
    'landing.feature1.title': '情報アーキテクチャ',
    'landing.feature1.desc': 'シグナル、パターン、不確実性をどのように処理するか。',
    'landing.feature2.title': '推論と実行',
    'landing.feature2.desc': '論理、適応、そして規律のメカニズム。',
    'landing.feature3.title': '動機とメタ認知',
    'landing.feature3.desc': 'あなたの行動を方向付ける根本的な中核的欲求。',
    'landing.begin': 'マッピングを開始する',
    'landing.disclaimer': '個人情報は収集されません。所要時間は約10〜15分です。',
    'landing.download': 'HCMG v1.0 コアノードグラフ (JSON) をダウンロード',
    'landing.theory': '理論的枠組みを読む',
    'q.sector': 'マッピングノード領域',
    'q.prev': '戻る',
    'q.next': '次の領域へ',
    'q.complete': 'スキャン完了',
    'q.processing': '処理中...',
    'q.low': '全く当てはまらない',
    'q.avg': '普通',
    'q.high': '非常に当てはまる',
    'r.home': 'ホーム',
    'r.title': 'トポロジー生成完了',
    'r.subtitle': '回答に基づき、あなたの中核的な認知・動機プロファイルが生成されました。',
    'r.archetypes': '認知アーキタイプ',
    'r.sectors': '主要セクター',
    'r.prominent_traits': '顕著な特性（トップ3）',
    'r.summary': 'あなたの中核サマリー',
    'cat.Energy': 'エネルギー',
    'cat.Information': '情報処理',
    'cat.Reasoning': '推論・論理',
    'cat.Motivation': '中核的動機',
    'cat.Execution': '実行ダイナミクス',
    'cat.Emotional Architecture': '感情アーキテクチャ',
    'cat.Meta-Self': 'メタ認知・真正性',
    'theory.title': 'HCMG 理論基盤',
    'theory.intro': '人間の認知・動機グラフ（HCMG）は、従来の16タイプのようないわゆる「性格分類」の枠組みを捨て、ネットワークトポロジーのアプローチを採用しています。人間のOS（オペレーティング・システム）の中核となる、7つの基盤となる領域を測定・パラメーター化します。',
    'theory.energy.title': '1. エネルギー・アーキテクチャ',
    'theory.energy.desc': 'あなたがどのように活力を生み出し、消費し、回復するかを示します。一人の時間で精神的なバッテリーを深く充電するのか、それとも集団の中にいることで逆に活力を得るのかなど、心の根本的なエネルギー源을 追跡します。',
    'theory.information.title': '2. 情報処理（Information Processing）',
    'theory.information.desc': '現実を認識するためのフィルターとレンズです。物事の裏にある隠されたパターンを検出したり（パターン探索）、細かいことよりも全体像を見据えたり（大局的思考）、あるいは他の人が見逃すような小さな矛盾やミスに気付く（細部へのこだわり）などの傾向を測定します。',
    'theory.reasoning.title': '3. 推論と論理（Reasoning & Logic）',
    'theory.reasoning.desc': '意思決定を行うための、あなたの中に備わる「内部コンパイラ」です。論理の矛盾を嫌う性質、問題が起きた時に人ではなくシステムの仕組み全体を見る傾向、絶対ではなく確率的なリスク計算を行う思考、行動前の脳内シミュレーションなどを追跡します。',
    'theory.motivation.title': '4. 中核的動機（Core Motivation）',
    'theory.motivation.desc': 'あなたの行動のベクトルを決定づける根本的な欲求です。自由や自立性（Autonomy）、社会的地位（Status）、他者への献身（Altruism）、あるいは純粋な知的好奇心（Curiosity）など、何があなたの心を芯から突き動かすのかを分解します。',
    'theory.execution.title': '5. 実行ダイナミクス（Execution Dynamics）',
    'theory.execution.desc': '思考を現実に変えるためのメカニズムです。長時間の深い集中力（Deep Work）、計画が崩壊した時の適応力、大きな作業を細かく分解する計画性、そして成果が見えない中でも長期間やり抜く泥臭い執念（Persistence）を測定します。',
    'theory.emotion.title': '6. 感情アーキテクチャ（Emotional Architecture）',
    'theory.emotion.desc': '心理的ストレス、共感、回復力を処理するレギュレーション（調整）層です。大きな失敗からどれだけ早く立ち直ることができるか、あるいは他人の痛みに対してどれほど強く身体的な共感を示すのかなど、感情面の仕組みを読み解きます。',
    'theory.meta.title': '7. メタ認知と真正性（Meta-Self & Authenticity）',
    'theory.meta.desc': '最も抽象度の高い認知レベルです。自分自身の思考をまるで他人のように客観視できるか（メタ認知）、激しい議論の中でも自分が間違っていれば即座に訂正できるか（自己修正）、そして「職場」「友人」「一人」の時で自分のキャラクターやアイデンティティに裏表がなく、どれだけ一貫しているか（真正性/Authenticity）を測定します。'
  },
  ko: {
    'landing.title': 'HCMG - Personality Assessment',
    'landing.subtitle': '단순한 성격 테스트가 아닙니다. 당신의 근본적인 동기, 추론 모델, 실행 패턴을 225개 노드의 수학적 그래프로 매핑합니다.',
    'landing.test_phase': '현재 테스트 단계입니다.',
    'landing.feature1.title': '정보 아키텍처',
    'landing.feature1.desc': '신호, 패턴, 불확실성을 처리하는 방식.',
    'landing.feature2.title': '추론 및 실행',
    'landing.feature2.desc': '논리, 적응, 규율에 대한 메커니즘.',
    'landing.feature3.title': '동기 및 메타 자아',
    'landing.feature3.desc': '당신의 행동을 지시하는 근본적인 핵심 욕구.',
    'landing.begin': '매핑 시작하기',
    'landing.disclaimer': '개인 데이터는 수집되지 않습니다. 약 10-15분 소요됩니다.',
    'landing.download': 'HCMG v1.0 코어 노드 그래프 (JSON) 다운로드',
    'landing.theory': '이론적 프레임워크 읽기',
    'q.sector': '매핑 노드 섹터',
    'q.prev': '이전',
    'q.next': '다음 섹터로',
    'q.complete': '분석 완료',
    'q.processing': '처리 중...',
    'q.low': '전혀 아님',
    'q.avg': '보통',
    'q.high': '매우 그렇다',
    'r.home': '홈',
    'r.title': '토폴로지 생성 완료',
    'r.subtitle': '당신의 인지-동기 프로필이 생성되었습니다.',
    'r.archetypes': '인지 아키타입',
    'r.sectors': '주요 섹터',
    'r.prominent_traits': '주요 특성 (상위 3개)',
    'r.summary': '핵심 요약',
    'cat.Energy': '에너지',
    'cat.Information': '정보 처리',
    'cat.Reasoning': '추론 및 논리',
    'cat.Motivation': '핵심 동기',
    'cat.Execution': '실행 다이내믹스',
    'cat.Emotional Architecture': '감정 아키텍처',
    'cat.Meta-Self': '메타 자아',
    'theory.title': 'HCMG 이론적 프레임워크',
    'theory.intro': '인간 인지-동기 그래프(HCMG)는 기존의 16가지 성격 유형과 같은 분류법을 버리고 네트워크 토폴로지 접근 방식을 채택합니다. 인간 운영 체제의 7가지 핵심 영역을 깊이 있게 측정합니다.',
    'theory.energy.title': '1. 에너지 아키텍처',
    'theory.energy.desc': '인지적, 사회적 용량을 생성하고 소비하며 회복하는 방식입니다. 혼자만의 시간으로 재충전하는지, 아니면 집단 속에서 에너지를 얻는지 등 마음의 근본적인 배터리를 추적합니다.',
    'theory.information.title': '2. 정보 처리',
    'theory.information.desc': '현실을 인식하는 필터와 렌즈입니다. 숨겨진 패턴을 찾는 것, 큰 비전에 집중하는 것, 혹은 다른 사람들이 놓치는 미세한 모순에 집착하는 성향 등을 측정합니다.',
    'theory.reasoning.title': '3. 추론과 논리',
    'theory.reasoning.desc': '의사결정을 위한 내부 컴파일러입니다. 논리적 일관성 확보 확인, 당면한 문제가 아닌 시스템적 원인 분석, 확률적 사고, 행동 전 뇌내 시뮬레이션 과정을 추적합니다.',
    'theory.motivation.title': '4. 핵심 동기',
    'theory.motivation.desc': '당신의 행동 벡터를 결정짓는 근본적인 욕구입니다. 자율성, 사회적 지위, 이타주의, 완벽한 숙련도 또는 순수한 지적 호기심 쪽으로 당신의 방향성이 어떻게 맞춰져 있는지 분석합니다.',
    'theory.execution.title': '5. 실행 다이내믹스',
    'theory.execution.desc': '생각을 현실로 바꾸는 매커니즘. 4시간 이상의 깊은 몰입(Deep Work), 계획이 실패했을 때의 즉각적 전환, 치밀한 계획력, 그리고 결과가 보이지 않아도 수년간 지속하는 집념을 측정합니다.',
    'theory.emotion.title': '6. 감정 아키텍처',
    'theory.emotion.desc': '심리적 스트레스, 공감, 회복 탄력성을 처리하는 조절 계층입니다. 커다란 실패로부터 얼마나 빨리 회복하는지, 타인의 고통에 얼마나 깊이 육체적으로 공감하는지를 분석합니다.',
    'theory.meta.title': '7. 메타 자아 및 진정성',
    'theory.meta.desc': '가장 추상적인 인지 수준입니다. 본인의 생각을 제3자처럼 관찰하는 메타인지, 치열한 논쟁 중에도 틀림을 시인하는 자기 교정 속도, 그리고 환경에 상관없이 내외적 정체성이 얼마나 완벽하게 일치하는지를 파악합니다.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
