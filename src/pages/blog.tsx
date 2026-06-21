import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

const markdownModules = import.meta.glob('../content/*.md');

interface MarkdownModule {
    html: string;
    attributes: {
        title?: string;
        author?: string;
        date?: string;
        category?: string;
        status?: string;
        [key: string]: any;
    };
}

// ── Theme helper ──
const THEME_KEY = 'blog-theme';
function applyTheme(theme: 'dark' | 'light') {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
}
function getSavedTheme(): 'dark' | 'light' {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
}

const cssStyles = `
    /* ---------- Base (dark) ---------- */
    .paper-isolated-wrapper {
        background-color: #000000 !important;
        color: #e5e5e5 !important;
        font-family: "Courier New", Courier, monospace !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        min-height: 100vh;
        box-sizing: border-box;
        padding: 3rem 1.5rem;
        transition: background 0.3s, color 0.3s;
    }
    .paper-fallback-screen {
        background-color: #000000 !important;
        color: #d4af37;
        font-family: "Courier New", Courier, monospace;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .paper-error-screen {
        background-color: #000000 !important;
        color: #ff4a5a;
        font-family: "Courier New", Courier, monospace;
        padding: 3rem;
        height: 100vh;
    }
    .home-backlink { color: #d4af37; text-decoration: underline; }
    .home-backlink:hover { color: #ffffff; }
    .paper-container-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
    .paper-nav-links {
        margin-bottom: 2.5rem;
        font-size: 0.9rem;
        letter-spacing: 0.05em;
        color: #444444;
    }
    .paper-nav-links a {
        color: #666666 !important;
        text-decoration: none !important;
        transition: color 0.2s;
    }
    .paper-nav-links a:hover { color: #d4af37 !important; }
    .paper-nav-links .active-nav-node {
        color: #d4af37 !important;
        font-weight: bold !important;
    }
    .paper-title-outside {
        color: #ffffff !important;
        font-size: 2.2rem !important;
        font-weight: bold !important;
        margin: 1.5rem 0 0.5rem 0 !important;
        line-height: 1.3 !important;
    }
    .paper-author-title { color: #ffffff !important; font-size: 1.1rem; margin-bottom: 0.5rem; }
    .paper-post-meta { color: #555555 !important; font-size: 0.9rem; margin-bottom: 2.5rem; }

    /* Markdown body container */
    .markdown-body {
        border: 1px solid #222222 !important;
        background-color: transparent;
        border-radius: 6px;
        padding: 1.5rem;
    }

    /* Markdown element styles */
    .markdown-body h1 { color: #ffffff !important; font-size: 1.8rem !important; font-weight: bold; margin-top: 3rem; margin-bottom: 1.2rem; line-height: 1.3; }
    .markdown-body h2 { color: #ffffff !important; font-size: 1.4rem; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid #222222; padding-bottom: 0.3rem;}
    .markdown-body h3 { color: #ffffff !important; font-size: 1.2rem; margin-top: 2rem; margin-bottom: 0.8rem; }
    .markdown-body h4 { color: #ffffff !important; font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.6rem; }
    .markdown-body h5, .markdown-body h6 {
        color: #cccccc !important;
        font-size: 1rem;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .markdown-body p { margin-bottom: 1.5rem; color: #e5e5e5 !important; }
    .markdown-body strong, .markdown-body b { color: #ffffff !important; }
    .markdown-body em, .markdown-body i { color: #cccccc !important; font-style: italic; }
    .markdown-body del, .markdown-body s { color: #666666 !important; text-decoration: line-through; }
    .markdown-body a {
        color: #d4af37 !important;
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.2s;
    }
    .markdown-body a:hover { color: #ffffff !important; }
    .markdown-body sup, .markdown-body sub { font-size: 0.75em; }
    .markdown-body kbd {
        background-color: #111111;
        border: 1px solid #333333;
        border-radius: 3px;
        padding: 1px 6px;
        font-size: 0.85em;
        color: #ffffff;
    }
    .markdown-body mark {
        background-color: rgba(212, 175, 55, 0.25);
        color: #ffffff;
        padding: 0 2px;
    }
    .markdown-body hr { border: 0; border-top: 1px dashed #222222; margin: 3rem 0; }
    .markdown-body table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 2rem 0 !important;
        font-size: 0.9rem;
    }
    .markdown-body th, .markdown-body td {
        border: 1px solid #222222 !important;
        padding: 0.75rem !important;
        text-align: left;
    }
    .markdown-body th {
        background-color: #0b0b0b !important;
        color: #ffffff !important;
        font-weight: bold;
    }
    .markdown-body tr:nth-child(even) { background-color: #030303 !important; }
    .markdown-body ul, .markdown-body ol {
        list-style-position: outside !important;
        margin: 0 0 1.5rem 1.5rem !important;
        padding: 0 !important;
    }
    .markdown-body ul { list-style-type: disc !important; }
    .markdown-body ol { list-style-type: decimal !important; }
    .markdown-body li { margin-bottom: 0.5rem !important; color: #e5e5e5 !important; }
    .markdown-body li::marker { color: #8b949e !important; font-weight: normal !important; }
    .markdown-body li > p { margin-bottom: 0.5rem; }
    .markdown-body ul ul, .markdown-body ol ol, .markdown-body ul ol, .markdown-body ol ul {
        margin-top: 0.5rem; margin-bottom: 0.5rem;
    }
    .markdown-body li input[type="checkbox"] {
        margin-right: 0.5rem;
        accent-color: #d4af37;
    }
    .markdown-body li:has(> input[type="checkbox"]) { list-style: none; }
    .markdown-body img {
        width: 100% !important;
        height: auto !important;
        border: 1px solid #222222 !important;
        margin: 2rem auto !important;
        display: block;
    }
    .markdown-body figure { margin: 2rem 0; }
    .markdown-body figcaption {
        color: #666666 !important;
        font-size: 0.85rem;
        text-align: center;
        margin-top: 0.5rem;
        font-style: italic;
    }
    .markdown-body iframe, .markdown-body video {
        width: 100%;
        border: 1px solid #222222 !important;
        margin: 2rem auto !important;
        display: block;
    }
    .markdown-body blockquote {
        margin: 1.5rem 0 !important;
        padding: 0.5rem 1rem !important;
        border-left: 3px solid #d4af37 !important;
        background-color: #050505 !important;
        font-style: italic;
    }
    .markdown-body blockquote p { margin: 0 !important; color: #888888 !important; }

    /* ascii-art / matrix-box – completely transparent in dark mode */
    .markdown-body pre.ascii-art,
    .markdown-body pre.matrix-box,
    .markdown-body .ascii-art,
    .markdown-body .matrix-box {
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 2rem 0;
        overflow-x: auto;
        box-shadow: none !important;
    }
    .markdown-body .ascii-art {
        font-size: 13px !important;
        line-height: 1.15 !important;
        white-space: pre !important;
    }
    .markdown-body .matrix-box {
        color: #ffffff !important;
        font-size: 15px !important;
        line-height: 1.4 !important;
        white-space: pre !important;
    }
    .markdown-body code {
        background-color: rgba(212, 175, 55, 0.07) !important;
        color: #ffd875 !important;
        border: 1px solid rgba(212, 175, 55, 0.18) !important;
        padding: 2px 6px !important;
        font-size: 0.9em !important;
        font-weight: bold !important;
        border-radius: 3px;
    }

    /* Code block with copy icon */
    .code-block-wrapper { position: relative; margin: 1.5rem 0; }
    .code-block-wrapper pre { margin: 0 !important; }
    .copy-code-btn {
        position: absolute; top: 10px; right: 10px;
        background: rgba(212, 175, 55, 0.12);
        border: 1px solid rgba(212, 175, 55, 0.25);
        color: #d4af37;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 5;
        line-height: 1;
    }
    .copy-code-btn:hover {
        background: rgba(212, 175, 55, 0.25);
        color: #ffffff;
        border-color: #d4af37;
    }
    .copy-code-btn.copied {
        background: rgba(0, 255, 0, 0.2);
        border-color: #00ff00;
        color: #00ff00;
    }
    .copy-code-btn svg {
        width: 16px; height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .markdown-body pre {
        border: 1px solid #222222 !important;
        border-left: 3px solid #d4af37 !important;
        background-color: #050505 !important;
        padding: 1rem !important;
        overflow-x: auto !important;
    }
    .markdown-body pre code {
        background: transparent !important;
        color: #ffffff !important;
        font-weight: normal !important;
        border: none !important;
        padding: 0 !important;
        display: block !important;
    }
    .code-keyword { color: #d4af37; font-weight: bold; }
    .code-number { color: #888888; }
    .code-string { color: #8fbf8f; }
    .code-comment { color: #3b3b3b; font-style: italic; }
    .paper-minimal-divider {
        border: 0;
        border-top: 1px dashed #222222;
        margin: 4rem 0 2rem 0;
    }
    .paper-disclaimer { color: #444444 !important; font-size: 0.85rem; }

    /* iPhone‑style theme toggle */
    .paper-theme-switch {
        position: fixed;
        top: 1.2rem;
        right: 1.2rem;
        z-index: 1000;
        width: 56px;
        height: 30px;
        background: #333;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 2px;
        transition: background 0.3s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-family: "Courier New", Courier, monospace;
    }
    .paper-theme-switch[aria-checked="true"] {
        background: #4a90e2;
    }
    .paper-theme-switch-thumb {
        width: 26px;
        height: 26px;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: transform 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
    .paper-theme-switch[aria-checked="true"] .paper-theme-switch-thumb {
        transform: translateX(26px);
    }
    .paper-theme-switch-thumb span {
        line-height: 1;
        pointer-events: none;
    }

    /* ---------- Light mode overrides ---------- */
    body.light-theme .paper-isolated-wrapper {
        background-color: #fefefe !important;
        color: #1a1a1a !important;
    }
    body.light-theme .paper-fallback-screen {
        background-color: #ffffff !important;
        color: #b38b1a;
    }
    body.light-theme .paper-error-screen {
        background-color: #ffffff !important;
    }
    body.light-theme .home-backlink:hover { color: #111111; }
    body.light-theme .paper-nav-links { color: #999; }
    body.light-theme .paper-nav-links a { color: #555 !important; }
    body.light-theme .paper-nav-links a:hover { color: #b38b1a !important; }
    body.light-theme .paper-nav-links .active-nav-node { color: #b38b1a !important; }
    body.light-theme .paper-title-outside { color: #111111 !important; }
    body.light-theme .paper-author-title { color: #222222 !important; }
    body.light-theme .paper-post-meta { color: #666666 !important; }

    body.light-theme .markdown-body {
        border-color: #dddddd !important;
    }
    body.light-theme .markdown-body h1 { color: #111111 !important; }
    body.light-theme .markdown-body h2 { color: #222222 !important; border-bottom-color: #dddddd; }
    body.light-theme .markdown-body h3 { color: #333333 !important; }
    body.light-theme .markdown-body h4 { color: #444444 !important; }
    body.light-theme .markdown-body h5, .markdown-body h6 { color: #555555 !important; }
    body.light-theme .markdown-body p { color: #1a1a1a !important; }
    body.light-theme .markdown-body strong, .markdown-body b { color: #000000 !important; }
    body.light-theme .markdown-body em, .markdown-body i { color: #555555 !important; }
    body.light-theme .markdown-body del, .markdown-body s { color: #999999 !important; }
    body.light-theme .markdown-body a { color: #b38b1a !important; }
    body.light-theme .markdown-body a:hover { color: #000000 !important; }
    body.light-theme .markdown-body kbd {
        background-color: #f0f0f0;
        border-color: #cccccc;
        color: #111111;
    }
    body.light-theme .markdown-body mark { background-color: rgba(179, 139, 26, 0.15); }
    body.light-theme .markdown-body hr { border-top-color: #dddddd; }
    body.light-theme .markdown-body th, .markdown-body td { border-color: #cccccc !important; }
    body.light-theme .markdown-body th {
        background-color: #f4f4f4 !important;
        color: #111111 !important;
    }
    body.light-theme .markdown-body tr:nth-child(even) { background-color: #f9f9f9 !important; }
    body.light-theme .markdown-body li { color: #1a1a1a !important; }
    body.light-theme .markdown-body li::marker { color: #888888 !important; }
    body.light-theme .markdown-body img { border-color: #dddddd !important; }
    body.light-theme .markdown-body figcaption { color: #999999 !important; }
    body.light-theme .markdown-body iframe, .markdown-body video { border-color: #dddddd !important; }
    body.light-theme .markdown-body blockquote {
        border-left-color: #b38b1a !important;
        background-color: #fafafa !important;
    }
    body.light-theme .markdown-body blockquote p { color: #666666 !important; }
    body.light-theme .markdown-body code {
        background-color: rgba(179, 139, 26, 0.08) !important;
        color: #b38b1a !important;
        border-color: rgba(179, 139, 26, 0.25) !important;
    }
    body.light-theme .markdown-body pre {
        background-color: #f7f7f7 !important;
        border-color: #dddddd !important;
        border-left-color: #b38b1a !important;
    }
    body.light-theme .markdown-body pre code { color: #111111 !important; }
    body.light-theme .code-keyword { color: #b38b1a; }
    body.light-theme .code-number { color: #666666; }
    body.light-theme .code-string { color: #2a7a2a; }
    body.light-theme .code-comment { color: #999999; }
    body.light-theme .paper-minimal-divider { border-top-color: #dddddd; }
    body.light-theme .paper-disclaimer { color: #999999 !important; }
    body.light-theme .paper-theme-switch {
        background: #e0e0e0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    body.light-theme .paper-theme-switch[aria-checked="true"] {
        background: #4a90e2;
    }

    /* ── Fix ascii-art / matrix-box in light mode ── */
    body.light-theme .markdown-body pre.ascii-art,
    body.light-theme .markdown-body pre.matrix-box,
    body.light-theme .markdown-body .ascii-art,
    body.light-theme .markdown-body .matrix-box {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }
    body.light-theme .markdown-body .matrix-box {
        color: #111111 !important;
    }
`;

