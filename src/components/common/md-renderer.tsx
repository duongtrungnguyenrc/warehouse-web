"use client";

import { Check, Copy } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";

import { Button } from "@/components/shadcn/button";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return (
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => copyCode(codeString)}
                  >
                    {copiedCode === codeString ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <SyntaxHighlighter style={oneDark as any} language={language} PreTag="div" className="rounded-md !mt-0 !mb-4">
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },

          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300">{children}</table>
              </div>
            );
          },

          th({ children }) {
            return <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold">{children}</th>;
          },

          td({ children }) {
            return <td className="border border-gray-300 px-4 py-2">{children}</td>;
          },

          h1({ children }) {
            return <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900">{children}</h1>;
          },

          h2({ children }) {
            return <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900">{children}</h2>;
          },

          h3({ children }) {
            return <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-900">{children}</h3>;
          },

          ul({ children }) {
            return <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>;
          },

          ol({ children }) {
            return <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>;
          },

          li({ children }) {
            return <li className="text-gray-700">{children}</li>;
          },

          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                {children}
              </a>
            );
          },

          blockquote({ children }) {
            return <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">{children}</blockquote>;
          },

          p({ children }) {
            return <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>;
          },

          strong({ children }) {
            return <strong className="font-semibold text-gray-900">{children}</strong>;
          },

          em({ children }) {
            return <em className="italic text-gray-700">{children}</em>;
          },

          hr() {
            return <hr className="my-6 border-gray-300" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
