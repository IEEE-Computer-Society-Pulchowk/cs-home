"use client";

import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { transformPersonMentions } from "@/lib/mentions";

type Phase = {
  phase?: number | string;
  title?: string;
  date?: string;
  location?: string;
  duration?: string;
  body: string;
  registrationUrl?: string;
  isUpcoming?: boolean;
};

type YearDetails = {
  title: string;
  slogan?: string;
  isUpcoming?: boolean;
  registrationUrl?: string;
  phases?: Phase[];
};

export default function EventYearPhase({
  years = {},
  topDescription,
}: {
  years: Record<string, YearDetails>;
  topDescription?: string;
}) {
  const entries = useMemo(() => Object.entries(years || {}), [years]);
  const now = useMemo(() => new Date(), []);

  function parseDate(d?: string) {
    if (!d) return NaN;
    if (d.trim().toUpperCase() === "TBD") return NaN;
    const parsed = Date.parse(d);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    const conductedPhases = entries.flatMap(([year, details]) =>
      (details?.phases || [])
        .map((phase, phaseIndex) => ({
          year,
          phase,
          phaseIndex,
          timestamp: parseDate(phase?.date),
        }))
        .filter(({ timestamp }) => !Number.isNaN(timestamp) && timestamp <= now.getTime())
    );

    if (conductedPhases.length > 0) {
      const latestConducted = conductedPhases.reduce((latest, current) =>
        current.timestamp > latest.timestamp ? current : latest
      );

      setSelectedYear(latestConducted.year);
      setSelectedPhaseIndex(latestConducted.phaseIndex);
      return;
    }

    const upcomingPhases = entries.flatMap(([year, details]) =>
      (details?.phases || [])
        .map((phase, phaseIndex) => ({
          year,
          phase,
          phaseIndex,
          timestamp: parseDate(phase?.date),
        }))
        .filter(({ timestamp }) => !Number.isNaN(timestamp))
    );

    if (upcomingPhases.length > 0) {
      const earliestUpcoming = upcomingPhases.reduce((earliest, current) =>
        current.timestamp < earliest.timestamp ? current : earliest
      );

      setSelectedYear(earliestUpcoming.year);
      setSelectedPhaseIndex(earliestUpcoming.phaseIndex);
      return;
    }

    const numericYears = entries
      .map(([y]) => ({ y, n: Number(y) }))
      .filter((x) => !Number.isNaN(x.n));

    if (numericYears.length) {
      const latest = numericYears.reduce((a, b) => (a.n > b.n ? a : b));
      setSelectedYear(latest.y);
      const details = years[latest.y];
      setSelectedPhaseIndex(details?.phases?.length ? 0 : null);
      return;
    }

    const last = entries[entries.length - 1];
    setSelectedYear(last[0]);
    setSelectedPhaseIndex(last[1]?.phases?.length ? 0 : null);
  }, [entries, years, now]);

  if (entries.length === 0) return null;

  const selectedDetails = selectedYear ? (years[selectedYear] as YearDetails) : null;
  const phases = selectedDetails?.phases || [];

  const currentRegistration = () => {
    if (selectedPhaseIndex != null) {
      const p = phases[selectedPhaseIndex];
      return p?.registrationUrl ?? selectedDetails?.registrationUrl;
    }
    return selectedDetails?.registrationUrl;
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      {entries.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {entries.map(([year]) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSelectedPhaseIndex(years[year]?.phases?.length ? 0 : null);
              }}
              className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm whitespace-nowrap ${selectedYear === year ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-amber-50"}`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {selectedDetails && phases.length > 1 && (
        <div className="flex gap-3 flex-wrap mb-6">
          {phases.map((ph, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhaseIndex(idx)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${selectedPhaseIndex === idx ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-amber-50"}`}
            >
              {ph.title ?? `Phase ${ph.phase ?? idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {selectedPhaseIndex != null && phases[selectedPhaseIndex] ? (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{phases[selectedPhaseIndex].title}</h4>
                {selectedDetails && selectedDetails.slogan && (
                  <p className="text-sm text-amber-700 font-medium mb-3">{selectedDetails.slogan}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  {phases[selectedPhaseIndex].date && <span>{phases[selectedPhaseIndex].date}</span>}
                  {phases[selectedPhaseIndex].duration && <span>{phases[selectedPhaseIndex].duration}</span>}
                  {phases[selectedPhaseIndex].location && <span>{phases[selectedPhaseIndex].location}</span>}
                </div>
                <div className="prose prose-sm prose-amber max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown>
                    {transformPersonMentions(phases[selectedPhaseIndex].body)}
                  </ReactMarkdown>
                </div>
              </div>
            ) : selectedDetails ? (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{selectedDetails.title}</h4>
                {selectedDetails.slogan && <p className="text-sm text-amber-700 font-medium mb-3">{selectedDetails.slogan}</p>}
                <p className="text-sm text-gray-600">Select a phase to view its markdown body.</p>
              </div>
            ) : (
              <div>
                {topDescription ? (
                  <div className="prose prose-lg prose-amber max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown>{transformPersonMentions(topDescription)}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">All event years are available from the buttons above. Pick a year to inspect its phases.</p>
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
