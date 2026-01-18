'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
    text: string;
    block?: boolean;
}

export default function MathRenderer({ text, block = false }: MathRendererProps) {
    // Basic detection of latex patterns if passed as raw text (optional wrapper logic)
    // For now, we assume the user passes the latex string directly if using this component.
    // However, usually we want to render mixed text and math.
    // A simple approach is to rely on user strictly separating text and math inputs, or parsing.
    // For MVP, let's assume this component is used specifically for math segments.

    if (block) {
        return <BlockMath math={text} />;
    }
    return <InlineMath math={text} />;
}

// Helper to render mixed content (Text + Latex) simply by checking for $ delimiters?
// Or we can just let the user type raw text and we regex replace.
export function RenderMixedContent({ content }: { content: string }) {
    if (!content) return null;

    // Split by $...$ for inline math
    const parts = content.split(/(\$[^$]+\$)/g);

    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const math = part.slice(1, -1);
                    return <InlineMath key={i} math={math} />;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
