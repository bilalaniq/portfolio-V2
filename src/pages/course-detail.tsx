// src/pages/course-detail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

const courseJsonModules = import.meta.glob('../content/*/course.json');

interface ModuleInfo {
    file: string;
    title: string;
}

interface CourseData {
    title: string;
    description: string;
    author?: string;
    date?: string;
    modules: ModuleInfo[];
}

// ── Theme helpers (identical to blogs page) ──
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

// ── Styles (exact same CSS from Blogs) ──
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
  .breadcrumb a:hover { color: #d4af37 !important; }
  .breadcrumb .active {
    color: #d4af37 !important;
    font-weight: bold !important;
  }

  .page-title { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
  .subtitle { color: #888; margin-bottom: 2rem; }

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

  .divider { border: 0; border-top: 1px solid #222; margin: 3rem 0; }
  .footer-note { color: #444; font-size: 0.85rem; }

  .fallback { background: #000; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; }
  .error { background: #000; color: #f00; padding: 3rem; }

  /* Theme toggle (identical to blogs page) */
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
  .theme-switch[aria-checked="true"] { background: #4a90e2; }
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
  .theme-switch[aria-checked="true"] .theme-switch-thumb { transform: translateX(26px); }
  .theme-switch-thumb span { line-height: 1; pointer-events: none; }

  /* Light mode overrides (same as blogs page) */
  body.light-theme { background: #ffffff; color: #111111; }
  body.light-theme .breadcrumb { color: #777; }
  body.light-theme .breadcrumb a { color: #555 !important; }
  body.light-theme .breadcrumb a:hover { color: #d4af37 !important; }
  body.light-theme .breadcrumb .active { color: #b38b1a !important; }
  body.light-theme .subtitle { color: #666; }
  body.light-theme .post-card { background: #fafafa; border-color: #ddd; }
  body.light-theme .post-card .title a { color: #111; }
  body.light-theme .post-meta { color: #666; }
  body.light-theme .read-more { color: #555; }
  body.light-theme .read-more:hover { color: #111; }
  body.light-theme .divider { border-top-color: #ddd; }
  body.light-theme .footer-note { color: #999; }
  body.light-theme .fallback { background: #fff; color: #111; }
  body.light-theme .error { background: #fff; }
  body.light-theme .theme-switch { background: #e0e0e0; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
  body.light-theme .theme-switch[aria-checked="true"] { background: #4a90e2; }
`;

const ThemeToggle: React.FC = () => {
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

const CourseDetail: React.FC = () => {
    const { courseSlug } = useParams<{ courseSlug: string }>();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        applyTheme(getSavedTheme());
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const loader = courseJsonModules[`../content/${courseSlug}/course.json`];
                if (!loader) throw new Error('Course not found');
                const imported = await loader();
                const data: CourseData = (imported as any).default || imported;
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [courseSlug]);

    if (loading) return (
        <div className="fallback">
            <style>{styles}</style>
            Loading…
        </div>
    );
    if (!course) return (
        <div className="error">
            <style>{styles}</style>
            Course not found.<br /><br />
            <Link to="/blogs" style={{ color: '#aaa' }}>← Back to Blog & Courses</Link>
        </div>
    );

    return (
        <div className="container">
            <style>{styles}</style>
            <ThemeToggle />

            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/blogs">Blog & Courses</Link> /{' '}
                <span className="active">{course.title}</span>
            </div>

            <h1 className="page-title">{course.title}</h1>
            <p className="subtitle">{course.description}</p>

            <h2 style={{ marginTop: '2rem' }}>Modules</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {course.modules.map((mod, idx) => {
                    const moduleSlug = mod.file.replace('.md', '');
                    return (
                        <li key={idx} style={{ marginBottom: '0.8rem' }}>
                            <Link
                                to={`/blogs/courses/${courseSlug}/${moduleSlug}`}
                                className="read-more"
                            >
                                {mod.title || moduleSlug}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <hr className="divider" />
            <p className="footer-note">All content is for educational purposes only.</p>
        </div>
    );
};

export default CourseDetail;