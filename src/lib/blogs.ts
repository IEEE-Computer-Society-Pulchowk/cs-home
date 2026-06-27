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

export function getPostBySlug(slug: string): BlogLookupResult {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

    const items: BlogLookupResult = { ...data, slug: realSlug, content };

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

export function getAllPosts(): BlogLookupResult[] {
    return getPostSlugs()
        .map((slug) => getPostBySlug(slug))
        // sort posts by date in descending order
        .sort((post1, post2) => ((post1.date ?? "") > (post2.date ?? "") ? -1 : 1));
}
