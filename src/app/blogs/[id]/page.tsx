import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import ShareButton from "@/components/share-button";
import { getPostBySlug, getAllPosts } from "@/lib/blogs";
import { getEventBySlug } from "@/lib/events.server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { transformPersonMentions } from "@/lib/mentions";
import { plainDescription } from "@/lib/description";
import type { BlogPost } from "@/types";
import BlogCard from "@/components/blog-card";
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

  const authorPerson = postData.authorId
    ? getPersonById(postData.authorId)
    : undefined;
  const authorImage =
    authorPerson?.imageUrl ??
    (authorPerson
      ? getPersonPortraitPath(authorPerson.slug)
      : getPersonPortraitPath("default"));

  // Fetch related posts for sidebar/bottom
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== id).slice(0, 2);

  const relatedEvent = postData.event
    ? getEventBySlug(postData.event)
    : undefined;
  const sameEventPosts = allPosts.filter(
    (p) => p.event !== undefined && p.event === postData.event && p.slug !== id,
  );
  const relatedBlogs: BlogPost[] = sameEventPosts.map((post) => ({
    id: post.slug ?? "",
    title: post.title ?? "Untitled",
    excerpt: post.excerpt ?? "",
    date: post.date ?? "",
    category: post.category ?? "General",
    event: post.event,
    imageUrl: post.thumbnail,
    readTime: post.readTime ?? "",
    author: post.author ?? "Contributor",
    authorId: post.authorId,
    authorRole: post.authorRole,
    authorProfilePath: post.authorProfilePath,
    content: "",
  }));

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
            <div className="relative w-12 h-12 bg-gray-50 border border-gray-100 rounded-full overflow-hidden shrink-0">
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
                {postData.authorRole || "Contributor"} • {postData.date}
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
            <div className="relative aspect-video w-full">
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
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

      {(relatedEvent || relatedBlogs.length > 0) && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {relatedBlogs.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3"></span>
                Related Blog Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {relatedEvent && (
            <section className="mt-20 mb-4 max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3"></span>
                Related Event
              </h2>
              <Link
                href={`/events/${relatedEvent.slug}`}
                className="group block bg-gray-50 p-6 rounded-xl hover:bg-amber-50 transition-colors border border-gray-100"
              >
                <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                  {relatedEvent.category}
                </span>
                <h4 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-ieee-cs-orange transition-colors">
                  {relatedEvent.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {relatedEvent.description
                    ? plainDescription(relatedEvent.description)
                    : ""}
                </p>
              </Link>
            </section>
          )}
        </div>
      )}
    </article>
  );
}
