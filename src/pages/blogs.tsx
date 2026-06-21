// src/pages/blog.tsx
import { useParams } from "react-router";

export default function Blogs() {
    const { slug } = useParams();

    if (slug) {
        // Individual blog post view
        return (
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold">Blog Post: {slug}</h1>
                <p>This is a placeholder for the full blog post content.</p>
            </div>
        );
    }

    // Blog listing page
    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p>List of all blog posts will appear here.</p>
            {/* You can map over your posts here */}
        </div>
    );
}