// Highlighting utilities (unchanged)
const CODE_KEYWORDS = [
    'function', 'const', 'let', 'var', 'return', 'if', 'else', 'elif', 'for', 'while', 'do',
    'switch', 'case', 'break', 'continue', 'class', 'struct', 'public', 'private', 'protected',
    'static', 'void', 'int', 'float', 'double', 'bool', 'boolean', 'char', 'string', 'String',
    'true', 'false', 'null', 'None', 'nil', 'undefined', 'new', 'this', 'self', 'import', 'from',
    'export', 'default', 'def', 'lambda', 'try', 'except', 'catch', 'finally', 'throw', 'raise',
    'async', 'await', 'yield', 'namespace', 'using', 'typedef', 'enum', 'interface', 'extends',
    'implements', 'super', 'instanceof', 'delete', 'in', 'of', 'as', 'is', 'and', 'or', 'not',
    'pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead', 'delay',
    'delayMicroseconds', 'setup', 'loop', 'HIGH', 'LOW', 'OUTPUT', 'INPUT', 'INPUT_PULLUP',
];

const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightCode = (code: string): string => {
    const keywordPattern = CODE_KEYWORDS.map(escapeRegExp).join('|');
    const tokenRegex = new RegExp(
        '(//.*)' +
        '|(#define|#include[^\\n]*)' +
        '|(#(?!define|include)[^\\n]*)' +
        '|("(?:[^"\\\\]|\\\\.)*")' +
        "|('(?:[^'\\\\]|\\\\.)*')" +
        `|\\b(${keywordPattern})\\b` +
        '|\\b(0x[0-9a-fA-F]+|\\d+\\.?\\d*)\\b',
        'g'
    );
    return code.replace(
        tokenRegex,
        (match, lineComment, preproc, hashComment, dString, sString, keyword, number) => {
            if (lineComment || hashComment) return `<span class="code-comment">${match}</span>`;
            if (preproc || keyword) return `<span class="code-keyword">${match}</span>`;
            if (dString || sString) return `<span class="code-string">${match}</span>`;
            if (number) return `<span class="code-number">${match}</span>`;
            return match;
        }
    );
};

