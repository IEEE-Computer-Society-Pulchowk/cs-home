import type { Metadata } from "next";
import Link from "next/link";
import CertificateSvg from "@/components/CertificateSvg";
import { getCertificateById, getCertIdStaticParams } from "@/data/certificates";
import { getTemplate } from "@/data/certificates/templates";
import DownloadButton from "./DownloadButton";
import NotFound from "@/components/not-found";

// Only pre-built certificates resolve; unknown IDs 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getCertIdStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certId: string }>;
}): Promise<Metadata> {
  const { certId } = await params;
  const cert = getCertificateById(certId);
  if (!cert) return { title: "Certificate Not Found" };
  return {
    title: `${cert.name} — ${cert.event} Certificate`,
    description: `Certificate ${cert.certId} issued by IEEE CS Pulchowk SBC.`,
  };
}

export default async function CertPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = getCertificateById(certId);
  const template = cert ? getTemplate(cert.templateId) : undefined;

  if (!cert || !template) {
    return (
      <NotFound
        title="Certificate Not Found"
        message="No certificate matches this ID."
        backHref="/verify"
        backLabel="Verify a certificate"
      />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 pt-24 pb-10">
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <CertificateSvg svgId="cert-svg" template={template} data={cert} />
      </div>
      <div className="flex flex-col items-center">
        <DownloadButton svgId="cert-svg" filename={cert.certId} />
        <Link
          href={`/verify?id=${cert.certId}`}
          className="mt-3 text-sm text-gray-500 hover:text-ieee-cs-orange hover:underline border-amber-400"
        >
          Verify
        </Link>
      </div>
    </main>
  );
}
