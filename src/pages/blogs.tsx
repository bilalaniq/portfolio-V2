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

// ── Minimal black & white styles ──
const styles = `
  body { background: #000; color: #fff; font-family: sans-serif; }
  .container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }

  /* ── Breadcrumb (now matches .paper-nav-links) ── */
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
    padding: 0.4rem 0.8rem; font-size: 0.9rem;
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
    padding: 0.4rem 1rem; cursor: pointer; font-size: 0.9rem;
  }
  .pagination button:hover:not(:disabled) { border-color: #fff; }
  .pagination button:disabled { opacity: 0.3; cursor: not-allowed; }
  .pagination .info { color: #888; align-self: center; }

  .divider { border: 0; border-top: 1px solid #222; margin: 3rem 0; }
  .footer-note { color: #444; font-size: 0.85rem; }

  /* Post detail styles */
  .post-detail .meta { color: #888; margin: 1rem 0 2rem; }
  .post-detail .content { border: 1px solid #222; background: #0a0a0a; padding: 2rem; }
  .post-detail .content h1, .post-detail .content h2, .post-detail .content h3 { color: #fff; }
  .post-detail .content p { color: #ddd; line-height: 1.6; }
  .post-detail .content a { color: #aaa; }
  .post-detail .content a:hover { color: #fff; }
  .post-detail .content pre { background: #111; border: 1px solid #222; padding: 1rem; overflow-x: auto; }
  .post-detail .content code { background: #111; padding: 0.2rem 0.4rem; border-radius: 3px; }
  .post-detail .content blockquote { border-left: 3px solid #555; padding-left: 1rem; color: #888; }
  .post-detail .content img { max-width: 100%; border: 1px solid #222; margin: 1rem 0; }

  .fallback { background: #000; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; }
  .error { background: #000; color: #f00; padding: 3rem; }
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

    if (slug) {
        return <BlogPost slug={slug} />;
    }
    return <BlogListing />;
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

            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span className="active">Blogs</span>
            </div>

            <h1 className="page-title">Blog</h1>
            <p className="subtitle">Articles, thoughts, and explorations.</p>

            <div className="filters">
                <div>
                    <span style={{ color: '#888', marginRight: '0.3rem' }}>Search:</span>
                    <input
                        type="text"
                        placeholder="Filter by title…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <span style={{ color: '#888', marginRight: '0.3rem' }}>Category:</span>
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div style={{ color: '#888' }}>
                    {filtered.length} post{filtered.length !== 1 ? 's' : ''}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p style={{ color: '#888' }}>No posts match your criteria.</p>
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