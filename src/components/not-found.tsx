import Link from "next/link";

export default function NotFound({
  title,
  message,
  backHref,
  backLabel,
}: {
  title: string;
  message?: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
        {message && <p className="mb-4 text-gray-500">{message}</p>}
        <Link href={backHref} className="text-ieee-cs-orange hover:underline">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