const processMarkdownHtml = (htmlString: string): string => {
    let output = htmlString;

    // Image width handling
    output = output.replace(
        /<img src="([^"]+)\|width=(\d+)"([^>]*)>/g,
        (_match, src, width, rest) => {
            return `<img src="${src}" style="max-width: ${width}px !important; width: auto !important; height: auto !important; display: block; margin: 2rem auto; border: 1px solid #222222;" ${rest}>`;
        }
    );
    output = output.replace(/<img src="([^"]+)"([^>]*)>/g, (_match, src, rest) => {
        if (rest && rest.includes('style=')) return _match;
        return `<img src="${src}" style="max-width: 550px !important; width: auto !important; height: auto !important; display: block; margin: 2rem auto; border: 1px solid #222222;" ${rest}>`;
    });

    // Syntax highlighting inside <pre><code>
    output = output.replace(
        /(<pre><code[^>]*>)([\s\S]*?)(<\/code><\/pre>)/g,
        (_match, openTag, codeContent, closeTag) => {
            const highlighted = highlightCode(codeContent);
            return openTag + highlighted + closeTag;
        }
    );

    // Wrap <pre> with copy button (except ascii-art/matrix-box)
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

    output = output.replace(
        /(<pre[^>]*>)([\s\S]*?)(<\/pre>)/g,
        (_match, openPre, content, closePre) => {
            if (openPre.includes('ascii-art') || openPre.includes('matrix-box')) {
                return _match; // no copy button
            }
            return `<div class="code-block-wrapper">
                        <button class="copy-code-btn" aria-label="Copy code">${copyIcon}</button>
                        ${openPre}${content}${closePre}
                    </div>`;
        }
    );

    return output;
};

