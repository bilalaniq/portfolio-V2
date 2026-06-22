import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from "motion/react";
import { CalendarDays, Folder, FileText, ChevronRight } from "lucide-react";
import MaxWidthWrapper from './max-width-wrapper';

interface PostMeta {
    slug: string;
    title: string;
    author: string;
    date: string;
    category: string;
    status: string;
    type: 'post' | 'course';
}

const LatestBlogPosts: React.FC = () => {
    const [items, setItems] = useState<PostMeta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            // Blog posts
            const markdownModules = import.meta.glob('../content/*.md');
            // Courses
            const courseModules = import.meta.glob('../content/*/course.json');

            const allItems: PostMeta[] = [];

            // Load blog posts
            for (const [path, importFn] of Object.entries(markdownModules)) {
                try {
                    const module = await importFn() as any;
                    const slug = path.replace('../content/', '').replace('.md', '');
                    const attrs = module.attributes || {};
                    allItems.push({
                        slug,
                        title: attrs.title || 'Untitled',
                        author: attrs.author || 'Unknown',
                        date: attrs.date || '1970-01-01',
                        category: attrs.category || 'Uncategorized',
                        status: attrs.status || 'Draft',
                        type: 'post',
                    });
                } catch (e) {
                    console.error('Failed to load post:', path, e);
                }
            }

            // Load courses
            for (const [path, importFn] of Object.entries(courseModules)) {
                try {
                    const imported = await importFn() as any;
                    const data = imported.default || imported;
                    const segments = path.split('/');
                    const courseSlug = segments[segments.length - 2]; // folder name
                    allItems.push({
                        slug: courseSlug,
                        title: data.title || courseSlug,
                        author: data.author || 'Unknown',
                        date: data.date || '1970-01-01',
                        category: data.category || 'Course',
                        status: data.status || 'Active', // optional, unused for badge
                        type: 'course',
                    });
                } catch (e) {
                    console.error('Failed to load course:', path, e);
                }
            }

            // Sort by date descending
            allItems.sort((a, b) => (a.date > b.date ? -1 : 1));
            // Take top 6
            setItems(allItems.slice(0, 6));
            setLoading(false);
        };

        loadAll();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center text-myPalette6 font-myMainFont">
                Loading latest posts...
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <section id="Blog" className="pt-32 pb-12 bg-myBackground mt-50">
            <MaxWidthWrapper>
                <div className="lg:mx-16">
                    {/* ---- Section header ---- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="font-myMainFont text-4xl md:text-5xl font-semibold text-myPalette9">
                            Latest Blog Posts
                        </h2>
                        <p className="text-myPalette6 text-base md:text-lg font-medium mt-2">
                            Recent writings on hardware, security, and low‑level systems.
                        </p>
                    </motion.div>

                    {/* ---- Grid of cards ---- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.type}-${item.slug}`}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={item.type === 'course' ? `/blogs/courses/${item.slug}` : `/blog/${item.slug}`}
                                    className="block bg-white border border-myPalette2 shadow-lg rounded-3xl p-6 hover:shadow-xl transition-shadow duration-300 group"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-myMainFont text-xl font-semibold text-myPalette9 group-hover:text-myPalette8 transition-colors">
                                            {item.title}
                                        </h3>
                                        {/* Status badge – for courses, always show "Course" */}
                                        <span className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full border ${item.type === 'course'
                                                ? 'border-myPalette8 text-myPalette8 bg-myPalette1'
                                                : item.status === 'Active'
                                                    ? 'border-green-500 text-green-500'
                                                    : item.status === 'Draft'
                                                        ? 'border-yellow-500 text-yellow-500'
                                                        : 'border-myPalette4 text-myPalette5'
                                            }`}>
                                            {item.type === 'course' ? 'Course' : item.status}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-myPalette6 font-myMainFont">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays size={14} className="text-myPalette5" />
                                            {item.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Folder size={14} className="text-myPalette5" />
                                            {item.category}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-myPalette5">
                                            <FileText size={14} />
                                            {item.author}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center text-sm font-medium text-myPalette8 group-hover:text-myPalette9 transition-colors">
                                        {item.type === 'course' ? 'View course' : 'Read more'}
                                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* ---- "View all" link ---- */}
                    <div className="text-center mt-10">
                        <Link
                            to="/blogs"
                            className="inline-block px-6 py-3 border border-myPalette4 rounded-full text-myPalette8 hover:bg-myPalette9 hover:text-myPalette1 hover:border-myPalette9 transition-all duration-200 font-myMainFont font-medium"
                        >
                            View all posts →
                        </Link>
                    </div>
                </div>
            </MaxWidthWrapper>
        </section>
    );
};

export default LatestBlogPosts;