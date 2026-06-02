import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Team",
    description:
        "Meet the executive officers, senior executives, and committee members of IEEE Computer Society Pulchowk SBC.",
    openGraph: {
        title: "Our Team | IEEE Computer Society Pulchowk SBC",
        description:
            "Meet the executive officers, senior executives, and committee members of IEEE Computer Society Pulchowk SBC.",
    },
};

export default function TeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
