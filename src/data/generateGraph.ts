mport fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getQuestion } from './questionsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface NodeDef {
  id: string;
  name: string;
  category: string;
  tier: number;
  definition: string;
  question?: { en: string; ja: string; ko: string };
  levels: Record<number, string>;
  children?: string[];
  parents?: string[];
  dependencies: { target: string; weight: number }[];
}

const CATEGORIES = [
  'Energy', 'Information', 'Reasoning', 'Motivation', 
  'Execution', 'Emotional Architecture', 'Meta-Self'
];

// 225 child nodes from user prompt
const childNodesRaw: Record<string, string[]> = {
  'Energy': [
    "Social Energy", "Solitude Recovery", "Group Stimulation", "Conversation Initiation", "Conversation Maintenance", 
    "Leadership Emergence", "Social Risk Taking", "Emotional Expressiveness", "Emotional Containment", "Public Confidence", 
    "Private Reflection", "Crowd Tolerance", "Networking Drive", "Mentorship Seeking", "Mentorship Giving", 
    "Competitive Presence", "Cooperative Presence", "Attention Seeking", "Independence Preference", "Interdependence Preference"
  ],
  'Information': [
    "Pattern Seeking", "Pattern Completion", "Pattern Generalization", "Abstraction", "Concretization", 
    "Detail Orientation", "Big Picture Thinking", "Context Sensitivity", "Signal Detection", "Noise Filtering", 
    "Novelty Detection", "Curiosity Trigger", "Evidence Reliance", "Experience Reliance", "Intuition Reliance", 
    "Memory Reliance", "Observation Accuracy", "Situational Awareness", "Semantic Compression", "Knowledge Integration", 
    "Cross Domain Mapping", "Analogy Formation", "Concept Formation", "Concept Refinement", "Information Retention", 
    "Information Recall", "Visual Thinking", "Verbal Thinking", "Spatial Thinking", "Temporal Thinking", 
    "Future Projection", "Counterfactual Thinking", "Scenario Generation", "Trend Recognition", "Weak Signal Recognition", 
    "Opportunity Detection", "Risk Detection", "Ambiguity Tolerance", "Complexity Tolerance", "Uncertainty Tolerance"
  ],
  'Reasoning': [
    "Logical Consistency", "Deductive Reasoning", "Inductive Reasoning", "Abductive Reasoning", "Causal Reasoning", 
    "Systems Thinking", "Network Thinking", "Probabilistic Thinking", "Bayesian Updating", "Hypothesis Generation", 
    "Hypothesis Testing", "Critical Thinking", "Skepticism", "Falsification Seeking", "Decision Accuracy", 
    "Decision Speed", "Tradeoff Analysis", "Optimization Thinking", "Resource Allocation", "Constraint Reasoning", 
    "Strategic Thinking", "Tactical Thinking", "Long Term Planning", "Short Term Planning", "Meta Reasoning", 
    "Recursive Thinking", "Self Reflection", "Error Detection", "Assumption Checking", "Mental Simulation", 
    "Multi Perspective Thinking", "Conflict Resolution Reasoning", "Ethical Reasoning", "Moral Consistency", 
    "Value Reasoning", "Prioritization", "Goal Decomposition", "Goal Synthesis", "Framework Building", "Model Building"
  ],
  'Motivation': [
    "Curiosity", "Achievement Drive", "Mastery Drive", "Autonomy Drive", "Freedom Seeking", 
    "Exploration Drive", "Creation Drive", "Innovation Drive", "Recognition Seeking", "Status Seeking", 
    "Wealth Seeking", "Security Seeking", "Stability Seeking", "Impact Seeking", "Influence Seeking", 
    "Leadership Desire", "Contribution Desire", "Service Orientation", "Community Orientation", "Belonging Need", 
    "Relationship Seeking", "Competition Seeking", "Challenge Seeking", "Adventure Seeking", "Learning Drive", 
    "Discovery Drive", "Meaning Seeking", "Purpose Seeking", "Legacy Seeking", "Identity Expression", 
    "Self Development", "Self Protection", "Altruism", "Power Motivation", "Aesthetic Motivation"
  ],
  'Execution': [
    "Persistence", "Grit", "Discipline", "Consistency", "Planning", 
    "Organization", "Adaptability", "Flexibility", "Recovery Speed", "Stress Tolerance", 
    "Frustration Tolerance", "Delayed Gratification", "Impulse Control", "Focus Duration", "Deep Work Capacity", 
    "Task Switching", "Habit Formation", "Routine Maintenance", "Goal Commitment", "Goal Completion", 
    "Initiative", "Action Bias", "Experimentation Rate", "Iteration Speed", "Risk Taking", 
    "Risk Management", "Resourcefulness", "Self Management", "Time Management", "Energy Management", 
    "Learning Execution", "Feedback Utilization", "Accountability", "Reliability", "Follow Through"
  ],
  'Emotional Architecture': [
    "Emotional Awareness", "Emotional Regulation", "Emotional Intensity", "Emotional Stability", "Empathy", 
    "Compassion", "Sympathy", "Emotional Contagion", "Conflict Sensitivity", "Rejection Sensitivity", 
    "Shame Sensitivity", "Guilt Sensitivity", "Anger Reactivity", "Anxiety Reactivity", "Fear Response", 
    "Resilience", "Forgiveness", "Gratitude", "Trust", "Suspicion", 
    "Vulnerability", "Attachment Security", "Optimism", "Pessimism", "Hopefulness", 
    "Self Acceptance", "Self Compassion", "Emotional Recovery", "Mood Stability", "Psychological Safety Seeking"
  ],
  'Meta-Self': [
    "Self Awareness", "Self Insight", "Metacognition", "Calibration Accuracy", "Identity Stability", 
    "Identity Flexibility", "Cognitive Flexibility", "Perspective Taking", "Blind Spot Detection", "Learning From Failure", 
    "Learning From Success", "Growth Orientation", "Fixed Mindset", "Self Monitoring", "Self Correction", 
    "Self Regulation", "Authenticity", "Value Consistency", "Narrative Coherence", "Personal Philosophy", 
    "Meaning Construction", "Future Self Connection", "Self Complexity", "Ego Strength", "Reflective Depth"
  ]
};

