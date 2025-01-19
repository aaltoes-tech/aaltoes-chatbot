import { memo, useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { Components } from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { useTheme } from "next-themes";

interface CustomComponents extends Components {
    math: React.ComponentType<{ value: string }>;
    inlineMath: React.ComponentType<{ value: string }>;
}

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
            className="absolute right-2 top-2 p-2 rounded-lg bg-gray-700/75 hover:bg-gray-600/75 transition-colors"
            title="Copy code"
        >
            {copied ? (
                <Check className="h-4 w-4 text-green-400" />
            ) : (
                <Copy className="h-4 w-4 text-gray-200" />
            )}
        </button>
    );
};

const MemoizedMarkdown = memo(({ content }: { content: string }) => {
    const { theme } = useTheme();
    
    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <div className="my-4 rounded-lg overflow-hidden relative">
                            <CopyButton text={String(children)} />
                            <SyntaxHighlighter
                                style={theme === 'dark' ? oneDark : oneLight}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    padding: '1.25rem'
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-sm font-mono" {...props}>
                            {children}
                        </code>
                    );
                },
                h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                h2: ({ ...props }) => <h2 className="text-2xl font-semibold mt-5 mb-3 text-gray-800 dark:text-gray-200" {...props} />,
                h3: ({ ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-gray-200" {...props} />,
                p: ({ ...props }) => <p className="my-3 leading-7 text-gray-700 dark:text-gray-300" {...props} />,
                ul: ({ ...props }) => <ul className="my-3 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
                ol: ({ ...props }) => <ol className="my-3 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
                li: ({ ...props }) => <li className="leading-7" {...props} />,
                blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-blue-500/50 pl-4 my-4 italic bg-blue-50/50 dark:bg-blue-900/20 py-3 rounded-r text-gray-700 dark:text-gray-300" {...props} />
                ),
                a: ({ ...props }) => (
                    <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-600 transition-colors" {...props} />
                ),
                table: ({ ...props }) => (
                    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                    </div>
                ),
                th: ({ ...props }) => (
                    <th className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700" {...props} />
                ),
                td: ({ ...props }) => (
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700" {...props} />
                ),
                math: ({ value }) => (
                    <div className="my-4 overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <span dangerouslySetInnerHTML={{ 
                            __html: KaTeX.renderToString(value, { 
                                displayMode: true,
                                throwOnError: false
                            }) 
                        }} />
                    </div>
                ),
                inlineMath: ({ value }) => (
                    <span className="mx-1" dangerouslySetInnerHTML={{ 
                        __html: KaTeX.renderToString(value, { 
                            displayMode: false,
                            throwOnError: false
                        }) 
                    }} />
                ),
                hr: () => <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />,
            } as CustomComponents}
        >
            {content}
        </ReactMarkdown>
    );
});

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default function BotMessage({
    role, 
    content, 
    isLast,
    createdAt
}: {
    role: string;
    content: string;
    isLast?: boolean;
    createdAt?: Date;
}) {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bufferRef = useRef('');
    const isNew = isLast && createdAt && (Date.now() - new Date(createdAt).getTime() < 1000);
    
    useEffect(() => {
        if (!isNew) {
            setDisplayedContent(content);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        bufferRef.current = '';
        let currentIndex = 0;
        
        const streamText = () => {
            if (currentIndex < content.length) {
                bufferRef.current += content[currentIndex];
                currentIndex++
                // Update display if we have a complete line or code block
                if (content[currentIndex - 1] === '\n' || 
                    bufferRef.current.includes('```') || 
                    currentIndex === content.length) {
                    setDisplayedContent(prev => prev + bufferRef.current);
                    bufferRef.current = '';
                }
                
                setTimeout(streamText, 3);
            } else {
                setIsLoading(false);
            }
        };

        streamText();
        
        return () => {
            currentIndex = content.length; // Stop streaming
        };
    }, [content, isNew]);

    return (
        <div className="flex w-full p-3 my-2">
            <div className="text-left w-full p-3 text-base leading-relaxed">
                <MemoizedMarkdown content={displayedContent} />
                {isLoading && <LoadingDots />}
            </div>
        </div>
    );
}
