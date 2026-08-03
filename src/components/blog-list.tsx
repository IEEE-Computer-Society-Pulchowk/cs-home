"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FaSearch, FaFilter } from "react-icons/fa";
import BlogCard from "@/components/blog-card";
import PageHeader from "@/components/page-header";
import FilterButton from "@/components/filter-button";
import FilterDropdown from "@/components/filter-dropdown";
import EmptyState from "@/components/empty-state";
import {
  ALL,
  NO_EVENT,
  eventFilterOptions,
  yearFromDate,
  yearFilterOptions,
} from "@/lib/filters";
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
  const eventOptions = eventFilterOptions(posts.map((p) => p.event));
  const yearOptions = yearFilterOptions(
    posts.map((p) => yearFromDate(p.date)).filter((y): y is string => !!y),
  );

  const queryQ = searchParams.get("q");
  const initialQ = queryQ ?? "";

  const queryCat = searchParams.get("cat");
  const initialCat = categories.includes(queryCat ?? "")
    ? (queryCat as string)
    : "All";

  const queryEvent = searchParams.get("event");
  const initialEvent = eventOptions.some((o) => o.value === queryEvent)
    ? (queryEvent as string)
    : ALL;

  const queryYear = searchParams.get("year");
  const initialYear = yearOptions.some((o) => o.value === queryYear)
    ? (queryYear as string)
    : ALL;

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [eventFilter, setEventFilter] = useState(initialEvent);
  const [yearFilter, setYearFilter] = useState(initialYear);

  // Sync state when the URL changes (back/forward buttons, manual edits).
  const prevParams = searchParams.toString();
  const [prevSearch, setPrevSearch] = useState(prevParams);
  if (prevParams !== prevSearch) {
    setPrevSearch(prevParams);
    const q = searchParams.get("q");
    setSearchQuery(q ?? "");
    const c = searchParams.get("cat");
    setSelectedCategory(c && categories.includes(c) ? c : "All");
    const e = searchParams.get("event");
    setEventFilter(e && eventOptions.some((o) => o.value === e) ? e : ALL);
    const y = searchParams.get("year");
    setYearFilter(y && yearOptions.some((o) => o.value === y) ? y : ALL);
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

  const handleEvent = (value: string) => {
    setEventFilter(value);
    updateParam("event", value, ALL);
  };

  const handleYear = (value: string) => {
    setYearFilter(value);
    updateParam("year", value, ALL);
  };

  const isFiltered =
    selectedCategory !== "All" ||
    !!searchQuery ||
    eventFilter !== ALL ||
    yearFilter !== ALL;

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent =
      eventFilter === ALL
        ? true
        : eventFilter === NO_EVENT
          ? !post.event
          : post.event === eventFilter;
    const matchesYear =
      yearFilter === ALL || yearFromDate(post.date) === yearFilter;
    return matchesCategory && matchesSearch && matchesEvent && matchesYear;
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
        <div className="mb-12 bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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

          <div className="flex flex-wrap items-center gap-4">
            <FilterDropdown
              label="Event"
              value={eventFilter}
              options={eventOptions}
              onChange={handleEvent}
            />
            <FilterDropdown
              label="Year"
              value={yearFilter}
              options={yearOptions}
              onChange={handleYear}
            />
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && !isFiltered && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-8 bg-ieee-cs-orange rounded-full mr-3"></span>
              Featured Story
            </h2>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(!isFiltered ? otherPosts : filteredPosts).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <EmptyState
            message="No articles found matching your criteria."
            actionLabel="Clear filters"
            onAction={() => {
              handleSearch("");
              handleCategory("All");
              handleEvent(ALL);
              handleYear(ALL);
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