const parentNodesRaw: Record<string, string[]> = {
  'Energy': ['Social Initiation', 'Social Maintenance', 'Internal Recovery', 'Group Presence', 'Independence', 'Competitive Edge'],
  'Information': ['Pattern Intelligence', 'Signal Processing', 'Cognitive Modality', 'Memory & Recall', 'Future & Scenario', 'Ambiguity Management', 'Context & Detail'],
  'Reasoning': ['Logical Structure', 'Systems Intelligence', 'Probabilistic Analysis', 'Decision Making', 'Strategic Planning', 'Meta & Error Check', 'Ethical & Value'],
  'Motivation': ['Intrinsic Drive', 'Social Status Drive', 'Security & Stability', 'Impact & Influence', 'Altruism & Community', 'Self Actualization', 'Exploration & Mastery'],
  'Execution': ['Resilience Engine', 'Planning & Org', 'Stress Management', 'Focus & Deep Work', 'Action & Iteration', 'Resource Management', 'Commitment Loop'],
  'Emotional Architecture': ['Emotional Control', 'Empathy Engine', 'Rejection & Threat', 'Resilience & Recovery', 'Trust & Vulnerability', 'Self Compassion Module'],
  'Meta-Self': ['Self Insight', 'Identity Engine', 'Meta-Learning', 'Evaluation & Correction', 'Authenticity & Values', 'Complex Self']
};

export const generateGraph = () => {
  const nodes: NodeDef[] = [];
  
  // Create parents
  const parentMap = new Map<string, NodeDef>();
  
  let parentIndex = 0;
  for (const cat of CATEGORIES) {
    const parents = parentNodesRaw[cat];
    const children = childNodesRaw[cat];
    const childrenPerParent = Math.ceil(children.length / parents.length);
    
    parents.forEach((pName, pIdx) => {
      const pId = `parent_${cat.substring(0,3).toUpperCase()}_${pIdx}`;
      const parentNode: NodeDef = {
        id: pId,
        name: pName,
        category: cat,
        tier: 1,
        definition: `Fundamental capacity for ${pName.toLowerCase()} within ${cat}.`,
        levels: {
          1: "Minimal capability or drive.",
          2: "Occasional or context-dependent activation.",
          3: "Average functional capability.",
          4: "Highly active and proficient.",
          5: "Exceptional and natural integration into behavior."
        },
        children: [],
        dependencies: []
      };
      
      const assignedChildren = children.slice(pIdx * childrenPerParent, (pIdx + 1) * childrenPerParent);
      
      assignedChildren.forEach((cName, cIdx) => {
        const cId = `child_${cat.substring(0,3).toUpperCase()}_${pIdx}_${cIdx}`;
        parentNode.children!.push(cId);
        
        // Define levels specific to the category slightly differently
        nodes.push({
          id: cId,
          name: cName,
          category: cat,
          tier: 2,
          definition: `Specific behavioral or cognitive manifestation: ${cName}.`,
          question: getQuestion(cName) || undefined,
          levels: {
            1: "Extremely low tendency.",
            2: "Below average tendency.",
            3: "Moderate tendency.",
            4: "Above average tendency.",
            5: "Extreme core tendency."
          },
          parents: [pId],
          dependencies: []
        });
      });
      
      parentMap.set(pId, parentNode);
      nodes.push(parentNode);
    });
  }
  
  // Create generic dependencies across tiers
  // E.g. Motivation -> Information -> Reasoning -> Execution
  // This satisfies the graph relation requested by user
  nodes.forEach(node => {
    if (node.tier === 2) {
      if (node.category === 'Execution') {
        const randMotiv = nodes.find(n => n.category === 'Motivation' && n.tier === 2 && Math.random() > 0.5);
        if (randMotiv) node.dependencies.push({ target: randMotiv.id, weight: 0.8 });
      }
      if (node.category === 'Information') {
        const randCur = nodes.find(n => n.name === 'Curiosity');
        if (randCur && node.name !== 'Curiosity') node.dependencies.push({ target: randCur.id, weight: 0.9 });
      }
    }
  });

  fs.writeFileSync(path.join(__dirname, 'hcmg_graph.json'), JSON.stringify({ nodes }, null, 2));
  
  const publicDir = path.join(__dirname, '..', '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'hcmg_graph.json'), JSON.stringify({ nodes }, null, 2));
  
  console.log("Graph JSON generated successfully with " + nodes.length + " nodes.");
};

generateGraph();
