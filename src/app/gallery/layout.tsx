import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description:
        "A visual journey through IEEE Computer Society Pulchowk SBC events, workshops, and community gatherings.",
    openGraph: {
        title: "Gallery | IEEE Computer Society Pulchowk SBC",
        description:
            "A visual journey through IEEE Computer Society Pulchowk SBC events, workshops, and community gatherings.",
    },
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