const Paper: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [contentHtml, setContentHtml] = useState<string>('');
    const [meta, setMeta] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [theme, setTheme] = useState<'dark' | 'light'>(getSavedTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        if (!slug) return;

        const loadMarkdown = async () => {
            try {
                const module = (await markdownModules[`../content/${slug}.md`]()) as MarkdownModule;
                const processedHtml = processMarkdownHtml(module.html);
                setContentHtml(processedHtml);
                setMeta(module.attributes || {});
                setLoading(false);
            } catch (err) {
                console.error('Failed to load paper layout:', err);
                setLoading(false);
            }
        };

        loadMarkdown();
    }, [slug]);

    // Copy button handler (event delegation)
    useEffect(() => {
        const handleCopyClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const button = target.closest('.copy-code-btn');
            if (!button) return;
            const wrapper = button.closest('.code-block-wrapper');
            if (!wrapper) return;
            const pre = wrapper.querySelector('pre');
            if (!pre) return;
            const code = pre.querySelector('code');
            const text = code ? code.textContent || '' : pre.textContent || '';

            navigator.clipboard.writeText(text).then(() => {
                const svg = button.querySelector('svg');
                if (svg) svg.style.stroke = '#00ff00';
                button.classList.add('copied');
                setTimeout(() => {
                    if (svg) svg.style.stroke = '';
                    button.classList.remove('copied');
                }, 1500);
            }).catch(err => console.warn('Copy failed:', err));
        };

        document.addEventListener('click', handleCopyClick);
        return () => document.removeEventListener('click', handleCopyClick);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    if (loading) return (
        <div className="paper-fallback-screen">
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
            Base: Accessing encrypted memory sector...
        </div>
    );
    if (!contentHtml) return (
        <div className="paper-error-screen">
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
            [!] ERROR 404: TARGET MEMORY BLOCK NOT FOUND<br /><br />
            <Link to="/" className="home-backlink">❮ Return Home</Link>
        </div>
    );

    return (
        <main className="paper-isolated-wrapper">
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

            {/* iPhone‑style toggle */}
            <button
                className="paper-theme-switch"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                role="switch"
                aria-checked={theme === 'light'}
            >
                <div className="paper-theme-switch-thumb">
                    <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
                </div>
            </button>

            <div className="paper-container-inner">
                <nav className="paper-nav-links">
                    <Link to="/">Home</Link> / <Link to="/blogs">Blogs</Link> /{' '}
                    <span className="active-nav-node">{meta.title || 'Untitled Paper'}</span>
                </nav>
                <h1 className="paper-title-outside">{meta.title || 'Untitled Paper'}</h1>
                <div className="paper-author-title">{meta.author || 'Unknown Researcher'}</div>
                <div className="paper-post-meta">
                    Date: {meta.date || 'Unknown'} // Sector: /content/{slug}.md // Status: {meta.status || 'Active'}
                </div>

                <div
                    className="markdown-body max-w-full w-full p-6 rounded-md shadow-2xl"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                <footer>
                    <hr className="paper-minimal-divider" />
                    <p className="paper-disclaimer">
                        Note: This paper is for educational purposes only. Everyone is responsible for their own actions.
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default Paper;