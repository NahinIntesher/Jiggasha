import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks"; // Add this import for line breaks
import "katex/dist/katex.min.css";

const ComprehensiveFormatter = ({ rawContent }) => {
  // Improved function to handle Gemini's mixed content and line break issues
  function processGeminiContentAlt(text) {
    if (!text) return "";

    // Check if the entire response is a single code block
    const isEntireResponseCodeBlock =
      text.trim().startsWith("```") &&
      text.trim().endsWith("```") &&
      (text.match(/```/g) || []).length === 2;

    if (isEntireResponseCodeBlock) {
      const languageMatch = text.match(/```(\w+)?/);
      const language =
        languageMatch && languageMatch[1] ? languageMatch[1] : "";

      let content = text.replace(/```(\w+)?\n/, "");
      content = content.replace(/```\s*$/, "");

      return content;
    }

    // Fix line breaks that don't create paragraphs in regular text
    // Double newlines for paragraphs should be preserved by ReactMarkdown
    // Single newlines should be converted to <br/> by remark-breaks

    // Fix common Gemini response formatting issues
    let processed = text;

    // Ensure code blocks have proper spacing
    processed = processed.replace(/```(\w+)?(?!\n)/g, "```$1\n");
    processed = processed.replace(/(?<!\n)```/g, "\n```");

    // Fix bullet list formatting issues (ensure space after bullets)
    processed = processed.replace(/^([*+-])\s*(?!\s)/gm, "$1 ");

    // Ensure proper spacing for numbered lists
    processed = processed.replace(/^(\d+\.)\s*(?!\s)/gm, "$1 ");

    return processed;
  }

  function processGeminiContent(text) {
    if (!text) return "";

    const isEntireResponseCodeBlock =
      text.trim().startsWith("```") &&
      text.trim().endsWith("```") &&
      (text.match(/```/g) || []).length === 2;

    if (!isEntireResponseCodeBlock) {
      return text; // Assume regular Markdown with potential math
    }

    const languageMatch = text.match(/```(\w+)?/);
    const language = languageMatch && languageMatch[1] ? languageMatch[1] : "";

    // let content = text.replace(/```(\w+)?\n/, '');
    // content = content.replace(/```\s*$/, '');

    // Fix common Gemini response formatting issues
    let processed = text;

    // Ensure code blocks have proper spacing
    processed = processed.replace(/```(\w+)?(?!\n)/g, "```$1\n");
    processed = processed.replace(/(?<!\n)```/g, "\n```");

    // Fix bullet list formatting issues (ensure space after bullets)
    processed = processed.replace(/^([*+-])\s*(?!\s)/gm, "$1 ");

    // Ensure proper spacing for numbered lists
    processed = processed.replace(/^(\d+\.)\s*(?!\s)/gm, "$1 ");

    return processed; // Just extract content if it's a single code block, let ReactMarkdown handle the rest
  }

  const [formattedContent, setFormattedContent] = useState("");
  const [copyStatus, setCopyStatus] = useState({}); // Track copy status for multiple code blocks

  useEffect(() => {
    // Process the content to fix mixed code and text issues
    const processed = processGeminiContent(rawContent);
    setFormattedContent(processed);
  }, [rawContent]);

  // Enhanced copy function with individual block status
  const copyToClipboard = (text, blockId) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Set status for this specific block
        setCopyStatus((prev) => ({ ...prev, [blockId]: true }));

        // Reset after 2 seconds
        setTimeout(() => {
          setCopyStatus((prev) => ({ ...prev, [blockId]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        // Show error status
        setCopyStatus((prev) => ({ ...prev, [blockId]: "error" }));
      });
  };

  // Function to generate unique ID for code blocks
  const generateBlockId = (content, index) => {
    return `code-block-${index}-${content.slice(0, 10).replace(/\s/g, "")}`;
  };

  // Counter for code blocks to generate unique IDs
  let codeBlockCounter = 0;

  return (
    <div className="gemini-response">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]} // Add remarkBreaks to handle line breaks
        rehypePlugins={[rehypeKatex]}
        components={{
          // Code block handling with improved copy button
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");

            if (!inline && match) {
              const blockId = generateBlockId(codeText, codeBlockCounter++);
              const isCopied = copyStatus[blockId];

              return (
                <div className="relative group code-block-wrapper">
                  <button
                    onClick={() => copyToClipboard(codeText, blockId)}
                    className={`absolute top-2 right-2 px-2 py-1 rounded text-xs transition-all duration-200 ${
                      isCopied
                        ? "bg-green-600 text-white opacity-100"
                        : "bg-gray-700 hover:bg-gray-800 text-white opacity-0 group-hover:opacity-100"
                    }`}
                    aria-label="Copy code to clipboard"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    wrapLines={true}
                    showLineNumbers={true}
                    {...props}
                  >
                    {codeText}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className={`${className || ""} inline-code`} {...props}>
                {children}
              </code>
            );
          },

          // Enhanced list handling
          ul({ node, children, ...props }) {
            return (
              <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
                {children}
              </ul>
            );
          },

          ol({ node, children, ...props }) {
            return (
              <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
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

          // Table handling with improved styling
          table({ node, children, ...props }) {
            return (
              <div className="overflow-x-auto mb-6 rounded-md border border-gray-200">
                <table
                  className="min-w-full divide-y divide-gray-300"
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },

          thead({ node, children, ...props }) {
            return (
              <thead className="bg-gray-100" {...props}>
                {children}
              </thead>
            );
          },

          tbody({ node, children, ...props }) {
            return (
              <tbody className="divide-y divide-gray-200 bg-white" {...props}>
                {children}
              </tbody>
            );
          },

          tr({ node, children, ...props }) {
            return (
              <tr className="hover:bg-gray-50 transition-colors" {...props}>
                {children}
              </tr>
            );
          },

          th({ node, children, ...props }) {
            return (
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                {...props}
              >
                {children}
              </th>
            );
          },

          td({ node, children, ...props }) {
            return (
              <td className="px-4 py-3 text-sm text-gray-800" {...props}>
                {children}
              </td>
            );
          },

          // Enhanced paragraph handling with proper spacing
          p({ node, children, ...props }) {
            return (
              <p className="leading-relaxed" {...props}>
                {children}
              </p>
            );
          },

          // Enhanced heading hierarchy
          h1({ node, children, ...props }) {
            return (
              <h1
                className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200"
                {...props}
              >
                {children}
              </h1>
            );
          },

          h2({ node, children, ...props }) {
            return (
              <h2 className="text-xl font-bold mt-6 mb-3" {...props}>
                {children}
              </h2>
            );
          },

          h3({ node, children, ...props }) {
            return (
              <h3 className="text-lg font-bold mt-5 mb-2" {...props}>
                {children}
              </h3>
            );
          },

          h4({ node, children, ...props }) {
            return (
              <h4 className="text-base font-bold mt-4 mb-2" {...props}>
                {children}
              </h4>
            );
          },

          // Special handling for bold text
          strong({ node, children, ...props }) {
            return (
              <strong className="font-bold" {...props}>
                {children}
              </strong>
            );
          },

          // Enhanced link styling
          a({ node, children, href, ...props }) {
            return (
              <a
                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                target={
                  href && (href.startsWith("http") || href.startsWith("//"))
                    ? "_blank"
                    : undefined
                }
                rel={
                  href && (href.startsWith("http") || href.startsWith("//"))
                    ? "noopener noreferrer"
                    : undefined
                }
                href={href}
                {...props}
              >
                {children}
              </a>
            );
          },

          // Enhanced blockquote styling
          blockquote({ node, children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-700 pl-4 py-2 italic text-gray-700 dark:text-gray-300 mb-4 rounded-r"
                {...props}
              >
                {children}
              </blockquote>
            );
          },

          // Add horizontal rule support
          hr({ node, ...props }) {
            return <hr className="border-t border-gray-300 my-6" {...props} />;
          },

          // Add image support with proper styling
          img({ node, src, alt, ...props }) {
            return (
              <span className="block my-4">
                <img
                  src={src}
                  alt={alt || ""}
                  className="max-w-full h-auto rounded-md"
                  {...props}
                />
                {alt && (
                  <span className="text-sm text-gray-500 italic block mt-1">
                    {alt}
                  </span>
                )}
              </span>
            );
          },

          // Preserve line breaks within paragraphs
          // remarkBreaks plugin converts single newlines to <br/> elements
          br({ node, ...props }) {
            return <br className="my-1" {...props} />;
          },
        }}
      >
        {formattedContent}
      </ReactMarkdown>

      {/* Enhanced styles with better dark mode support */}
      <style jsx global>{`
        .gemini-response {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          line-height: 1.6;
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        @media (prefers-color-scheme: dark) {
          color: #000000;
          .gemini-response {
            color: #e0e0e0;
          }
        }

        .gemini-response .inline-code {
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 0.9em;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          background-color: rgba(27, 31, 35, 0.05);
          color: rgb(240, 110, 0);
        }

        @media (prefers-color-scheme: dark) {
          .gemini-response .inline-code {
            background-color: rgba(200, 200, 200, 0.1);
            color: #f06292;
          }
        }

        .gemini-response pre {
          margin-bottom: 0.2rem;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .gemini-response .code-block-wrapper {
          margin-bottom: 0;
        }

        .gemini-response .code-block-wrapper span {
          margin-bottom: 0;
          font-family: Inconsolata, Monaco, Consolas, "Courier New", Courier,
            monospace;
        }

        /* Fix spacing between code blocks and text */
        .gemini-response pre + p {
          margin-top: 1rem;
        }

        /* Special styling for lists with code explanation pattern */
        .gemini-response li strong + code {
          margin-left: 4px;
        }

        /* Ensure proper spacing between list items */
        .gemini-response li > p {
          margin-bottom: 0.25rem;
        }

        /* Fix spacing issues in nested lists */
        .gemini-response li > ul,
        .gemini-response li > ol {
          margin-top: 0.5rem;
          margin-bottom: 0;
        }

        /* Improved table styles */
        .gemini-response table {
          font-size: 0.95em;
          border-collapse: separate;
          border-spacing: 0;
        }

        @media (prefers-color-scheme: dark) {
          .gemini-response thead {
            background: rgba(255, 255, 255, 0.1);
          }

          .gemini-response tbody {
            background: transparent;
          }

          .gemini-response tr:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .gemini-response th {
            color: #eee;
          }

          .gemini-response td {
            color: #ddd;
          }
        }

        /* Fix for emoji and special characters */
        .gemini-response img.emoji {
          height: 1.2em;
          width: 1.2em;
          margin: 0 0.05em 0 0.1em;
          vertical-align: -0.1em;
        }
      `}</style>
    </div>
  );
};

export default ComprehensiveFormatter;
