import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Verify a Certificate | IEEE CS Pulchowk SBC",
  description: "Find all certificates issued to an email address.",
};

// Static export has no server at runtime, so the lookup happens client-side
// against the bundled (PII-free) certificate data. See VerifyClient.
export default function VerifyPage() {
  return <VerifyClient />;
}
