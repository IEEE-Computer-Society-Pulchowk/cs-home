import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import ShareButton from "@/components/share-button";
import { getPostBySlug, getAllPosts } from "@/lib/blogs";
import ReactMarkdown from "react-markdown";
import { transformPersonMentions } from "@/lib/mentions";
import SmartImage from "@/components/smart-image";
import { getPersonById, getPersonPortraitPath } from "@/data/people";
import NotFound from "@/components/not-found";
import Badge from "@/components/badge";
import BackLink from "@/components/back-link";
import RelatedGrid from "@/components/related-grid";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = getPostBySlug(id);

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
    const posts = getAllPosts();
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
    const postData = getPostBySlug(id);

    if (!postData.slug) {
        return (
            <NotFound
                title="Article Not Found"
                backHref="/blogs"
                backLabel="Return to Blogs"
            />
        );
    }

    const authorPerson = postData.authorId ? getPersonById(postData.authorId) : undefined;
    const authorImage =
      authorPerson?.imageUrl ??
      (authorPerson
        ? getPersonPortraitPath(authorPerson.slug)
        : getPersonPortraitPath("default"));

    // Fetch related posts for sidebar/bottom
    const allPosts = getAllPosts();
    const relatedPosts = allPosts.filter((p) => p.slug !== id).slice(0, 2);

    return (
        <article className="pt-24 pb-20 min-h-screen bg-white">
            {/* Hero / Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
                <BackLink href="/blogs" label="Back to Articles" />

                <div className="flex items-center space-x-2 mb-6">
                    <Badge>{postData.category}</Badge>
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

                <RelatedGrid
                    title="More Blogs:"
                    items={relatedPosts.map((related) => ({
                        href: `/blogs/${related.slug}`,
                        eyebrow: related.category as string,
                        title: related.title as string,
                        body: related.excerpt as string,
                    }))}
                />
            </div>
        </article>
    );
}
