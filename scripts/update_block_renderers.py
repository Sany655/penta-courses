import os

with open('src/components/student/BlockRenderers.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

if 'export function InteractiveBlock' not in code:
    code += """

// --- Unified Universal Interactive Block Dispatcher ---
import { CognitiveBlockRegistry } from '../cognitive/CognitiveBlockRegistry';

export function InteractiveBlock({ block, onEvidence, onQuizPass, onBypassPay, isPreview = false }) {
  if (!block) return null;

  const type = block.type || block.archetype;

  switch (type) {
    case 'markdown':
      return <MarkdownBlock content={block.content || ''} />;
    case 'terminal':
      return (
        <AnimatedTerminal
          command={block.command || ''}
          expectedOutput={block.expectedOutput || ''}
          promptUser={block.promptUser || 'operator'}
          hostname={block.hostname || 'lab-env'}
        />
      );
    case 'code_stepper':
      return (
        <CodeStepper
          script={block.script || ''}
          language={block.language || 'python'}
          steps={block.steps || []}
        />
      );
    case 'network_flow':
      return (
        <NetworkFlow
          nodes={block.nodes || []}
          animationFlow={block.animationFlow || []}
        />
      );
    case 'quiz':
      return (
        <QuizGatekeeper
          quiz={block.quiz || block.data || { questions: [], passingScore: 80 }}
          onQuizPass={onQuizPass}
          onBypassPay={onBypassPay}
        />
      );
    default:
      return <CognitiveBlockRegistry block={block} onEvidence={onEvidence} isPreview={isPreview} />;
  }
}
"""
    with open('src/components/student/BlockRenderers.jsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Appended InteractiveBlock to BlockRenderers.jsx')
else:
    print('InteractiveBlock already present')
