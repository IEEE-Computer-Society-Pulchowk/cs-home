import type { Metadata } from "next";
import CertClient from "./CertClient";

export const metadata: Metadata = {
  title: "Certificate | IEEE CS Pulchowk SBC",
  robots: { index: false, follow: false },
};

// ponytail: query params (?templateId=&email=) — CertClient reads them client-side.
export default function CertPage() {
  return <CertClient />;
}
