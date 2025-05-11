import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const ComprehensiveFormatter = ({ rawContent }) => {
  function fixGeminiMixedContent(text) {
    if (!text) return '';
  
    const isEntireResponseCodeBlock = text.trim().startsWith('```') &&
                                      text.trim().endsWith('```') &&
                                      (text.match(/```/g) || []).length === 2;
  
    if (!isEntireResponseCodeBlock) {
      return text; // Assume regular Markdown with potential math
    }
  
    const languageMatch = text.match(/```(\w+)?/);
    const language = languageMatch && languageMatch[1] ? languageMatch[1] : '';
  
    let content = text.replace(/```(\w+)?\n/, '');
    content = content.replace(/```\s*$/, '');
  
    return content; // Just extract content if it's a single code block, let ReactMarkdown handle the rest
  }
  

  const [formattedContent, setFormattedContent] = useState('');
  
  useEffect(() => {
    // Process the content to fix mixed code and text issues
    const processed = fixGeminiMixedContent(rawContent);
    setFormattedContent(processed);
  }, [rawContent]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Copied!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="gemini-response">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Code block handling with copy button
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <div className="relative group">
                <button 
                  onClick={() => copyToClipboard(codeText)}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Copy code to clipboard"
                >
                  Copy
                </button>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          
          // List handling
          ul({ node, children, ...props }) {
            return (
              <ul className="list-disc pl-6 mb-4" {...props}>
                {children}
              </ul>
            );
          },
          
          ol({ node, children, ...props }) {
            return (
              <ol className="list-decimal pl-6 mb-4" {...props}>
                {children}
              </ol>
            );
          },
          
          li({ node, children, ...props }) {
            return (
              <li className="mb-2" {...props}>
                {children}
              </li>
            );
          },
          
          // Table handling
          table({ node, children, ...props }) {
            return (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-300" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          
          thead({ node, children, ...props }) {
            return (
              <thead className="bg-gray-50" {...props}>
                {children}
              </thead>
            );
          },
          
          tbody({ node, children, ...props }) {
            return (
              <tbody className="divide-y divide-gray-200" {...props}>
                {children}
              </tbody>
            );
          },
          
          tr({ node, children, ...props }) {
            return (
              <tr className="hover:bg-gray-50" {...props}>
                {children}
              </tr>
            );
          },
          
          th({ node, children, ...props }) {
            return (
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                {...props}
              >
                {children}
              </th>
            );
          },
          
          td({ node, children, ...props }) {
            return (
              <td className="px-4 py-3 text-sm" {...props}>
                {children}
              </td>
            );
          },
          
          // Paragraph handling
          p({ node, children, ...props }) {
            return <p className="leading-relaxed" {...props}>{children}</p>;
          },
          
          // Heading handling
          h1({ node, children, ...props }) {
            return <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>{children}</h1>;
          },
          
          h2({ node, children, ...props }) {
            return <h2 className="text-xl font-bold mt-5 mb-3" {...props}>{children}</h2>;
          },
          
          h3({ node, children, ...props }) {
            return <h3 className="text-lg font-bold mt-4 mb-2" {...props}>{children}</h3>;
          },
          
          // Special handling for bold text in lists (common in Gemini responses)
          strong({ node, children, ...props }) {
            return <strong className="font-bold" {...props}>{children}</strong>;
          },
          
          // Special handling for links
          a({ node, children, ...props }) {
            return (
              <a 
                className="text-blue-600 hover:underline" 
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          
          // Blockquote handling
          blockquote({ node, children, ...props }) {
            return (
              <blockquote 
                className="border-l-4 border-gray-300 pl-4 py-1 italic text-gray-600 mb-4" 
                {...props}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {formattedContent}
      </ReactMarkdown>
      
      <style jsx global>{`        
        .gemini-response code {
          font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
          font-size: 0.9em;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          background-color: rgba(27, 31, 35, 0.05);
        }
        
        .gemini-response pre {
          margin-bottom: 1.5rem;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .copy-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #333;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          z-index: 1000;
        }
        
        /* Special styling for lists with code explanation pattern */
        .gemini-response li strong + code {
          margin-left: 4px;
        }
        
        /* Ensure proper spacing between bullet points */
        .gemini-response li {
          margin-bottom: 0.5rem;
        }
        
        /* Fix common Gemini response formatting for bullets and code */
        .gemini-response ul li p,
        .gemini-response ol li p {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default ComprehensiveFormatter;