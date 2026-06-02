import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft, FaClock } from "react-icons/fa";
import ShareButton from "@/components/share-button";
import {
    getPostBySlug,
    getAllPosts,
    type BlogLookupResult,
} from "@/lib/blogs";
import ReactMarkdown from "react-markdown";
import { transformPersonMentions } from "@/lib/mentions";
import SmartImage from "@/components/smart-image";
import { getPersonById, getPersonImageSource } from "@/data/people";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = getPostBySlug(id, ["title", "excerpt", "thumbnail"]);

    return {
        title: post.title as string,
        description: post.excerpt as string,
        openGraph: {
            title: post.title as string,
            description: post.excerpt as string,
            type: "article",
            ...(post.thumbnail
                ? {
                    images: [{ url: post.thumbnail as string }],
                }
                : {}),
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts(["slug"]);
    return posts.map((post) => ({
        id: post.slug as string,
    }));
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const postData = getPostBySlug(id, [
        "title",
        "date",
        "slug",
        "author",
        "authorId",
        "authorRole",
        "authorProfilePath",
        "content",
        "imageUrl",
        "category",
        "readTime",
    ]) as BlogLookupResult;

    if (!postData.slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Article Not Found
                    </h2>
                    <Link
                        href="/blogs"
                        className="text-ieee-cs-orange hover:underline"
                    >
                        Return to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    const authorPerson = postData.authorId ? getPersonById(postData.authorId) : undefined;
    const authorImage = getPersonImageSource(
        authorPerson || { id: postData.authorId || "default" }
    );

    // Fetch related posts for sidebar/bottom
    const allPosts = getAllPosts(["slug", "title", "category", "excerpt"]);
    const relatedPosts = allPosts.filter((p) => p.slug !== id).slice(0, 2);

    return (
        <article className="pt-24 pb-20 min-h-screen bg-white">
            {/* Hero / Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
                <Link
                    href="/blogs"
                    className="inline-flex items-center text-gray-500 hover:text-ieee-cs-orange transition-colors mb-8 group"
                >
                    <FaArrowLeft
                        size={16}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />{" "}
                    Back to Articles
                </Link>

                <div className="flex items-center space-x-2 mb-6">
                    <span className="bg-amber-50 text-ieee-cs-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {postData.category}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm flex items-center">
                        <FaClock size={14} className="mr-1" /> {postData.readTime}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                    {postData.title}
                </h1>

                <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 bg-gray-50 border border-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <SmartImage
                                src={authorImage}
                                alt={postData.author || "Author"}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        </div>
                        <div>
                            {postData.authorProfilePath ? (
                                <Link
                                    href={postData.authorProfilePath as string}
                                    className="text-sm font-bold text-gray-900 hover:text-ieee-cs-orange transition-colors"
                                >
                                    {postData.author}
                                </Link>
                            ) : (
                                <p className="text-sm font-bold text-gray-900">
                                    {postData.author}
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                {postData.authorRole || "Contributor"} •{" "}
                                {postData.date}
                            </p>
                        </div>
                    </div>
                    <ShareButton />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {postData.imageUrl && (
                    <div className="mb-12 rounded-xl overflow-hidden shadow-lg bg-gray-50 p-4">
                        <div className="relative aspect-[16/9] w-full">
                            <SmartImage
                                src={postData.imageUrl as string}
                                alt={postData.title as string}
                                href={postData.imageUrl as string}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 768px"
                            />
                        </div>
                    </div>
                )}

                <div className="prose prose-lg prose-amber max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown>
                        {transformPersonMentions(postData.content as string)}
                    </ReactMarkdown>
                </div>

                {relatedPosts.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            More Blogs:
                        </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedPosts.map((related) => (
                            <Link
                                key={related.slug}
                                href={`/blogs/${related.slug}`}
                                className="group block bg-gray-50 p-6 rounded-xl hover:bg-amber-50 transition-colors"
                            >
                                <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                                    {related.category}
                                </span>
                                <h4 className="font-bold text-gray-900 group-hover:text-ieee-cs-orange transition-colors mb-2">
                                    {related.title}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {related.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>)}
            </div>
        </article>
    );
}
