"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import BlogCard from "@/components/blog-card";
import PageHeader from "@/components/page-header";
import FilterButton from "@/components/filter-button";
import EmptyState from "@/components/empty-state";
import { BlogPost } from "@/types";

interface BlogListProps {
  posts: BlogPost[];
}

const BlogListContent: React.FC<BlogListProps> = ({ posts }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  const queryQ = searchParams.get("q");
  const initialQ = queryQ ?? "";

  const queryCat = searchParams.get("cat");
  const initialCat = categories.includes(queryCat ?? "")
    ? (queryCat as string)
    : "All";

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  // Sync state when the URL changes (back/forward buttons, manual edits).
  const prevParams = searchParams.toString();
  const [prevSearch, setPrevSearch] = useState(prevParams);
  if (prevParams !== prevSearch) {
    setPrevSearch(prevParams);
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
    const c = searchParams.get("cat");
    if (categories.includes(c ?? "")) setSelectedCategory(c as string);
  }

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(
      params.size ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateParam("q", value, "");
  };

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    updateParam("cat", category, "All");
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const otherPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : [];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Insights & Updates"
          subtitle="Articles, research highlights, and stories from the IEEE Pulchowk community."
        />

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ieee-cs-orange/20 focus:border-ieee-cs-orange transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <FaFilter size={18} className="text-gray-400 shrink-0 mr-1" />
            {categories.map((category) => (
              <FilterButton
                key={category}
                active={selectedCategory === category}
                onClick={() => handleCategory(category)}
              >
                {category}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3"></span>
              Featured Story
            </h2>
            <BlogCard post={featuredPost} featured={true} />
          </motion.div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(selectedCategory === "All" && !searchQuery
            ? otherPosts
            : filteredPosts
          ).map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <EmptyState
            message="No articles found matching your criteria."
            actionLabel="Clear filters"
            onAction={() => {
              handleSearch("");
              handleCategory("All");
            }}
          />
        )}
      </div>
    </div>
  );
};

const BlogList: React.FC<BlogListProps> = ({ posts }) => (
  <Suspense fallback={null}>
    <BlogListContent posts={posts} />
  </Suspense>
);

export default BlogList;
