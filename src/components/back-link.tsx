import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-gray-500 hover:text-ieee-cs-orange transition-colors mb-8 group"
    >
      <FaArrowLeft
        size={16}
        className="mr-2 group-hover:-translate-x-1 transition-transform"
      />{" "}
      {label}
    </Link>
  );
}
