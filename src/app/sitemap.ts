import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blogs";
import { getAllEvents } from "@/lib/events.server";

export const dynamic = "force-static";

const SITE_URL = "https://ieeecs.pcampus.edu.np";

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const events = getAllEvents();

    const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${SITE_URL}/blogs/${post.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${SITE_URL}/events/${event.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [
        {
            url: SITE_URL,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/events`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/blogs`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/team`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/gallery`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        ...eventUrls,
        ...blogUrls,
    ];
}
