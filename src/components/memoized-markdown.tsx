import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import KaTeX from 'katex';
import { highlight } from 'sugar-high';

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

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    const { theme } = useTheme();

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ ...props }) => <h2 className="text-2xl font-semibold mt-5 mb-3" {...props} />,
          h3: ({ ...props }) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
          p: ({ ...props }) => <p className="my-3 leading-7" {...props} />,
          ul: ({ ...props }) => <ul className="my-3 ml-6 list-disc space-y-2" {...props} />,
          ol: ({ ...props }) => <ol className="my-3 ml-6 list-decimal space-y-2" {...props} />,
          li: ({ ...props }) => <li className="leading-7" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-blue-500/50 pl-4 my-4 italic bg-accent/50 py-3 rounded-r" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-primary hover:text-primary/90 underline underline-offset-4" {...props} />
          ),
          table: ({ ...props }) => (
            <div className="my-6 overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="bg-muted px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="px-6 py-4 text-sm" {...props} />
          ),
          hr: () => <hr className="my-4 border-t border-border" />,
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');
            
            return match ? (
              <div className="relative my-4 rounded-lg overflow-hidden border bg-muted/50">
                <CopyButton text={code} />
                <pre className="p-4 overflow-x-auto">
                  <code
                    className="text-sm font-mono"
                    dangerouslySetInnerHTML={{
                      __html: highlight(code)
                    }}
                    {...props}
                  />
                </pre>
              </div>
            ) : (
              <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';