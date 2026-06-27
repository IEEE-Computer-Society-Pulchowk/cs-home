import React from "react";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blogs";
import BlogList from "@/components/blog-list";
import { BlogPost } from "@/types";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Articles, research highlights, and stories from the IEEE Computer Society Pulchowk SBC community.",
    openGraph: {
        title: "Blog | IEEE Computer Society Pulchowk SBC",
        description:
            "Articles, research highlights, and stories from the IEEE Computer Society Pulchowk SBC community.",
    },
};

export default function BlogsPage() {
    const posts = getAllPosts();

    const formattedPosts: BlogPost[] = posts.map((post) => ({
        id: post.slug ?? "",
        title: post.title ?? "Untitled",
        excerpt: post.excerpt ?? "",
        date: post.date ?? "",
        category: post.category ?? "General",
        imageUrl: post.thumbnail,
        readTime: post.readTime ?? "",
        author: post.author ?? "Contributor",
        authorId: post.authorId,
        authorRole: post.authorRole,
        authorProfilePath: post.authorProfilePath,
        content: "", // Content not needed for listing
    }));

    return <BlogList posts={formattedPosts} />;
}
