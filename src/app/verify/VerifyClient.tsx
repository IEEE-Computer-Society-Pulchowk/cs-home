"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CertificateSvg from "@/components/CertificateSvg";
import { getCertificateById } from "@/data/certificates";
import { getTemplate } from "@/data/certificates/templates";

export default function VerifyClient() {
  // ponytail: read the query straight off location instead of useSearchParams,
  // which would force a Suspense boundary under static export.
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    // ponytail: read the browser-only query after mount so the first render
    // matches the server-prerendered (id-less) HTML — no hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const cert = id ? getCertificateById(id) : undefined;
  const template = cert ? getTemplate(cert.templateId) : undefined;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Verify a Certificate
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Enter a certificate ID to confirm it was issued by IEEE CS Pulchowk SBC.
        </p>

        {/* Native GET form — reloads with ?id=, which the effect above reads. */}
        <form action="/verify" method="get" className="mx-auto flex max-w-xl gap-2">
          <input
            type="text"
            name="id"
            defaultValue={id ?? ""}
            placeholder="e.g. linux-101-2026-9f3a2c"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-ieee-cs-orange focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-ieee-cs-orange px-6 py-2.5 font-semibold text-white transition-colors hover:opacity-90"
          >
            Verify
          </button>
        </form>

        {id && !cert && (
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">No match found</p>
            <p className="mt-1 text-sm text-red-600">
              No certificate has the ID <span className="font-mono">{id}</span>. Check
              for typos.
            </p>
          </div>
        )}

        {cert && template && (
          <div className="mt-10">
            <div className="mx-auto mb-6 max-w-xl rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <p className="font-semibold text-green-700">✓ Genuine certificate</p>
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">{cert.name}</span> — {cert.event}
              </p>
              <p className="text-sm text-gray-500">Issued {cert.date}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-lg sm:p-6">
              <CertificateSvg template={template} data={cert} />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Permanent link:{" "}
              <Link
                href={`/cert/${cert.certId}`}
                className="font-mono text-ieee-cs-orange hover:underline"
              >
                /cert/{cert.certId}
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
