"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TEAM_PAGE_CONTENT } from "@/data/content";
import { SORTED_TEAM_YEARS, resolveTeamYear } from "@/data/team";
import MemberCard from "@/components/member-card";

const MAX_MEMBERS_PER_ROW = 4;

const splitIntoBalancedRows = <T,>(items: T[], maxPerRow: number) => {
    if (items.length <= maxPerRow) {
        return [items];
    }

    const rowCount = Math.ceil(items.length / maxPerRow);
    const baseRowSize = Math.floor(items.length / rowCount);
    const extraItems = items.length % rowCount;
    const rows: T[][] = [];
    let cursor = 0;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
        const rowSize = baseRowSize + (rowIndex < extraItems ? 1 : 0);
        rows.push(items.slice(cursor, cursor + rowSize));
        cursor += rowSize;
    }

    return rows;
};

const TeamContent: React.FC = () => {
    const years = SORTED_TEAM_YEARS;
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const queryYear = searchParams.get("year");
    const initialYear = queryYear && years.some((y) => y.year === queryYear)
        ? queryYear
        : (years[0]?.year ?? "");

    const [selectedYear, setSelectedYear] = useState(initialYear);

    // Sync selectedYear state when URL parameter changes (e.g. browser back/forward buttons)
    const [prevQueryYear, setPrevQueryYear] = useState(queryYear);
    if (queryYear !== prevQueryYear) {
        setPrevQueryYear(queryYear);
        if (queryYear && years.some((y) => y.year === queryYear)) {
            setSelectedYear(queryYear);
        }
    }

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        const params = new URLSearchParams(searchParams.toString());
        params.set("year", year);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentYear =
        years.find((entry) => entry.year === selectedYear) ?? years[0];
    const currentData = currentYear ? resolveTeamYear(currentYear) : null;

    return (
        <div className="pt-24 pb-20 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {TEAM_PAGE_CONTENT.title}
                    </h1>
                    <p
                        className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                        {TEAM_PAGE_CONTENT.description}
                    </p>

                    {/* Year Selector */}
                    <div className="relative inline-block text-left">
                        <div className="flex items-center justify-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                            {years.map((year) => (
                                <button
                                    key={year.year}
                                    onClick={() => handleYearChange(year.year)}
                                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${selectedYear === year.year
                                        ? "bg-ieee-cs-orange text-white shadow-md"
                                        : "text-gray-500 hover:text-ieee-cs-orange hover:bg-white"
                                        }`}
                                >
                                    {TEAM_PAGE_CONTENT.yearButtonPrefix} {year.year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedYear}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        {currentData?.committees.map((committee) => (
                            <section key={committee.id} className="mb-20 last:mb-0">
                                <div className="flex items-center mb-8">
                                    <h2 className="text-2xl font-bold text-ieee-dark pr-4 bg-white z-10">
                                        {committee.title}
                                    </h2>
                                    <div className="h-px bg-gray-200 flex-grow" />
                                </div>

                                <div className="flex flex-col gap-6">
                                    {splitIntoBalancedRows(
                                        committee.members,
                                        MAX_MEMBERS_PER_ROW
                                    ).map((row, rowIndex) => (
                                        <div
                                            key={`${committee.id}-row-${rowIndex}`}
                                            className="flex flex-wrap justify-center gap-6"
                                        >
                                            {row.map((member, index) => (
                                                <div
                                                    key={member.id}
                                                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-20px)] max-w-[320px]"
                                                >
                                                    <MemberCard member={member} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const Team: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="pt-24 pb-20 min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500">Loading team roster...</p>
                </div>
            </div>
        }>
            <TeamContent />
        </Suspense>
    );
};

export default Team;
