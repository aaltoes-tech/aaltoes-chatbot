import { memo, useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { Components } from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { useTheme } from "next-themes";
import { MemoizedMarkdown } from "@/components/memoized-markdown";


const LoadingDots = () => (
    <span className="inline-flex items-center">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse delay-100">.</span>
        <span className="animate-pulse delay-200">.</span>
    </span>
);

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <button
            onClick={handleCopy}
            className="absolute right-2 top-2 p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
            title="Copy code"
        >
            {copied ? (
                <Check className="h-4 w-4 text-accent-foreground" />
            ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
            )}
        </button>
    );
};

export default function BotMessage({
    content,
    role,
    createdAt,
    id,
}: {
    role: string;
    content: string;
    createdAt?: Date;
    id: string;
}) {
    return (
        <div className="flex w-full w-full">
            <div className="text-left  text-foreground">
                <MemoizedMarkdown id={id} content={content} />
            </div>
        </div>
    );
}
