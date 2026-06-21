// src/pages/blog.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';

// Load all markdown files from ../content/
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

// ── Styles (dark default, light overrides) ──
const styles = `
  /* ---------- Dark mode (default) ---------- */
  body { background: #000; color: #fff; font-family: sans-serif; transition: background 0.3s, color 0.3s; }
  .container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }

  .breadcrumb {
    margin-bottom: 2.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    color: #444444;
  }
  .breadcrumb a {
    color: #666666 !important;
    text-decoration: none !important;
    transition: color 0.2s;
  }
  .breadcrumb a:hover {
    color: #d4af37 !important;
  }
  .breadcrumb .active {
    color: #d4af37 !important;
    font-weight: bold !important;
  }

  .page-title { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
  .subtitle { color: #888; margin-bottom: 2rem; }

  .filters { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .filters input, .filters select {
    background: #111; border: 1px solid #333; color: #fff;
    padding: 0.4rem 0.8rem; font-size: 0.9rem; border-radius: 4px;
  }
  .filters input:focus, .filters select:focus { outline: none; border-color: #fff; }

  .post-card {
    border: 1px solid #222; padding: 1.5rem; margin-bottom: 1.5rem;
    background: #0a0a0a;
  }
  .post-card .title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.3rem; }
  .post-card .title a { color: #fff; text-decoration: none; }
  .post-card .title a:hover { text-decoration: underline; }
  .post-meta { color: #888; font-size: 0.85rem; margin: 0.3rem 0; display: flex; gap: 1.5rem; flex-wrap: wrap; }
  .read-more { color: #aaa; text-decoration: underline; display: inline-block; margin-top: 0.5rem; }
  .read-more:hover { color: #fff; }

  .pagination { display: flex; gap: 1rem; margin-top: 2rem; justify-content: center; }
  .pagination button {
    background: transparent; border: 1px solid #333; color: #fff;
    padding: 0.4rem 1rem; cursor: pointer; font-size: 0.9rem; border-radius: 4px;
  }
  .pagination button:hover:not(:disabled) { border-color: #fff; }
  .pagination button:disabled { opacity: 0.3; cursor: not-allowed; }
  .pagination .info { color: #888; align-self: center; }

  .divider { border: 0; border-top: 1px solid #222; margin: 3rem 0; }
  .footer-note { color: #444; font-size: 0.85rem; }

  /* Post detail styles */
  .post-detail .meta { color: #888; margin: 1rem 0 2rem; }
  .post-detail .content { border: 1px solid #222; background: #0a0a0a; padding: 2rem; border-radius: 4px; }
  .post-detail .content h1, .post-detail .content h2, .post-detail .content h3 { color: #fff; }
  .post-detail .content p { color: #ddd; line-height: 1.6; }
  .post-detail .content a { color: #aaa; }
  .post-detail .content a:hover { color: #fff; }
  .post-detail .content pre { background: #111; border: 1px solid #222; padding: 1rem; overflow-x: auto; }
  .post-detail .content code { background: #111; padding: 0.2rem 0.4rem; border-radius: 3px; color: #e5e5e5; }
  .post-detail .content blockquote { border-left: 3px solid #555; padding-left: 1rem; color: #888; }
  .post-detail .content img { max-width: 100%; border: 1px solid #222; margin: 1rem 0; }
  .post-detail .content ul, .post-detail .content ol { color: #ccc; }
  .post-detail .content table { border-collapse: collapse; margin: 1rem 0; }
  .post-detail .content th, .post-detail .content td { border: 1px solid #333; padding: 0.5rem; }

  .fallback { background: #000; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; }
  .error { background: #000; color: #f00; padding: 3rem; }

  /* ---------- iPhone‑style theme toggle ---------- */
  .theme-switch {
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
  }
  .theme-switch[aria-checked="true"] {
    background: #4a90e2;
  }
  .theme-switch-thumb {
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
  .theme-switch[aria-checked="true"] .theme-switch-thumb {
    transform: translateX(26px);
  }
  .theme-switch-thumb span {
    line-height: 1;
    pointer-events: none;
  }

  /* ---------- Light mode overrides ---------- */
  body.light-theme { background: #ffffff; color: #111111; }
  body.light-theme .breadcrumb { color: #777; }
  body.light-theme .breadcrumb a { color: #555 !important; }
  body.light-theme .breadcrumb a:hover { color: #d4af37 !important; }
  body.light-theme .breadcrumb .active { color: #b38b1a !important; }
  body.light-theme .subtitle { color: #666; }
  body.light-theme .filters input,
  body.light-theme .filters select {
    background: #f4f4f4; border: 1px solid #ccc; color: #111;
  }
  body.light-theme .filters input:focus,
  body.light-theme .filters select:focus { border-color: #111; }
  body.light-theme .post-card {
    background: #fafafa; border-color: #ddd;
  }
  body.light-theme .post-card .title a { color: #111; }
  body.light-theme .post-meta { color: #666; }
  body.light-theme .read-more { color: #555; }
  body.light-theme .read-more:hover { color: #111; }
  body.light-theme .pagination button {
    border-color: #ccc; color: #111;
  }
  body.light-theme .pagination button:hover:not(:disabled) { border-color: #111; }
  body.light-theme .pagination .info { color: #666; }
  body.light-theme .divider { border-top-color: #ddd; }
  body.light-theme .footer-note { color: #999; }
  body.light-theme .post-detail .meta { color: #666; }
  body.light-theme .post-detail .content {
    background: #fafafa; border-color: #ddd;
  }
  body.light-theme .post-detail .content h1,
  body.light-theme .post-detail .content h2,
  body.light-theme .post-detail .content h3 { color: #111; }
  body.light-theme .post-detail .content p { color: #333; }
  body.light-theme .post-detail .content a { color: #555; }
  body.light-theme .post-detail .content a:hover { color: #111; }
  body.light-theme .post-detail .content pre {
    background: #f0f0f0; border-color: #ccc;
  }
  body.light-theme .post-detail .content code {
    background: #f0f0f0; color: #333;
  }
  body.light-theme .post-detail .content blockquote {
    border-left-color: #999; color: #666;
  }
  body.light-theme .post-detail .content img { border-color: #ccc; }
  body.light-theme .post-detail .content ul, .post-detail .content ol { color: #444; }
  body.light-theme .post-detail .content th, .post-detail .content td { border-color: #ccc; }
  body.light-theme .fallback { background: #fff; color: #111; }
  body.light-theme .error { background: #fff; }
  body.light-theme .theme-switch { background: #e0e0e0; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
  body.light-theme .theme-switch[aria-checked="true"] { background: #4a90e2; }
`;

