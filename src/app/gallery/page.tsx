"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_ITEMS } from "@/data/gallery";
import { GalleryItem, GalleryCategory } from "@/types";
import { FaSearchPlus, FaTimes } from "react-icons/fa";
import SmartImage from "@/components/smart-image";
import PageHeader from "@/components/page-header";

const newLocal =
  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6";

const GalleryContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categories: Array<GalleryCategory | "All"> = [
    "All",
    ...Array.from(new Set(GALLERY_ITEMS.map((item) => item.category))),
  ];

  const queryCat = searchParams.get("cat");
  const initialCat = categories.includes(queryCat as GalleryCategory | "All")
    ? (queryCat as GalleryCategory | "All")
    : "All";

  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<GalleryCategory | "All">(initialCat);

  // Sync state when the URL changes (back/forward buttons, manual edits).
  const prevParams = searchParams.toString();
  const [prevSearch, setPrevSearch] = useState(prevParams);
    if (prevParams !== prevSearch) {
        setPrevSearch(prevParams);
        const c = searchParams.get("cat");
        setFilter(
            c && categories.includes(c as GalleryCategory | "All")
                ? (c as GalleryCategory | "All")
                : "All",
        );
    }

  const handleFilter = (cat: GalleryCategory | "All") => {
    setFilter(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("cat");
    } else {
      params.set("cat", cat);
    }
    router.replace(
      params.size ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
  };

  const filteredImages =
    filter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Gallery"
          subtitle="A visual journey through our events, workshops, and community gatherings."
        />

        {/* Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-ieee-cs-orange text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer bg-gray-100"
              onClick={() => setSelectedImage(item)}
            >
              <SmartImage
                src={item.imageUrl}
                alt={item.title}
                href={item.imageUrl}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedImage(item);
                }}
                loading="lazy"
              />

              {/* Overlay */}
              <div className={newLocal}>
                <span className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                  {item.category} • {item.date}
                </span>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                  <FaSearchPlus className="text-white" size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes size={32} />
            </button>

            <div
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl mb-6"
              />

              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {selectedImage.category} • {selectedImage.date}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Gallery: React.FC = () => (
  <Suspense
    fallback={
      <div className="pt-24 pb-20 min-h-screen bg-white text-center text-gray-500">
        Loading gallery...
      </div>
    }
  >
    <GalleryContent />
  </Suspense>
);

export default Gallery;
