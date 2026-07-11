"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CertificateSvg from "@/components/CertificateSvg";
import DownloadButton from "./DownloadButton";
import { getCertificateByTemplateAndEmail, getCertificatePath } from "@/data/certificates";
import { getTemplate } from "@/data/certificates/templates";

function filenamePart(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9._-]/g, "_");
}

export default function CertClient() {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemplateId(params.get("templateId"));
     
    setEmail(params.get("email"));
  }, []);

  const cert = templateId && email ? getCertificateByTemplateAndEmail(templateId, email) : undefined;
  const template = cert ? getTemplate(cert.templateId) : undefined;

  if (!templateId || !email || !cert || !template) {
    return (
      <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 pt-24 pb-10">
        <div className="w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Certificate Not Found</p>
          <p className="mt-1 text-sm text-red-600">Use /cert?templateId=...&email=...</p>
          <Link href="/verify" className="mt-4 inline-block text-sm text-ieee-cs-orange hover:underline">
            Find certificates by email
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 pt-24 pb-10">
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <CertificateSvg svgId="cert-svg" template={template} data={cert} />
      </div>
      <div className="flex flex-col items-center">
        <DownloadButton svgId="cert-svg" filename={`${cert.templateId}-${filenamePart(cert.email)}`} />
        <Link
          href={`/verify?email=${cert.email}`}
          className="mt-3 text-sm text-gray-500 hover:text-ieee-cs-orange hover:underline border-amber-400"
        >
          Find all certificates for this email
        </Link>
        <p className="mt-3 text-xs text-gray-500 font-mono">{getCertificatePath(cert.templateId, cert.email)}</p>
      </div>
    </main>
  );
}
