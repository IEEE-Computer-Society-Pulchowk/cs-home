"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCertificatePath, getCertificatesByEmail } from "@/data/certificates";
import { getEventMetaBySlug } from "@/lib/events";
import { getTemplate } from "@/data/certificates/templates";

export default function VerifyClient() {
  // ponytail: read the query straight off location instead of useSearchParams,
  // which would force a Suspense boundary under static export.
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    // ponytail: read the browser-only query after mount so the first render
    // matches the server-prerendered (id-less) HTML — no hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(new URLSearchParams(window.location.search).get("email"));
  }, []);

  const certificates = email ? getCertificatesByEmail(email) : [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 pt-24 pb-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Verify a Certificate
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Enter an email to see all certificates issued by IEEE CS Pulchowk SBC.
        </p>

        {/* Native GET form — reloads with ?email=, which the effect above reads. */}
        <form
          action="/verify"
          method="get"
          className="mx-auto flex max-w-xl gap-2"
        >
          <input
            type="email"
            name="email"
            defaultValue={email ?? ""}
            placeholder="e.g. someone@example.com"
            className="text-black flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-ieee-cs-orange focus:outline-none"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-ieee-cs-orange px-6 py-2.5 font-semibold text-white transition-colors hover:opacity-90"
          >
            Verify
          </button>
        </form>

        {email && certificates.length === 0 && (
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">No match found</p>
            <p className="mt-1 text-sm text-red-600">
              No certificate was issued to{" "}
              <span className="font-mono">{email}</span>. Check for typos.
            </p>
          </div>
        )}

        {email && certificates.length > 0 && (
          <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6">
            <p className="font-semibold text-ieee-cs-orange text-center">
              {certificates.length} certificate{certificates.length > 1 ? "s" : ""} found
            </p>
            <div className="mt-4 space-y-3">
              {certificates.map((cert) => {
                const template = getTemplate(cert.templateId);
                const certPath = getCertificatePath(cert.templateId, cert.email);
                const event = getEventMetaBySlug(cert.eventSlug);
                return (
                  <div
                    key={`${cert.templateId}-${cert.email}`}
                    className="flex items-center justify-between rounded-lg border border-amber-100 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{template?.displayName ?? cert.templateId}</p>
                      <p className="text-sm text-gray-600">
                        {event?.title}
                      </p>
                    </div>
                    <Link href={certPath} className="text-sm font-medium text-ieee-cs-orange hover:underline">
                      View / Download
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
