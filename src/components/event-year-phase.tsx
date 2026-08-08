"use client";

import React, { useMemo, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { transformPersonMentions } from "@/lib/mentions";
import { FaCalendar, FaClock, FaMapMarker, FaRulerHorizontal } from "react-icons/fa";
import type { EventPhase as Phase, EventYearDetail as YearDetails } from "@/types";

function EventYearPhaseContent({
  years = {},
  topDescription,
}: {
  years: Record<string, YearDetails>;
  topDescription?: string;
}) {
  const entries = useMemo(() => Object.entries(years || {}), [years]);
  const now = useMemo(() => new Date(), []);

  const parseDate = (d?: string) => {
    if (!d) return NaN;
    if (d.trim().toUpperCase() === "TBD") return NaN;
    const parsed = Date.parse(d);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const getPhaseStartDate = (phase?: Phase) => phase?.startDate;

  const getPhaseDateRange = (phase?: Phase) => {
    const startDate = phase?.startDate;
    const endDate = phase?.endDate;

    if (!startDate && !endDate) {
      return `TBD`;
    }

    if (!startDate && endDate ) {
      return endDate;
    }

    if (!endDate || endDate === startDate) {
      return startDate;
    }

    return `${startDate} - ${endDate}`;
  };

  const getPhaseTimeRange = (phase?: Phase) => {
    const startTime = phase?.startTime;
    const endTime = phase?.endTime;

    if (!startTime && !endTime) {
      return undefined;
    }

    if (!startTime) {
      return endTime;
    }

    if (!endTime || endTime === startTime) {
      return startTime;
    }

    return `${startTime} - ${endTime}`;
  };

  const initialSelection = useMemo(() => {
    if (entries.length === 0) return { year: null, phaseIndex: null };

    const nowTime = now.getTime();

    const conductedPhases = entries.flatMap(([year, details]) =>
      (details?.phases || [])
        .map((phase, phaseIndex) => ({
          year,
          phase,
          phaseIndex,
          timestamp: parseDate(getPhaseStartDate(phase)),
        }))
        .filter(
          ({ timestamp }) => !Number.isNaN(timestamp) && timestamp <= nowTime,
        ),
    );

    if (conductedPhases.length > 0) {
      const latestConducted = conductedPhases.reduce((latest, current) =>
        current.timestamp > latest.timestamp ? current : latest,
      );
      return {
        year: latestConducted.year,
        phaseIndex: latestConducted.phaseIndex,
      };
    }

    const upcomingPhases = entries.flatMap(([year, details]) =>
      (details?.phases || [])
        .map((phase, phaseIndex) => ({
          year,
          phase,
          phaseIndex,
          timestamp: parseDate(getPhaseStartDate(phase)),
        }))
        .filter(({ timestamp }) => !Number.isNaN(timestamp)),
    );

    if (upcomingPhases.length > 0) {
      const earliestUpcoming = upcomingPhases.reduce((earliest, current) =>
        current.timestamp < earliest.timestamp ? current : earliest,
      );
      return {
        year: earliestUpcoming.year,
        phaseIndex: earliestUpcoming.phaseIndex,
      };
    }

    const numericYears = entries
      .map(([y]) => ({ y, n: Number(y) }))
      .filter((x) => !Number.isNaN(x.n));

    if (numericYears.length) {
      const latest = numericYears.reduce((a, b) => (a.n > b.n ? a : b));
      const details = years[latest.y];
      return { year: latest.y, phaseIndex: details?.phases?.length ? 0 : null };
    }

    const last = entries[entries.length - 1];
    return { year: last[0], phaseIndex: last[1]?.phases?.length ? 0 : null };
  }, [entries, years, now]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlYear = searchParams.get("year");
  const urlPhase = searchParams.get("phase");

  const selectedYear =
    urlYear && years[urlYear] ? urlYear : initialSelection.year;

  if (entries.length === 0) return null;

  const selectedDetails = selectedYear
    ? (years[selectedYear] as YearDetails)
    : null;
  const phases = selectedDetails?.phases || [];

  const parsedPhase = Number(urlPhase);
  const hasValidUrlPhase =
    urlPhase != null &&
    Number.isInteger(parsedPhase) &&
    parsedPhase >= 0 &&
    parsedPhase < phases.length;

  const autoPhaseIndex =
    selectedYear === initialSelection.year
      ? initialSelection.phaseIndex
      : phases.length
        ? 0
        : null;

  const selectedPhaseIndex = hasValidUrlPhase ? parsedPhase : autoPhaseIndex;

  const setSelection = (year: string, phase: number | null) => {
    const params = new URLSearchParams();
    params.set("year", year);
    if (phase != null) params.set("phase", String(phase));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentRegistration = () => {
    if (selectedPhaseIndex == null) return undefined;
    return phases[selectedPhaseIndex]?.registrationUrl;
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      {entries.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {entries.map(([year]) => (
            <button
              key={year}
              onClick={() =>
                setSelection(
                  year,
                  years[year]?.phases?.length ? 0 : null,
                )
              }
              className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm whitespace-nowrap ${selectedYear === year ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-amber-50"}`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
      {selectedDetails && phases.length > 1 && (
        <>
        {selectedDetails.title && (
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {selectedDetails.title}
          </h3>
        )}

        {selectedDetails.slogan && (
          <p className="text-sm text-amber-700 font-medium mb-3">
            {selectedDetails.slogan}
          </p>
        )}
        {selectedDetails.description && (
          <div className="prose prose-sm prose-amber max-w-none text-gray-700 leading-relaxed mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {transformPersonMentions(selectedDetails.description)}
            </ReactMarkdown>
          </div>
        )}
        <div className="flex gap-3 flex-wrap mb-6">
          {phases.map((ph, idx) => (
            <button
              key={idx}
              onClick={() => setSelection(selectedYear ?? "", idx)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${selectedPhaseIndex === idx ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-amber-50"}`}
            >
              {ph.title ?? `Phase ${ph.phase ?? idx + 1}`}
            </button>
          ))}
        </div></>
      )}

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {selectedPhaseIndex != null && phases[selectedPhaseIndex] ? (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {phases[selectedPhaseIndex].title}
                </h4>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  {getPhaseDateRange(phases[selectedPhaseIndex]) && (
                    <span><FaCalendar className="inline-block" /> {getPhaseDateRange(phases[selectedPhaseIndex])}</span>
                  )}
                  {getPhaseTimeRange(phases[selectedPhaseIndex]) && getPhaseDateRange(phases[selectedPhaseIndex])?.toLowerCase?.() === "tbd" && (
                    <span><FaClock className="inline-block" /> {getPhaseTimeRange(phases[selectedPhaseIndex])}</span>
                  )}
                  {phases[selectedPhaseIndex].duration && (
                    <span><FaRulerHorizontal className="inline-block" /> {phases[selectedPhaseIndex].duration}</span>
                  )}
                  {phases[selectedPhaseIndex].location && (
                    <span><FaMapMarker className="inline-block" /> {phases[selectedPhaseIndex].location}</span>
                  )}
                </div>
                <div className="prose prose-sm prose-amber max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {transformPersonMentions(
                      phases[selectedPhaseIndex].body ?? "",
                    )}
                  </ReactMarkdown>
                </div>
              </div>
            ) : selectedDetails ? (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedDetails.title}
                </h4>
                {selectedDetails.slogan && (
                  <p className="text-sm text-amber-700 font-medium mb-3">
                    {selectedDetails.slogan}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Select a phase to view its markdown body.
                </p>
              </div>
            ) : (
              <div>
                {topDescription ? (
                  <div className="prose prose-lg prose-amber max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {transformPersonMentions(topDescription)}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    All event years are available from the buttons above. Pick a
                    year to inspect its phases.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0">
            {currentRegistration() && (
              <a
                href={currentRegistration()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700"
              >
                Register
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventYearPhase(props: {
  years: Record<string, YearDetails>;
  topDescription?: string;
}) {
  return (
    <Suspense fallback={null}>
      <EventYearPhaseContent {...props} />
    </Suspense>
  );
}
