import Link from "next/link";

export default function RelatedGrid({
  title,
  items,
}: {
  title: string;
  items: { href: string; eyebrow: string; title: string; body: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group block bg-gray-50 p-6 rounded-xl hover:bg-amber-50 transition-colors"
          >
            <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
              {item.eyebrow}
            </span>
            <h4 className="font-bold text-gray-900 group-hover:text-ieee-cs-orange transition-colors mb-2">
              {item.title}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-2">{item.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