// ── Utilities ──
const stripHtml = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

// ── Main component ──
const Blogs: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        applyTheme(getSavedTheme());
    }, []);

    if (slug) {
        return <BlogPost slug={slug} />;
    }
    return <BlogListing />;
};

// ── iPhone‑style Theme Toggle ──
const ThemeToggle = () => {
    const [theme, setTheme] = useState(getSavedTheme());

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
    };

    return (
        <button
            className="theme-switch"
            onClick={toggle}
            aria-label="Toggle theme"
            role="switch"
            aria-checked={theme === 'light'}
        >
            <div className="theme-switch-thumb">
                <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            </div>
        </button>
    );
};

// ── Blog listing ──
const BlogListing: React.FC = () => {
    const [allPosts, setAllPosts] = useState<
        Array<{ slug: string; attributes: any; excerpt: string }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        const loadAll = async () => {
            try {
                const promises = Object.entries(markdownModules).map(async ([path, loader]) => {
                    const slug = path.replace('../content/', '').replace('.md', '');
                    const module = (await loader()) as MarkdownModule;
                    const plain = stripHtml(module.html);
                    const excerpt = plain.length > 150 ? plain.slice(0, 150) + '…' : plain;
                    return {
                        slug,
                        attributes: module.attributes || {},
                        excerpt,
                    };
                });
                const results = await Promise.all(promises);
                results.sort((a, b) => {
                    if (a.attributes.date && b.attributes.date) {
                        return new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime();
                    }
                    return a.slug.localeCompare(b.slug);
                });
                setAllPosts(results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const categories = useMemo(() => {
        const set = new Set<string>();
        allPosts.forEach(p => {
            if (p.attributes.category) set.add(p.attributes.category);
        });
        return ['All', ...Array.from(set)];
    }, [allPosts]);

    const filtered = useMemo(() => {
        return allPosts.filter(p => {
            const matchTitle = p.attributes.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
            const matchCat = selectedCategory === 'All' || p.attributes.category === selectedCategory;
            return matchTitle && matchCat;
        });
    }, [allPosts, searchTerm, selectedCategory]);

    const totalPages = Math.ceil(filtered.length / postsPerPage);
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * postsPerPage;
        return filtered.slice(start, start + postsPerPage);
    }, [filtered, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    if (loading) {
        return (
            <div className="fallback">
                <style>{styles}</style>
                Loading…
            </div>
        );
    }

    return (
        <div className="container">
            <style>{styles}</style>
            <ThemeToggle />

            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span className="active">Blogs</span>
            </div>

            <h1 className="page-title">Blog</h1>
            <p className="subtitle">Articles, thoughts, and explorations.</p>

            <div className="filters">
                <div>
                    <span style={{ marginRight: '0.3rem' }}>Search:</span>
                    <input
                        type="text"
                        placeholder="Filter by title…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <span style={{ marginRight: '0.3rem' }}>Category:</span>
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    {filtered.length} post{filtered.length !== 1 ? 's' : ''}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p>No posts match your criteria.</p>
            ) : (
                <>
                    {paginated.map(post => {
                        const { slug, attributes } = post;
                        const title = attributes.title || slug;
                        const author = attributes.author || 'Anonymous';
                        const date = attributes.date || 'Unknown';
                        const category = attributes.category || 'Uncategorized';

                        return (
                            <div key={slug} className="post-card">
                                <div className="title">
                                    <Link to={`/blog/${slug}`}>{title}</Link>
                                </div>
                                <div className="post-meta">
                                    <span>Date: {date}</span>
                                    <span>Author: {author}</span>
                                    <span>Category: {category}</span>
                                </div>
                                <Link to={`/blog/${slug}`} className="read-more">Read more →</Link>
                            </div>
                        );
                    })}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="info">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            <hr className="divider" />
            <p className="footer-note">All content is for educational purposes only.</p>
        </div>
    );
};

// ── Individual blog post ──
const BlogPost: React.FC<{ slug: string }> = ({ slug }) => {
    const [html, setHtml] = useState('');
    const [meta, setMeta] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const module = (await markdownModules[`../content/${slug}.md`]()) as MarkdownModule;
                setHtml(module.html);
                setMeta(module.attributes || {});
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="fallback">
                <style>{styles}</style>
                Loading…
            </div>
        );
    }

    if (!html) {
        return (
            <div className="error">
                <style>{styles}</style>
                Post not found.<br /><br />
                <Link to="/blog" style={{ color: '#aaa' }}>← Back to Blog</Link>
            </div>
        );
    }

    const title = meta.title || slug;
    const author = meta.author || 'Anonymous';
    const date = meta.date || 'Unknown';
    const category = meta.category || 'Uncategorized';

    return (
        <div className="container post-detail">
            <style>{styles}</style>
            <ThemeToggle />

            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> /{' '}
                <span className="active">{title}</span>
            </div>

            <h1 className="page-title">{title}</h1>
            <div className="meta">
                Author: {author} &middot; Date: {date} &middot; Category: {category}
            </div>

            <div className="content" dangerouslySetInnerHTML={{ __html: html }} />

            <hr className="divider" />
            <p className="footer-note">This post is for educational purposes only.</p>
        </div>
    );
};

export default Blogs;