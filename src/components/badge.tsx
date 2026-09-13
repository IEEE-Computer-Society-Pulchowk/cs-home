const TONES = {
  amber: "bg-ieee-cs-orange text-black",
  green: "bg-gray-100 text-gray-900",
};

export default function Badge({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`${TONES[tone]} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}
    >
      {children}
    </span>
  );
}
