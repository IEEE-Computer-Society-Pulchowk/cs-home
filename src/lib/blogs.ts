import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
    getPersonByLookupId,
    getPersonProfilePath,
} from "@/data/people";
import { getPersonPrimaryTeamRole } from "@/data/team";

const postsDirectory = path.join(process.cwd(), "src/content/blogs");

export interface BlogLookupResult {
    slug?: string;
    content?: string;
    title?: string;
    excerpt?: string;
    date?: string;
    author?: string;
    authorId?: string;
    authorRole?: string;
    authorProfilePath?: string;
    category?: string;
    thumbnail?: string;
    imageUrl?: string;
    readTime?: string;
    [key: string]: unknown;
}

export function getPostSlugs() {
    return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []): BlogLookupResult {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const items: BlogLookupResult = {};

    // Ensure minimal required fields
    items["slug"] = realSlug;
    items["content"] = content;

    fields.forEach((field) => {
        if (field === "slug") {
            items[field] = realSlug;
        }
        if (field === "content") {
            items[field] = content;
        }

        if (typeof data[field] !== "undefined") {
            items[field] = data[field];
        }
    });

    const authorLookupId = String(data.authorId ?? data.author ?? "").trim();

    if (authorLookupId) {
        const person = getPersonByLookupId(authorLookupId);

        if (person) {
            const primaryRole = getPersonPrimaryTeamRole(person.id)?.role;

            items.authorId = person.id;
            items.author = person.name;
            items.authorRole =
                typeof data.authorRole === "string" && data.authorRole.trim().length > 0
                    ? data.authorRole
                    : (primaryRole ?? "Contributor");
            items.authorProfilePath = getPersonProfilePath(person.id);
        }
    }

    return items;
}

export function getAllPosts(fields: string[] = []): BlogLookupResult[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug, fields))
        // sort posts by date in descending order
        .sort((post1, post2) => ((post1.date ?? "") > (post2.date ?? "") ? -1 : 1));
    return posts;
}
